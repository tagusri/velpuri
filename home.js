/* =========================================================
   CRAZY CRAVINGS - COMPLETE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       STORAGE
       ===================================================== */

    const ACCOUNTS_KEY = "crazyCravingsAccounts";
    const CURRENT_USER_KEY = "crazyCravingsCurrentUser";


    function getAccounts() {

        try {

            return JSON.parse(
                localStorage.getItem(ACCOUNTS_KEY)
            ) || [];

        } catch (error) {

            return [];

        }

    }


    function saveAccounts(accounts) {

        localStorage.setItem(
            ACCOUNTS_KEY,
            JSON.stringify(accounts)
        );

    }


    function getCurrentUser() {

        try {

            return JSON.parse(
                localStorage.getItem(CURRENT_USER_KEY)
            );

        } catch (error) {

            return null;

        }

    }


    function saveCurrentUser(user) {

        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify(user)
        );

    }


    function clearCurrentUser() {

        localStorage.removeItem(CURRENT_USER_KEY);

    }


    /* =====================================================
       INITIALS
       ===================================================== */

    function cleanName(value) {

        return String(value || "")
            .trim()
            .replace(/\s+/g, " ");

    }


    function getNameInitials(firstName, surname) {

        const first = cleanName(firstName);
        const last = cleanName(surname);

        if (!first) {
            return "";
        }

        const firstLetter =
            first.charAt(0).toUpperCase();

        if (last) {

            const surnameLetter =
                last.charAt(0).toUpperCase();

            return firstLetter + surnameLetter;

        }

        return firstLetter;

    }


    function getEmailFirstInitial(email) {

        const value =
            String(email || "").trim();

        if (!value) {
            return "?";
        }

        const localPart =
            value.split("@")[0].trim();

        if (!localPart) {
            return "?";
        }

        return localPart
            .charAt(0)
            .toUpperCase();

    }


    function getUserInitials(user) {

        if (!user) {
            return "?";
        }

        const nameInitials =
            getNameInitials(
                user.firstName,
                user.surname
            );

        if (nameInitials) {
            return nameInitials;
        }

        return getEmailFirstInitial(user.email);

    }


    function getUserDisplayName(user) {

        if (!user) {
            return "Guest";
        }

        const first =
            cleanName(user.firstName);

        const surname =
            cleanName(user.surname);

        if (first && surname) {
            return first + " " + surname;
        }

        if (first) {
            return first;
        }

        return user.email || "Guest";

    }


    function findAccountByEmail(email) {

        const accounts = getAccounts();

        const normalizedEmail =
            String(email || "")
                .trim()
                .toLowerCase();

        return accounts.find(function (account) {

            return String(account.email || "")
                .trim()
                .toLowerCase() === normalizedEmail;

        }) || null;

    }


    /* =====================================================
       HEADER ACCOUNT SYSTEM
       ===================================================== */

    const desktopNavbar =
        document.querySelector(".desktop-navbar");

    const desktopLoginButton =
        document.querySelector(
            ".desktop-navbar .login-button"
        );

    const profileIcon =
        document.querySelector(
            ".desktop-navbar .profile-icon"
        );

    const mobileLoginButton =
        document.querySelector(
            ".mobile-navbar .login-button"
        );


    let accountMenu = null;


    if (desktopNavbar && profileIcon) {

        /* CREATE INITIALS ELEMENT */

        let profileInitials =
            profileIcon.querySelector(
                ".profile-initials"
            );

        if (!profileInitials) {

            profileInitials =
                document.createElement("span");

            profileInitials.className =
                "profile-initials";

            profileInitials.id =
                "profileInitials";

            profileIcon.appendChild(
                profileInitials
            );

        }


        /* CREATE ACCOUNT AREA */

        const accountArea =
            document.createElement("div");

        accountArea.className =
            "account-area";


        desktopNavbar.insertBefore(
            accountArea,
            desktopLoginButton
        );


        if (desktopLoginButton) {

            accountArea.appendChild(
                desktopLoginButton
            );

        }

        accountArea.appendChild(
            profileIcon
        );


        /* CREATE ACCOUNT MENU */

        accountMenu =
            document.createElement("div");

        accountMenu.className =
            "account-menu";

        accountMenu.id =
            "accountMenu";

        accountMenu.innerHTML = `

            <div
                class="account-menu-profile"
                id="accountMenuProfile"
                hidden>

                <div
                    class="account-menu-avatar"
                    id="accountMenuAvatar">
                    ?
                </div>

                <div class="account-menu-user-info">

                    <strong
                        id="accountMenuUserName">
                        Guest
                    </strong>

                    <span
                        id="accountMenuUserEmail">
                    </span>

                </div>

            </div>


            <button
                type="button"
                class="account-menu-button"
                id="menuSignIn">
                Sign In
            </button>


            <button
                type="button"
                class="account-menu-button"
                id="menuSignOut">
                Sign Out
            </button>

        `;


        accountArea.appendChild(
            accountMenu
        );

    }


    /* =====================================================
       AUTH ELEMENTS
       ===================================================== */

    const authOverlay =
        document.getElementById(
            "authOverlay"
        );

    const authClose =
        document.getElementById(
            "authClose"
        );

    const authTitle =
        document.getElementById(
            "authTitle"
        );

    const authSubtitle =
        document.getElementById(
            "authSubtitle"
        );

    const authError =
        document.getElementById(
            "authError"
        );

    const authAvatarLarge =
        document.getElementById(
            "authAvatarLarge"
        );

    const signInForm =
        document.getElementById(
            "signInForm"
        );

    const signUpForm =
        document.getElementById(
            "signUpForm"
        );

    const authSuccess =
        document.getElementById(
            "authSuccess"
        );

    const successTitle =
        document.getElementById(
            "successTitle"
        );

    const successEmail =
        document.getElementById(
            "successEmail"
        );

    const successInitials =
        document.getElementById(
            "successInitials"
        );

    const authHomeButton =
        document.getElementById(
            "authHomeButton"
        );


    const signInEmail =
        document.getElementById(
            "signInEmail"
        );

    const signInPassword =
        document.getElementById(
            "signInPassword"
        );

    const signInPreview =
        document.getElementById(
            "signInPreview"
        );


    const signUpFirstName =
        document.getElementById(
            "signUpFirstName"
        );

    const signUpSurname =
        document.getElementById(
            "signUpSurname"
        );

    const signUpEmail =
        document.getElementById(
            "signUpEmail"
        );

    const signUpPassword =
        document.getElementById(
            "signUpPassword"
        );

    const signUpConfirmPassword =
        document.getElementById(
            "signUpConfirmPassword"
        );

    const signUpPreview =
        document.getElementById(
            "signUpPreview"
        );

    const showSignUp =
        document.getElementById(
            "showSignUp"
        );

    const showSignIn =
        document.getElementById(
            "showSignIn"
        );


    /* =====================================================
       UPDATE HEADER
       ===================================================== */

    function updateHeader() {

        const user =
            getCurrentUser();

        if (!profileIcon) {
            return;
        }

        const initials =
            getUserInitials(user);

        const profileInitials =
            document.getElementById(
                "profileInitials"
            );

        if (profileInitials) {

            profileInitials.textContent =
                initials;

        }


        if (user) {

            profileIcon.classList.add(
                "logged-in"
            );

            profileIcon.setAttribute(
                "aria-label",
                "Account"
            );

            if (desktopLoginButton) {

                desktopLoginButton.style.display =
                    "none";

            }

        } else {

            profileIcon.classList.remove(
                "logged-in"
            );

            profileIcon.setAttribute(
                "aria-label",
                "Login"
            );

            if (desktopLoginButton) {

                desktopLoginButton.style.display =
                    "inline-flex";

            }

        }


        const menuProfile =
            document.getElementById(
                "accountMenuProfile"
            );

        const menuAvatar =
            document.getElementById(
                "accountMenuAvatar"
            );

        const menuName =
            document.getElementById(
                "accountMenuUserName"
            );

        const menuEmail =
            document.getElementById(
                "accountMenuUserEmail"
            );

        const menuSignOut =
            document.getElementById(
                "menuSignOut"
            );


        if (user) {

            if (menuProfile) {
                menuProfile.hidden = false;
            }

            if (menuAvatar) {
                menuAvatar.textContent = initials;
            }

            if (menuName) {
                menuName.textContent =
                    getUserDisplayName(user);
            }

            if (menuEmail) {
                menuEmail.textContent =
                    user.email || "";
            }

            if (menuSignOut) {
                menuSignOut.disabled = false;
            }

        } else {

            if (menuProfile) {
                menuProfile.hidden = true;
            }

            if (menuSignOut) {
                menuSignOut.disabled = true;
            }

        }

    }


    /* =====================================================
       AUTH MODE
       ===================================================== */

    function clearAuthError() {

        if (authError) {
            authError.textContent = "";
        }

    }


    function showAuthError(message) {

        if (authError) {
            authError.textContent = message;
        }

    }


    function resetSuccess() {

        if (authSuccess) {
            authSuccess.hidden = true;
        }

        if (successEmail) {
            successEmail.textContent = "";
        }

        if (successInitials) {
            successInitials.textContent = "";
        }

    }


    function showSignInMode() {

        clearAuthError();
        resetSuccess();

        if (signInForm) {
            signInForm.hidden = false;
        }

        if (signUpForm) {
            signUpForm.hidden = true;
        }

        if (authTitle) {
            authTitle.textContent = "Sign In";
        }

        if (authSubtitle) {
            authSubtitle.textContent =
                "Sign in to your Crazy Cravings account.";
        }

        updateSignInPreview();

    }


    function showSignUpMode() {

        clearAuthError();
        resetSuccess();

        if (signInForm) {
            signInForm.hidden = true;
        }

        if (signUpForm) {
            signUpForm.hidden = false;
        }

        if (authTitle) {
            authTitle.textContent =
                "Create Your Account";
        }

        if (authSubtitle) {
            authSubtitle.textContent =
                "Create your Crazy Cravings account.";
        }

        updateSignUpPreview();

    }


    function openAuth(mode) {

        if (!authOverlay) {
            return;
        }

        accountMenu?.classList.remove("show");

        clearAuthError();

        resetSuccess();

        authOverlay.hidden = false;

        document.body.classList.add(
            "modal-open"
        );

        if (mode === "signup") {
            showSignUpMode();
        } else {
            showSignInMode();
        }

    }


    function closeAuth() {

        if (!authOverlay) {
            return;
        }

        authOverlay.hidden = true;

        document.body.classList.remove(
            "modal-open"
        );

        clearAuthError();

    }


    /* =====================================================
       SIGN IN PREVIEW
       ===================================================== */

    function updateSignInPreview() {

        if (!signInPreview) {
            return;
        }

        const email =
            signInEmail
                ? signInEmail.value.trim()
                : "";

        if (!email) {

            signInPreview.textContent =
                "?";

            if (authAvatarLarge) {
                authAvatarLarge.textContent = "?";
            }

            return;

        }

        const account =
            findAccountByEmail(email);

        let initials;

        if (account) {

            initials =
                getUserInitials(account);

        } else {

            initials =
                getEmailFirstInitial(email);

        }

        signInPreview.textContent =
            initials;

        if (authAvatarLarge) {
            authAvatarLarge.textContent =
                initials;
        }

    }


    /* =====================================================
       SIGN UP PREVIEW
       ===================================================== */

    function updateSignUpPreview() {

        if (!signUpPreview) {
            return;
        }

        const firstName =
            signUpFirstName
                ? signUpFirstName.value.trim()
                : "";

        const surname =
            signUpSurname
                ? signUpSurname.value.trim()
                : "";

        const email =
            signUpEmail
                ? signUpEmail.value.trim()
                : "";


        let initials =
            getNameInitials(
                firstName,
                surname
            );


        if (!initials && email) {

            initials =
                getEmailFirstInitial(email);

        }


        if (!initials) {
            initials = "?";
        }


        signUpPreview.textContent =
            initials;

        if (authAvatarLarge) {
            authAvatarLarge.textContent =
                initials;
        }

    }


    /* =====================================================
       SIGN IN
       ANY NON-EMPTY EMAIL + PASSWORD IS ACCEPTED
       ===================================================== */

    if (signInForm) {

        signInForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                clearAuthError();


                const email =
                    signInEmail.value.trim();

                const password =
                    signInPassword.value;


                if (!email) {

                    showAuthError(
                        "Please enter your mail ID."
                    );

                    return;

                }


                if (!password) {

                    showAuthError(
                        "Please enter your password."
                    );

                    return;

                }


                /*
                 * If the account was created before,
                 * use its first name and surname.
                 *
                 * If it does not exist,
                 * any email/password is accepted.
                 */

                const existingAccount =
                    findAccountByEmail(email);


                let user;


                if (existingAccount) {

                    user = {
                        firstName:
                            existingAccount.firstName || "",
                        surname:
                            existingAccount.surname || "",
                        email:
                            existingAccount.email
                    };

                } else {

                    user = {
                        firstName: "",
                        surname: "",
                        email: email
                    };

                }


                saveCurrentUser(user);

                updateHeader();


                /* SHOW SUCCESS INFORMATION */

                if (signInForm) {
                    signInForm.hidden = true;
                }

                if (signUpForm) {
                    signUpForm.hidden = true;
                }

                if (authSuccess) {
                    authSuccess.hidden = false;
                }

                if (successTitle) {
                    successTitle.textContent =
                        "Successfully logged in!";
                }

                if (successEmail) {
                    successEmail.textContent =
                        user.email;
                }

                if (successInitials) {
                    successInitials.textContent =
                        getUserInitials(user);
                }

                if (authTitle) {
                    authTitle.textContent =
                        "Login Successful";
                }

                if (authSubtitle) {
                    authSubtitle.textContent =
                        "Your Crazy Cravings account is now active.";
                }

                if (authAvatarLarge) {
                    authAvatarLarge.textContent =
                        getUserInitials(user);
                }

            }
        );

    }


    /* =====================================================
       SIGN UP
       ===================================================== */

    if (signUpForm) {

        signUpForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                clearAuthError();


                const firstName =
                    signUpFirstName.value.trim();

                const surname =
                    signUpSurname.value.trim();

                const email =
                    signUpEmail.value.trim();

                const password =
                    signUpPassword.value;

                const confirmPassword =
                    signUpConfirmPassword.value;


                if (!firstName) {

                    showAuthError(
                        "First name is required."
                    );

                    return;

                }


                if (!email) {

                    showAuthError(
                        "Mail ID is required."
                    );

                    return;

                }


                if (!password) {

                    showAuthError(
                        "Password is required."
                    );

                    return;

                }


                if (!confirmPassword) {

                    showAuthError(
                        "Please confirm your password."
                    );

                    return;

                }


                if (password !== confirmPassword) {

                    showAuthError(
                        "Password and confirm password must match."
                    );

                    return;

                }


                const existingAccount =
                    findAccountByEmail(email);


                if (existingAccount) {

                    showAuthError(
                        "This mail ID is already registered. Please Sign In."
                    );

                    return;

                }


                const newAccount = {

                    firstName: firstName,

                    surname: surname,

                    email: email,

                    /*
                     * Demo website only.
                     * Do not store passwords like this
                     * in a real production application.
                     */
                    password: password

                };


                const accounts =
                    getAccounts();

                accounts.push(newAccount);

                saveAccounts(accounts);


                const user = {

                    firstName: firstName,

                    surname: surname,

                    email: email

                };


                saveCurrentUser(user);

                updateHeader();


                /* SHOW SUCCESS */

                signUpForm.hidden = true;

                signInForm.hidden = true;

                authSuccess.hidden = false;


                successTitle.textContent =
                    "Successfully created your account!";


                successEmail.textContent =
                    user.email;


                successInitials.textContent =
                    getUserInitials(user);


                authTitle.textContent =
                    "Account Created";


                authSubtitle.textContent =
                    "Your Crazy Cravings account is now active.";


                authAvatarLarge.textContent =
                    getUserInitials(user);

            }
        );

    }


    /* =====================================================
       SWITCH AUTH FORMS
       ===================================================== */

    if (showSignUp) {

        showSignUp.addEventListener(
            "click",
            function () {

                showSignUpMode();

            }
        );

    }


    if (showSignIn) {

        showSignIn.addEventListener(
            "click",
            function () {

                showSignInMode();

            }
        );

    }


    /* =====================================================
       LIVE INITIALS
       ===================================================== */

    if (signInEmail) {

        signInEmail.addEventListener(
            "input",
            updateSignInPreview
        );

    }


    if (signUpFirstName) {

        signUpFirstName.addEventListener(
            "input",
            updateSignUpPreview
        );

    }


    if (signUpSurname) {

        signUpSurname.addEventListener(
            "input",
            updateSignUpPreview
        );

    }


    if (signUpEmail) {

        signUpEmail.addEventListener(
            "input",
            updateSignUpPreview
        );

    }


    /* =====================================================
       OPEN AUTH FROM LOGIN
       ===================================================== */

    if (desktopLoginButton) {

        desktopLoginButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openAuth("signin");

            }
        );

    }


    if (mobileLoginButton) {

        mobileLoginButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openAuth("signin");

            }
        );

    }


    /* =====================================================
       PROFILE ICON -> TWO BUTTONS
       SIGN IN + SIGN OUT
       ===================================================== */

    if (profileIcon) {

        profileIcon.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                if (accountMenu) {

                    accountMenu.classList.toggle(
                        "show"
                    );

                }

            }
        );

    }


    const menuSignIn =
        document.getElementById(
            "menuSignIn"
        );

    const menuSignOut =
        document.getElementById(
            "menuSignOut"
        );


    if (menuSignIn) {

        menuSignIn.addEventListener(
            "click",
            function () {

                accountMenu?.classList.remove(
                    "show"
                );

                openAuth("signin");

            }
        );

    }


    if (menuSignOut) {

        menuSignOut.addEventListener(
            "click",
            function () {

                if (menuSignOut.disabled) {
                    return;
                }

                clearCurrentUser();

                updateHeader();

                accountMenu?.classList.remove(
                    "show"
                );

                window.location.href =
                    "home.html";

            }
        );

    }


    /* =====================================================
       CLOSE ACCOUNT MENU OUTSIDE
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                accountMenu &&
                !accountMenu.contains(event.target) &&
                !profileIcon?.contains(event.target)
            ) {

                accountMenu.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =====================================================
       CLOSE AUTH
       ===================================================== */

    if (authClose) {

        authClose.addEventListener(
            "click",
            closeAuth
        );

    }


    if (authOverlay) {

        authOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === authOverlay
                ) {

                    closeAuth();

                }

            }
        );

    }


    /* =====================================================
       GO TO HOME
       ===================================================== */

    if (authHomeButton) {

        authHomeButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "home.html";

            }
        );

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuButton =
        document.getElementById(
            "menuButton"
        );

    const mobileNavbar =
        document.getElementById(
            "mobileNavbar"
        );


    if (menuButton && mobileNavbar) {

        menuButton.addEventListener(
            "click",
            function () {

                mobileNavbar.classList.toggle(
                    "show"
                );

                menuButton.classList.toggle(
                    "active"
                );

            }
        );


        const mobileLinks =
            mobileNavbar.querySelectorAll("a");


        mobileLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mobileNavbar.classList.remove(
                            "show"
                        );

                        menuButton.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       HERO SLIDER
       ===================================================== */

    const slides =
        document.querySelectorAll(
            ".slide"
        );

    const dots =
        document.querySelectorAll(
            ".dot"
        );

    const prevButton =
        document.getElementById(
            "prevButton"
        );

    const nextButton =
        document.getElementById(
            "nextButton"
        );

    let currentSlide = 0;


    function showSlide(index) {

        if (!slides.length) {
            return;
        }


        if (index >= slides.length) {

            currentSlide = 0;

        } else if (index < 0) {

            currentSlide =
                slides.length - 1;

        } else {

            currentSlide = index;

        }


        slides.forEach(
            function (slide, i) {

                slide.classList.toggle(
                    "active-slide",
                    i === currentSlide
                );

            }
        );


        dots.forEach(
            function (dot, i) {

                dot.classList.toggle(
                    "active",
                    i === currentSlide
                );

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                showSlide(
                    currentSlide + 1
                );

            }
        );

    }


    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                showSlide(
                    currentSlide - 1
                );

            }
        );

    }


    dots.forEach(
        function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    showSlide(index);

                }
            );

        }
    );


    /* =====================================================
       FOOD CATEGORIES
       ===================================================== */

    const categoryButtons =
        document.querySelectorAll(
            ".category-button"
        );

    const foodCategories =
        document.querySelectorAll(
            ".food-category"
        );


    categoryButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const selectedCategory =
                        button.getAttribute(
                            "data-category"
                        );


                    categoryButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active-category"
                            );

                        }
                    );


                    button.classList.add(
                        "active-category"
                    );


                    foodCategories.forEach(
                        function (category) {

                            category.classList.remove(
                                "active-category"
                            );

                        }
                    );


                    const selectedElement =
                        document.getElementById(
                            selectedCategory
                        );


                    if (selectedElement) {

                        selectedElement.classList.add(
                            "active-category"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       IMAGE MODAL
       ===================================================== */

    const imageModal =
        document.getElementById(
            "imageModal"
        );

    const modalImage =
        document.getElementById(
            "modalImage"
        );

    const modalClose =
        document.getElementById(
            "modalClose"
        );

    const zoomImages =
        document.querySelectorAll(
            ".zoom-image"
        );


    zoomImages.forEach(
        function (image) {

            image.addEventListener(
                "click",
                function () {

                    if (!imageModal || !modalImage) {
                        return;
                    }

                    modalImage.src =
                        image.src;

                    modalImage.alt =
                        image.alt;

                    imageModal.hidden =
                        false;

                    imageModal.classList.add(
                        "show"
                    );

                    document.body.classList.add(
                        "modal-open"
                    );

                }
            );

        }
    );


    function closeImageModal() {

        if (!imageModal) {
            return;
        }

        imageModal.classList.remove(
            "show"
        );

        imageModal.hidden = true;

        document.body.classList.remove(
            "modal-open"
        );

        if (modalImage) {
            modalImage.src = "";
        }

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeImageModal
        );

    }


    if (imageModal) {

        imageModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === imageModal
                ) {

                    closeImageModal();

                }

            }
        );

    }


    /* =====================================================
       ESC KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            closeImageModal();

            if (
                authOverlay &&
                !authOverlay.hidden
            ) {

                closeAuth();

            }

            accountMenu?.classList.remove(
                "show"
            );

        }
    );


    /* =====================================================
       INITIAL PAGE STATE
       ===================================================== */

    updateHeader();

    showSlide(0);

});