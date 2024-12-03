// Utility function to get the JWT token
function getToken() {
    return localStorage.getItem("jwt");
}

// Navigation function for internal links with token handling
async function navigateTo(routeName) {
    const token = getToken();

    // Define route mapping
    const urlMap = {
        "/": "{{ url_for('home') }}",
        about: "{{ url_for('about') }}",
        login: "{{ url_for('login') }}",
        dashboard: "{{ url_for('user_dashboard') }}",
        foodinput: "{{ url_for('foodinput') }}",
        foodtable: "{{ url_for('foodtable') }}",
        protected: "http://127.0.0.1:5000/protected", 

    };

    const routeUrl = urlMap[routeName];
    if (!routeUrl) {
        console.error(`Route '${routeName}' is not defined.`);
        return;
    }

    // Handle login and public routes differently from protected routes
    const isPublicRoute = routeName === "/" || routeName === "about" || routeName === "login";

    try {
        const response = await fetch(routeUrl, {
            method: "GET",
            headers: isPublicRoute
                ? {}
                : {
                      Authorization: `Bearer ${token}`,
                  },
        });

        if (response.ok) {
            const pageContent = await response.text();
            document.body.innerHTML = pageContent; // Dynamically update the page content
        } else if (response.status === 401) {
            alert("Session expired or unauthorized. Redirecting to login.");
            localStorage.removeItem("jwt");
            window.location.href = "{{ url_for('login') }}";
        } else {
            console.error("Failed to load the page:", response.statusText);
            alert("An error occurred while loading the page.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("A network error occurred. Please try again later.");
    }
}

// Logout function
function logout() {
    localStorage.removeItem("jwt"); // Remove the token
    alert("You have been logged out.");
    window.location.href = "{{ url_for('login') }}"; // Redirect to login page
}