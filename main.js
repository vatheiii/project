document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------
       ELEMENTS
    --------------------------------------------*/
    const authPopup = document.getElementById('authPopup');
    const overlay = document.getElementById('overlay');
    const closeForm = document.getElementById('closeForm');

    const signupSection = document.getElementById('signupSection');
    const loginSection = document.getElementById('loginSection');
    const tabButtons = document.querySelectorAll('.tab-btn');

    const profileBox = document.getElementById('profile-box');
    const profileText = profileBox.querySelector('.signup-text');

    const ctaBtn = document.querySelector('.cta-btn');
    const browseLink = document.getElementById('browseCakeLink');
    const orderLink = document.getElementById('orderLink');
    const aboutLink = document.getElementById('aboutLink');

    /* -------------------------------------------
       TAB SWITCHING (SIGNUP / LOGIN)
    --------------------------------------------*/
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tab = btn.dataset.tab;
            if (tab === "signup") {
                signupSection.classList.remove("hidden");
                loginSection.classList.add("hidden");
            } else {
                signupSection.classList.add("hidden");
                loginSection.classList.remove("hidden");
            }
        });
    });

    /* -------------------------------------------
       POPUP CONTROL
    --------------------------------------------*/
    function openAuthPopup(redirectUrl = null) {
        authPopup.classList.add('show');
        overlay.style.display = "block";
        if (redirectUrl) {
            authPopup.dataset.redirect = redirectUrl;
        }
    }

    function closeAuthPopup() {
        authPopup.classList.remove('show');
        overlay.style.display = "none";
    }

    /* -------------------------------------------
       SMOOTH PAGE REDIRECT
    --------------------------------------------*/
    function redirectSmoothly(url) {
        document.body.classList.add('fade-out');
        setTimeout(() => window.location.href = url, 500);
    }

    /* -------------------------------------------
       PROTECTED PAGES (NEEDS LOGIN)
    --------------------------------------------*/
    function handleProtectedRedirect(url) {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            redirectSmoothly(url);
        } else {
            openAuthPopup(url);
        }
    }

    /* -------------------------------------------
       UPDATE NAVBAR PROFILE TEXT
    --------------------------------------------*/
    function updateProfileText() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            profileText.textContent = localStorage.getItem('username') || "Account";
        } else {
            profileText.textContent = "Sign Up";
        }
    }
    updateProfileText();

    /* -------------------------------------------
       NAVBAR CLICKS
    --------------------------------------------*/
    if (ctaBtn)
        ctaBtn.addEventListener('click', () => handleProtectedRedirect("browseC.html"));

    if (browseLink)
        browseLink.addEventListener('click', e => { e.preventDefault(); handleProtectedRedirect("browseC.html"); });

    if (orderLink)
        orderLink.addEventListener('click', e => { e.preventDefault(); handleProtectedRedirect("order.html"); });

    if (aboutLink)
        aboutLink.addEventListener('click', e => { e.preventDefault(); handleProtectedRedirect("about.html"); });

    profileBox.addEventListener('click', () => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            redirectSmoothly("account.html");
        } else {
            openAuthPopup("acc.html");
        }
    });

    /* -------------------------------------------
       SIGN UP
    --------------------------------------------*/
    document.getElementById('submitSignup').addEventListener('click', () => {
        const user = document.getElementById('signupUsername').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const pass = document.getElementById('signupPassword').value.trim();

        if (!user || !email || !pass) {
            alert("Please fill all fields.");
            return;
        }

        // Save to localStorage
        localStorage.setItem('username', user);
        localStorage.setItem('email', email);
        localStorage.setItem('password', pass);
        localStorage.setItem('isLoggedIn', 'true');

        updateProfileText();
        closeAuthPopup();

        // Redirect after signup
        const redirect = authPopup.dataset.redirect || "browseC.html";
        redirectSmoothly(redirect);
    });

    /* -------------------------------------------
       LOGIN
    --------------------------------------------*/
    document.getElementById('submitLogin').addEventListener('click', () => {
        const emailLogin = document.getElementById('loginEmail').value.trim();
        const passLogin = document.getElementById('loginPassword').value.trim();

        const storedEmail = localStorage.getItem('email');
        const storedPass = localStorage.getItem('password');

        if (!storedEmail || !storedPass) {
            alert("No account found. Please sign up first.");
            return;
        }

        if (emailLogin === storedEmail && passLogin === storedPass) {
            localStorage.setItem('isLoggedIn', 'true');

            updateProfileText();
            closeAuthPopup();

            const redirect = authPopup.dataset.redirect || "browseC.html";
            redirectSmoothly(redirect);
        } else {
            alert("Incorrect email or password.");
        }
    });

    /* -------------------------------------------
       CLOSE POPUP
    --------------------------------------------*/
    closeForm.addEventListener('click', closeAuthPopup);
    overlay.addEventListener('click', closeAuthPopup);

});












