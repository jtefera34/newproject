"use strict";
let visibleProducts = 6;
let cartCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadFavorites(); // Load favorite products from local storage
    populateDropdowns(); // Populate filter dropdowns
    populateProducts(); // Display products based on filters
    updateHeartCount(); // Update the count of favorite products
});

// Load favorite products from local storage
function loadFavorites() {
    const favoriteProducts = JSON.parse(localStorage.getItem('favorites')) || [];
    favoriteProducts.forEach(favorite => {
        const product = products.find(p => p.name === favorite.name);
        if (product) {
            product.isFavorite = true;
        }
    });
}

// Toggle the heart icon and update favorite status
function toggleHeart(element) {
    element.classList.toggle('fas');
    element.classList.toggle('far');
    element.classList.toggle('text-danger');

    const productName = element.closest('.product-card-body').querySelector('.product-card-title').innerText;
    const product = products.find(p => p.name === productName);

    product.isFavorite = element.classList.contains('fas');

    updateFavoritesStorage();
    updateHeartCount();
    populateProducts(); // Re-populate products to move hearted products to the top
}

// Save the current list of favorite products to local storage
function updateFavoritesStorage() {
    const favoriteProducts = products.filter(product => product.isFavorite);
    localStorage.setItem('favorites', JSON.stringify(favoriteProducts));
}

// Update the displayed count of favorite products
function updateHeartCount() {
    const heartCount = products.filter(product => product.isFavorite).length;
    document.getElementById('heart-count').innerText = heartCount;
}

// Populate filter dropdowns for product types and categories
function populateDropdowns() {
    populateFilterDropdown('type-filters', 'type');
    populateFilterDropdown('feature-filters', 'category');
    addFilterEventListeners();
}

// Helper function to populate a filter dropdown
function populateFilterDropdown(filterId, key) {
    const items = [...new Set(products.map(product => product[key]))]; // Extract unique values for the given key (type or category)
    const filterContainer = document.getElementById(filterId);
    filterContainer.innerHTML = ''; // Clear previous filters

    items.forEach(item => {
        const filter = document.createElement('div');
        filter.className = 'dropdown-item';
        filter.innerHTML = `
            <input type="checkbox" class="filter-checkbox" value="${item}" id="filter-${item.replace(/\s+/g, '-')}">
            <label for="filter-${item.replace(/\s+/g, '-')}">${item}</label>
        `;
        filterContainer.appendChild(filter);
    });
}

// Display products based on selected filters and favorites
function populateProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    const selectedTypes = getSelectedValues('type-filters');
    const selectedCategories = getSelectedValues('feature-filters');

    const filteredProducts = products.filter(product => {
        return (selectedTypes.length === 0 || selectedTypes.includes(product.type)) &&
               (selectedCategories.length === 0 || selectedCategories.includes(product.category));
    });

    // Sort products to show hearted products first
    filteredProducts.sort((a, b) => b.isFavorite - a.isFavorite);

    const productsToShow = filteredProducts.slice(0, visibleProducts);

    productsToShow.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card product-card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body product-card-body">
                        <h5 class="card-title product-card-title">${product.name}</h5>
                        <p class="card-text product-card-description">${product.type}</p>
                        <p class="card-text product-card-price">${product.price}</p>
                        <button class="btn btn-add-to-cart" onclick="addToCart(this)">Add to Cart</button>
                        <div class="cart-controls" style="display: none;">
                            <button class="btn btn-sm btn-secondary" onclick="decreaseQuantity(this)">-</button>
                            <span class="quantity">0</span>
                            <button class="btn btn-sm btn-secondary" onclick="increaseQuantity(this)">+</button>
                        </div>
                        <i class="far fa-heart product-card-heart ${product.isFavorite ? 'fas text-danger' : ''}" onclick="toggleHeart(this)"></i>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productCard;
    });

    document.getElementById('show-more').style.display = (filteredProducts.length > visibleProducts) ? 'block' : 'none';
}

// Retrieve selected filter values from a given filter dropdown
function getSelectedValues(filterId) {
    return Array.from(document.querySelectorAll(`#${filterId} .filter-checkbox:checked`)).map(cb => cb.value);
}

// Add a product to the cart
function addToCart(button) {
    const cartControls = button.nextElementSibling;
    button.style.display = 'none';
    cartControls.style.display = 'flex';
    increaseQuantity(cartControls.querySelector('.btn-secondary:last-of-type'));
}

// Increase the quantity of a product in the cart
function increaseQuantity(button) {
    const quantitySpan = button.previousElementSibling;
    let quantity = parseInt(quantitySpan.innerText);
    quantity++;
    quantitySpan.innerText = quantity;
    updateCartCount(1);
}

// Decrease the quantity of a product in the cart
function decreaseQuantity(button) {
    const quantitySpan = button.nextElementSibling;
    let quantity = parseInt(quantitySpan.innerText);
    if (quantity > 0) {
        quantity--;
        quantitySpan.innerText = quantity;
        updateCartCount(-1);

        if (quantity === 0) {
            const cartControls = button.parentElement;
            cartControls.style.display = 'none';
            cartControls.previousElementSibling.style.display = 'block';
        }
    }
}

// Update the displayed count of items in the cart
function updateCartCount(change) {
    cartCount += change;
    document.getElementById('cart-count').innerText = cartCount;
}

// Add event listeners to filter checkboxes and reset button
function addFilterEventListeners() {
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', populateProducts);
    });

    document.getElementById('reset-filters').addEventListener('click', () => {
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        populateProducts();
    });
}

// Event listener for "Show More" button to load more products
document.getElementById('show-more').addEventListener('click', () => {
    visibleProducts += 6;
    populateProducts();
});
