document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    const cartContainer = document.getElementById('cart-container');
    const cartTotal = document.getElementById('cart-total');

    function renderCart() {
        cartContainer.innerHTML = ''; 
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotal.textContent = '0.00';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItem.innerHTML = `
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Subtotal: $${itemTotal.toFixed(2)}</p>
                <button class="btn remove-btn" data-id="${item.id}">Remove</button>
            `;
            cartContainer.appendChild(cartItem);
        });

        cartTotal.textContent = total.toFixed(2);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCart(); 
    }
    
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    cartContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            removeFromCart(productId);
        }
    });

    renderCart();
});