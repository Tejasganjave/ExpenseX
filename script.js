document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const demoButton = document.getElementById("demoButton");

    // ================================
    // LOGIN
    // ================================

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            // Stop form from adding email/password to URL
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (email === "" || password === "") {

                alert("Please enter your email and password.");

                return;
            }

            // Temporary frontend login
            localStorage.setItem("expenseXLoggedIn", "true");
            localStorage.setItem("expenseXUser", email);

            // Go to dashboard
            window.location.href = "dashboard.html";

        });

    }


    // ================================
    // DEMO ACCOUNT
    // ================================

    if (demoButton) {

        demoButton.addEventListener("click", function () {

            localStorage.setItem("expenseXLoggedIn", "true");
            localStorage.setItem(
                "expenseXUser",
                "demo@expensex.com"
            );

            window.location.href = "dashboard.html";

        });

    }

});