document.addEventListener('DOMContentLoaded', function() {
    const navUser = document.getElementById('navUser');
    const navDefault = document.querySelector('.navbtm');
    const welcomeMessage = document.getElementById('welcomeMessage');

    function checkUser() {
        const token = localStorage.getItem('token');
        if (token) {
            // Assume the token includes the diner's name; you'll need to adjust this depending on how your token is structured
            const dinerDetails = parseJwt(token); // A function to decode JWT and extract user details
            welcomeMessage.textContent = `Welcome, ${dinerDetails.name}`;
            navUser.style.display = 'flex'; // Show user-specific links
            navDefault.style.display = 'none'; // Hide default links
        } else {
            navUser.style.display = 'none'; // Hide user-specific links
            navDefault.style.display = 'flex'; // Show default links
        }
    }

    function parseJwt(token) {
        try {
            // Base64 decode the payload of the JWT
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    function logoutUser() {
        localStorage.removeItem('token'); // Remove the token
        window.location.reload(); // Reload the page to reflect the change in authentication state
    }

    // Attach logout function to global scope for access from HTML
    window.logoutUser = logoutUser;

    checkUser();
});
