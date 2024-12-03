async function login() {
    const response = await fetch('/login_without_cookies', {method: 'post'});
    const result = await response.json();
    localStorage.setItem('jwt', result.access_token);
  }
  
  function logout() {
    localStorage.removeItem('jwt');
  }


  async function handleLogin(event) {
    event.preventDefault(); // Prevent the form from submitting traditionally

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.access_token;

            // Store the token in localStorage
            localStorage.setItem("jwt", token);

            alert("Login successful!");

            // Make a request to /foodinput with the token in the header
            const foodInputResponse = await fetch("/foodinput", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            // if (foodInputResponse.ok) {
            //     // If access is granted, redirect
            //     window.location.href = "/foodinput";
            // } else {
            //     // Handle unauthorized access
            //     const errorData = await foodInputResponse.json();
            //     alert(errorData.msg || "Access denied. Please try again.");
            // }
        } else {
            const errorData = await response.json();
            alert(errorData.msg || "Login failed. Please try again.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred. Please try again.");
    }
}

async function makeRequestWithJWT() {
    const options = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      }
    };
    const response = await fetch('/protected', options);
    const result = await response.json();
    // Update the HTML element with the JSON response
    document.getElementById('result').textContent = JSON.stringify(result, null, 2);
  }

  // Attach event listener to the button
  document.getElementById('fetchData').addEventListener('click', makeRequestWithJWT);