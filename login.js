
document.addEventListener("DOMContentLoaded", function () {
  const loginView = document.getElementById("loginView");
  const registerView = document.getElementById("registerView");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const profileResult = document.getElementById("profileResult");

  // Fill the date dropdown.
  const daySelect = document.getElementById("birthDay");

  if (daySelect) {
    for (let day = 1; day <= 31; day++) {
      const option = document.createElement("option");
      option.value = String(day);
      option.textContent = String(day);
      daySelect.appendChild(option);
    }
  }

  // Fill the year dropdown.
  const yearSelect = document.getElementById("birthYear");

  if (yearSelect) {
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= currentYear - 100; year--) {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = String(year);
      yearSelect.appendChild(option);
    }
  }

  // Switch from login to registration in the SAME popup.
  const openRegister = document.getElementById("openRegister");

  if (openRegister) {
    openRegister.addEventListener("click", function (event) {
      event.preventDefault();
      loginView.hidden = true;
      registerView.hidden = false;
    });
  }

  // Switch back to login.
  const openLogin = document.getElementById("openLogin");
  const goToLogin = document.getElementById("goToLogin");

  function showLogin() {
    registerView.hidden = true;
    loginView.hidden = false;

    if (registerForm) registerForm.reset();

    const message = document.getElementById("registerMessage");
    if (message) message.textContent = "";

    if (profileResult) profileResult.hidden = true;
  }

  if (openLogin) {
    openLogin.addEventListener("click", function (event) {
      event.preventDefault();
      showLogin();
    });
  }

  if (goToLogin) {
    goToLogin.addEventListener("click", showLogin);
  }

  // Close popup and go to the homepage.
  const closePopup = document.getElementById("closePopup");

  if (closePopup) {
    closePopup.addEventListener("click", function () {
      window.location.href = "home.html";
    });
  }

  // Show/hide login password.
  const eyeButton = document.querySelector("[data-toggle='password']");
  const passwordInput = document.getElementById("password");

  if (eyeButton && passwordInput) {
    eyeButton.addEventListener("click", function () {
      const isHidden = passwordInput.type === "password";

      passwordInput.type = isHidden ? "text" : "password";
      eyeButton.textContent = isHidden ? "◎" : "◉";
      eyeButton.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
      );
    });
  }

  // DEMO LOGIN: accepts any valid-format email and non-empty password.
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const message = document.getElementById("loginMessage");

      if (!email || !password.trim()) {
        message.textContent = "Please enter your email ID and password.";
        message.style.color = "red";
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        message.textContent = "Please enter a valid email address.";
        message.style.color = "red";
        return;
      }

      message.textContent = "Login successful! Opening homepage...";
      message.style.color = "green";

      setTimeout(function () {
        window.location.href = "home.html";
      }, 800);
    });
  }

  // REGISTER: show the human icon and entered full name.
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!registerForm.checkValidity()) {
        registerForm.reportValidity();
        return;
      }

      const firstName = document.getElementById("firstName").value.trim();
      const surname = document.getElementById("surname").value.trim();
      const email = document.getElementById("registerEmail").value.trim();

      const fullName = [firstName, surname].filter(Boolean).join(" ");

      try {
        localStorage.setItem("crazyCravingsProfileName", fullName);
        localStorage.setItem("crazyCravingsProfileEmail", email);
      } catch (error) {
        // The success card still works if browser storage is unavailable.
      }

      document.getElementById("profileName").textContent = fullName;

      document.getElementById("registerMessage").textContent =
        "Your details have been submitted successfully!";

      document.getElementById("registerMessage").style.color = "green";

      // Hide the registration fields and show the profile card.
      registerForm.hidden = true;

      const registerSwitch = document.getElementById("registerSwitch");
      if (registerSwitch) registerSwitch.hidden = true;

      profileResult.hidden = false;
    });
  }

  // Show the saved profile name beside account icons on pages
  // that also load style.js and contain .account-icon.
  try {
    const savedName = localStorage.getItem("crazyCravingsProfileName");

    if (savedName) {
      document.querySelectorAll(".account-icon").forEach(function (icon) {
        const nameLabel = icon.querySelector(".header-profile-name");

        if (nameLabel) {
          nameLabel.textContent = savedName;
          nameLabel.style.display = "inline";
          icon.style.width = "auto";
          icon.style.padding = "0 10px";
          icon.style.borderRadius = "22px";
        }

        icon.setAttribute("aria-label", "Account: " + savedName);
      });
    }
  } catch (error) {
    // Continue normally if browser storage is unavailable.
  }
});
