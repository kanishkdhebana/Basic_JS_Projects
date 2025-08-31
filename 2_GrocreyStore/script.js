document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'Apple', price: 0.50, image: 'images/apple.jpg' },
        { id: 2, name: 'Milk', price: 2.50, image: 'images/milk.jpg' },
        { id: 3, name: 'Bread', price: 2.00, image: 'images/bread.jpg' },
        { id: 4, name: 'Guava', price: 3.00, image: 'images/g.jpg' }
    ];

    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    const productList = document.getElementById('product-list');
    const cartCount = document.getElementById('cart-count');

    function renderProducts() {
        productList.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;

            productList.appendChild(productCard);
        });
    }

    function addToCart(productId) {
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity++; 

        } else {
            const productToAdd = products.find(p => p.id === productId);
            cart.push({ ...productToAdd, quantity: 1 });
        }
        
        saveCart();
        updateCartCount();
    }

    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });

    renderProducts();
    updateCartCount();
});