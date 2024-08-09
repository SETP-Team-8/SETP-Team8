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

// preload images for smoother transitions
function preloadImages() {
    subImages.forEach(image => {
        const img = new Image();
        img.src = image.src;
    });
}

window.onload = preloadImages;
