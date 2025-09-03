class ShoppingCart {
    constructor() {
        this.items = [];
        this.paypalCommissionRate = 0.054; 
        this.paypalFixedFee = 0.30; 
        this.paypalURL = 'https://www.paypal.com/paypalme/TierraDelSolUnturned/';
        this.loadFromLocalStorage();
    }

    // Añadir item al carrito
    addItem(product, quantity = 1) {
        
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
           
            existingItem.quantity += quantity;
        } else {
            
            this.items.push({
                product: product,
                quantity: quantity
            });
        }
        
        this.saveToLocalStorage();
        this.updateCartDisplay();
    }

    // Eliminar item del carrito
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.saveToLocalStorage();
        this.updateCartDisplay();
    }

    // Actualizar cantidad de un item
    updateItemQuantity(productId, quantity) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            }
        }
        this.saveToLocalStorage();
        this.updateCartDisplay();
    }

    getSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    getTotal() {
        const subtotal = this.getSubtotal();
        return (subtotal + this.paypalFixedFee) / (1 - this.paypalCommissionRate);
    }

    getPaypalCommission() {
        return this.getTotal() - this.getSubtotal();
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    saveToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    loadFromLocalStorage() {
        const storedCart = localStorage.getItem('shoppingCart');
        if (storedCart) {
            this.items = JSON.parse(storedCart);
        }
    }

    // Limpiar carrito
    clearCart() {
        this.items = [];
        this.saveToLocalStorage();
        this.updateCartDisplay();
    }

    // Actualizar contador del carrito
    updateCartDisplay() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = this.getTotalItems();
        });

        // Evento personalizado para notificar que el carrito se ha actualizado
        document.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    // Proceder al checkout con PayPal
    checkout() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        const total = this.getTotal().toFixed(2);
        const paypalURL = `${this.paypalURL}${total}`;
        
        // Abrir en nueva pestaña
        window.open(paypalURL, '_blank');
    }

    // Generar HTML del carrito para mostrarlo
    generateCartHTML() {
        if (this.items.length === 0) {
            return `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="index.html" class="btn-continue">Continuar Comprando</a>
                </div>
            `;
        }

        let html = `
            <div class="cart-items">
                <h3>Tu Carrito</h3>
                <ul>
        `;

        this.items.forEach(item => {
            html += `
                <li class="cart-item" data-id="${item.product.id}">
                    <div class="cart-item-image">
                        <img src="${item.product.image}" alt="${item.product.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.product.name}</h4>
                        <div class="cart-item-price">$${item.product.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn cart-minus">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn cart-plus">+</button>
                        </div>
                    </div>
                    <div class="cart-item-subtotal">
                        $${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    <button class="remove-item-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </li>
            `;
        });

        html += `
                </ul>
            </div>
            <div class="cart-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>$${this.getSubtotal().toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Comisión PayPal (5.4% + $0.30):</span>
                    <span>$${this.getPaypalCommission().toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total a pagar:</span>
                    <span>$${this.getTotal().toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Fórmula aplicada:</span>
                    <span>Total = (Subtotal + $0.30) / (1 - 0.054)</span>
                </div>
                <div class="cart-actions">
                    <button class="btn-clear">Vaciar Carrito</button>
                    <button class="btn-checkout">Proceder al Pago</button>
                </div>
            </div>
        `;

        return html;
    }
}

// Inicializar carrito
const cart = new ShoppingCart();

// Actualizar contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartDisplay();
    
    // Añadir evento de clic al icono del carrito para mostrar/ocultar el carrito
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', showCartModal);
    }
});

// Función para mostrar el modal del carrito
function showCartModal() {
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    
    // Contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'cart-modal-content';
    
    // Botón de cierre
    const closeBtn = document.createElement('span');
    closeBtn.className = 'cart-close';
    closeBtn.innerHTML = '&times;';
    
    // Contenido del carrito
    const cartContent = document.createElement('div');
    cartContent.className = 'cart-content';
    cartContent.innerHTML = cart.generateCartHTML();
    
    // Añadir elementos al DOM
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(cartContent);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Mostrar modal con animación
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
    
    // Cerrar modal al hacer clic en botón de cierre
    closeBtn.addEventListener('click', () => {
        closeCartModal(modal);
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCartModal(modal);
        }
    });
    
    // Añadir eventos a los botones del carrito
    setupCartEvents(modalContent);
}

// Función para cerrar el modal del carrito
function closeCartModal(modal) {
    modal.style.opacity = '0';
    const modalContent = modal.querySelector('.cart-modal-content');
    modalContent.style.transform = 'translateY(-50px)';
    
    // Eliminar modal del DOM después de la animación
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

// Configurar eventos para los botones del carrito
function setupCartEvents(container) {
    // Evento para vaciar carrito
    const btnClear = container.querySelector('.btn-clear');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
                cart.clearCart();
                container.querySelector('.cart-content').innerHTML = cart.generateCartHTML();
                setupCartEvents(container);
            }
        });
    }
    
    // Evento para proceder al pago
    const btnCheckout = container.querySelector('.btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            cart.checkout();
        });
    }
    
    // Eventos para los botones de cantidad
    const minusButtons = container.querySelectorAll('.cart-minus');
    const plusButtons = container.querySelectorAll('.cart-plus');
    const removeButtons = container.querySelectorAll('.remove-item-btn');
    
    minusButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            const id = parseInt(cartItem.dataset.id);
            const currentQty = parseInt(cartItem.querySelector('.cart-item-quantity span').textContent);
            cart.updateItemQuantity(id, currentQty - 1);
            container.querySelector('.cart-content').innerHTML = cart.generateCartHTML();
            setupCartEvents(container);
        });
    });
    
    plusButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            const id = parseInt(cartItem.dataset.id);
            const currentQty = parseInt(cartItem.querySelector('.cart-item-quantity span').textContent);
            cart.updateItemQuantity(id, currentQty + 1);
            container.querySelector('.cart-content').innerHTML = cart.generateCartHTML();
            setupCartEvents(container);
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            const id = parseInt(cartItem.dataset.id);
            cart.removeItem(id);
            container.querySelector('.cart-content').innerHTML = cart.generateCartHTML();
            setupCartEvents(container);
        });
    });
    
    // Evento para continuar comprando
    const btnContinue = container.querySelector('.btn-continue');
    if (btnContinue) {
        btnContinue.addEventListener('click', () => {
            closeCartModal(container.closest('.cart-modal'));
        });
    }
}

// Exportar objeto cart para ser usado en otros scripts
window.cart = cart;
