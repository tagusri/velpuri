"""Crazy Cravings Flask application.

Run with: py app.py
Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and DB_NAME in PowerShell.
"""
import os
from pathlib import Path

from flask import Flask, jsonify, redirect, request, send_from_directory, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash
import mysql.connector
from mysql.connector import Error

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "local-development-only-change-this-secret"
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("COOKIE_SECURE", "0") == "1",
)

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "port": int(os.environ.get("DB_PORT", "3306")),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", ""),
    "database": "restaurant_db",
    "connection_timeout": 5,
}
PROTECTED_PAGES = {"menu.html", "order.html", "booking.html", "dashboard.html"}


def get_db_connection():
    """Open a DB connection and ensure the password column supports hashes."""
    if not DB_CONFIG["password"]:
        raise RuntimeError(
            "DB_PASSWORD is not set. In PowerShell run: "
            '$env:DB_PASSWORD = "your actual MySQL password"'
        )
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.execute(
            "CREATE TABLE IF NOT EXISTS users ("
            "id INT AUTO_INCREMENT PRIMARY KEY,"
            "name VARCHAR(100) NOT NULL,"
            "phone VARCHAR(20) NOT NULL,"
            "email VARCHAR(254) NOT NULL UNIQUE,"
            "password VARCHAR(255) NOT NULL)"
        )
        cursor.execute("ALTER TABLE users MODIFY password VARCHAR(255) NOT NULL")
        connection.commit()
    except Exception:
        connection.close()
        raise
    finally:
        if cursor is not None:
            cursor.close()
    return connection


def clean(value):
    return value.strip() if isinstance(value, str) else ""


@app.route("/")
def root():
    return redirect(url_for("home" if session.get("user_id") else "login"))


@app.route("/home")
def home():
    return send_from_directory(BASE_DIR, "home.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        if session.get("user_id"):
            return redirect(url_for("home"))
        return send_from_directory(BASE_DIR, "login.html")

    email = clean(request.form.get("email")).lower()
    password = request.form.get("password", "")
    if not email or not password:
        return redirect(url_for("login", error="required"))

    connection = cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "SELECT id, name, email, password FROM users WHERE LOWER(email) = %s LIMIT 1",
            (email,),
        )
        user = cursor.fetchone()
        if not user:
            return redirect(url_for("login", error="invalid"))

        stored_password = user[3] or ""
        is_hash = stored_password.startswith(("pbkdf2:", "scrypt:"))
        valid = check_password_hash(stored_password, password) if is_hash else stored_password == password
        if not valid:
            return redirect(url_for("login", error="invalid"))

        if not is_hash:
            cursor.execute(
                "UPDATE users SET password = %s WHERE id = %s",
                (generate_password_hash(password), user[0]),
            )
            connection.commit()

        session.clear()
        session["user_id"], session["name"], session["email"] = user[0], user[1], user[2]
        return redirect(url_for("home"))
    except (Error, RuntimeError, ValueError):
        app.logger.exception("Database/configuration error while logging in")
        return redirect(url_for("login", error="database"))
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None and connection.is_connected():
            connection.close()


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return send_from_directory(BASE_DIR, "register.html")

    payload = request.get_json(silent=True) or request.form
    name, phone = clean(payload.get("name")), clean(payload.get("phone"))
    email, password = clean(payload.get("email")).lower(), payload.get("password", "")
    wants_json = request.is_json or request.accept_mimetypes.best == "application/json"

    def fail(message, status=400):
        if wants_json:
            return jsonify({"ok": False, "message": message}), status
        return message, status

    if not name or not phone or not email or not password:
        return fail("Please fill all required fields.")
    if len(name) > 100 or len(phone) > 20 or len(email) > 254:
        return fail("One or more fields are too long.")
    if len(password) < 6:
        return fail("Password must contain at least 6 characters.")
    if "@" not in email or "." not in email.rsplit("@", 1)[-1]:
        return fail("Enter a valid email address.")

    connection = cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT id FROM users WHERE LOWER(email) = %s LIMIT 1", (email,))
        if cursor.fetchone():
            return fail("This email is already registered.", 409)
        cursor.execute(
            "INSERT INTO users (name, phone, email, password) VALUES (%s, %s, %s, %s)",
            (name, phone, email, generate_password_hash(password)),
        )
        connection.commit()
        if wants_json:
            return jsonify({"ok": True, "message": "Registration successful. You can now log in."}), 201
        return redirect(url_for("login", registered="1"))
    except (Error, RuntimeError, ValueError):
        if connection is not None:
            connection.rollback()
        app.logger.exception("Database/configuration error while registering")
        return fail("Registration service is temporarily unavailable. Check the Flask terminal and database configuration.", 503)
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None and connection.is_connected():
            connection.close()


@app.route("/menu")
def menu():
    if not session.get("user_id"):
        return redirect(url_for("login", error="account"))
    return send_from_directory(BASE_DIR, "menu.html")


@app.route("/logout", methods=["GET", "POST"])
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/forgot-password")
def forgot_password():
    return (
        "<!doctype html><html lang='en'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>"
        "<title>Password Help - Crazy Cravings</title><body style='font-family:Arial,sans-serif;max-width:600px;margin:12vh auto;padding:24px'>"
        "<h1>Password help</h1><p>Password reset is not enabled yet. Please contact the restaurant administrator to reset your account.</p>"
        "<p><a href='/login'>Return to login</a></p></body></html>"
    )


@app.route("/<path:filename>")
def files(filename):
    if filename in PROTECTED_PAGES and not session.get("user_id"):
        return redirect(url_for("login", error="account"))
    target = (BASE_DIR / filename).resolve()
    if BASE_DIR not in target.parents or not target.is_file():
        return "File not found", 404
    return send_from_directory(BASE_DIR, filename)


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "0") == "1")