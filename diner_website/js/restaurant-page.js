const mainImage = document.getElementById('mainImage');
const subImages = document.querySelectorAll('.subimage img');

if (!mainImage) {
    console.error('Main image element not found');
}

subImages.forEach((subImage) => {
    subImage.addEventListener('click', () => {
        if (mainImage && subImage.src) {
            mainImage.src = subImage.src;
            // Add a class to indicate this is the currently active thumbnail
            subImages.forEach(img => img.classList.remove('active'));
            subImage.classList.add('active');
        } else {
            console.error('Error updating the main image source');
        }
    });
});

// Preload images for smoother transitions
function preloadImages() {
    subImages.forEach(image => {
        const img = new Image();
        img.src = image.src;
    });
}

window.onload = function() {
    preloadImages();
    updateNav();  // Update navigation based on user status
};

// Function to update the navigation bar
function updateNav() {
    const navUser = document.getElementById('navUser');
    const navGuest = document.querySelector('.navbtm');
    const welcomeMessage = document.getElementById('welcomeMessage');

    const token = localStorage.getItem('token');
    if (token) {
        const user = parseJwt(token);
        if (user) {
            welcomeMessage.textContent = `Welcome, ${user.name || 'User'}`;
            navUser.style.display = 'flex';
            navGuest.style.display = 'none';
        } else {
            console.error('JWT is invalid');
        }
    } else {
        navUser.style.display = 'none';
        navGuest.style.display = 'flex';
    }
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = window.atob(base64);
        return JSON.parse(decoded);
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
}

function logoutUser() {
    localStorage.removeItem('token');
    window.location.reload();
}
