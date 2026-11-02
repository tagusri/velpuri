# Crazy Cravings

## Run locally

1. Install Python 3.10 or newer and MySQL Server.
2. Open a terminal in this project folder and install dependencies:

   ```bash
   python -m venv .venv
   # Windows: .venv\\Scripts\\activate
   # macOS/Linux: source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. Create the database/table by running `data.sql` in MySQL Workbench or the MySQL CLI.
4. Configure the database connection with environment variables. Example for Windows PowerShell:

   ```powershell
   $env:DB_HOST="localhost"
   $env:DB_PORT="3306"
   $env:DB_USER="root"
   $env:DB_PASSWORD="your_mysql_password"
   $env:DB_NAME="restaurant_db"
   $env:FLASK_SECRET_KEY="replace-with-a-long-random-secret"
   python app.py
   ```

   macOS/Linux shell example:

   ```bash
   export DB_HOST=localhost DB_PORT=3306 DB_USER=root DB_PASSWORD='your_mysql_password' DB_NAME=restaurant_db
   export FLASK_SECRET_KEY='replace-with-a-long-random-secret'
   python app.py
   ```

5. Open `http://127.0.0.1:5000/login` in your browser. Use the Register page to create an account, then log in.

## Important notes

- Account passwords are stored as password hashes. Existing legacy plain-text passwords are upgraded to hashes after a successful login.
- The app updates the `users.password` column to `VARCHAR(255)` for compatibility with password hashes.
- Registration's six-digit OTP remains a **demo-only client-side check**; it does not send an SMS and should not be treated as production identity verification.
- Password reset is not implemented; the help page explains this rather than claiming an email was sent.
- The booking and feedback forms currently show demo confirmations and do not persist bookings/feedback in MySQL.
- Do not deploy with the development secret key or Flask debug mode enabled. Set a unique `FLASK_SECRET_KEY` and use HTTPS in production (`COOKIE_SECURE=1`).
