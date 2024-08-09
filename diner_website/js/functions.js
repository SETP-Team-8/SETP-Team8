// Add a function to handle the search operation
function searchRestaurants() {
    const searchQuery = document.querySelector('.search').value.trim();
    if (!searchQuery) {
        alert('Please enter a search query.');
        return;
    }
    // Assuming you have an endpoint to handle the search or you'll navigate to a search results page
    window.location.href = `search-results.html?query=${encodeURIComponent(searchQuery)}`;
}
