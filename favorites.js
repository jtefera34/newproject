"use strict";
let visibleFavorites = 6;
let cartCount = 0;

// Function to get favorite products from localStorage
function getFavoriteProducts() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

function updateHeartCount() {
    const heartCount = getFavoriteProducts().length;
    document.getElementById('heart-count').innerText = heartCount;
}

// Populate favorite products
function populateFavoriteProducts() {
    const favoriteList = document.getElementById('favorite-list');
    favoriteList.innerHTML = '';

    const favoriteProducts = getFavoriteProducts();
    const favoritesToShow = favoriteProducts.slice(0, visibleFavorites);

    favoritesToShow.forEach(product => {
        const productCard = `
            <div class="product-page" style="position: relative;">
                <div class="product-images">
                    <div class="main-image">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    </div>
                </div>
                <div class="product-details">
                    <h1 class="card-title product-card-title">${product.name}</h1>
                    <div class="price">${product.price}</div>
                    <p class="card-text product-card-description">${product.description}</p>
                    <div class="form-group">
                        <label for="quantity-${product.name}">Quantity</label>
                        <input type="number" id="quantity-${product.name}" class="form-control" value="1" min="1">
                    </div>
                    <button class="btn btn-dark btn-block">Add to Cart</button>
                </div>
                <i class="far fa-heart product-card-heart ${product.isFavorite ? 'fas text-danger' : ''}" onclick="toggleHeart(this, '${product.name}')" style="position: absolute; top: 10px; right: 10px; cursor: pointer;"></i>
            </div>
        `;
        favoriteList.innerHTML += productCard;
    });

    if (favoriteProducts.length > visibleFavorites) {
        document.getElementById('show-more-favorites').style.display = 'block';
    } else {
        document.getElementById('show-more-favorites').style.display = 'none';
    }
}

// Show more favorite products
document.getElementById('show-more-favorites').addEventListener('click', () => {
    visibleFavorites += 6;
    populateFavoriteProducts();
});

function updateCartCount(change) {
    cartCount += change;
    document.getElementById('cart-count').innerText = cartCount;
}

// Initialize favorite products on page load
document.addEventListener('DOMContentLoaded', () => {
    populateFavoriteProducts();
    updateHeartCount();
    updateCartCount(0); // Initialize cart count
});

function toggleHeart(element, productName) {
    element.classList.toggle('fas');
    element.classList.toggle('far');
    element.classList.toggle('text-danger');

    let favoriteProducts = getFavoriteProducts();
    const productIndex = favoriteProducts.findIndex(product => product.name === productName);

    if (element.classList.contains('fas')) {
        favoriteProducts[productIndex].isFavorite = true;
    } else {
        favoriteProducts.splice(productIndex, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(favoriteProducts));
    updateHeartCount();
    populateFavoriteProducts(); // Re-populate favorites to remove unliked product
}
