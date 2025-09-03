const products = [
    {
        id: 1,
        name: "Kit Acrux",
        price: 3,
        image: "https://imgur.com/Jhk027y.png",
        category: "premium",
        rating: 4.8,
        badge: "Más Vendido",
        description: "El kit definitivo de supervivencia PvP con armas avanzadas y objetos raros. Domina el campo de batalla con esta selección premium de equipo de alto nivel.",
        specs: [
            { name: "Armas", value: "Nightraider, Maplestrike, Timberwolf" },
            { name: "Munición", value: "500 Balas Militares" },
            { name: "Armadura", value: "Casco Militar, Chaleco y Pantalones" },
            { name: "Médico", value: "10 Botiquines, 5 Adrenalinas" },
            { name: "Construcción", value: "Kit de Paredes, Techos y Pisos Metálicos" },
            { name: "Extras", value: "Visión Nocturna, 2 Banderas de Reclamo" }
        ]
    },
    {
        id: 2,
        name: "Kit Sodoma",
        price: 6,
        image: "https://imgur.com/w3pnUVM.png",
        category: "special",
        rating: 5.0,
        badge: "Definitivo",
        description: "Nuestro kit de asalto más exclusivo con las armas y objetos más raros del juego. Perfecto para dominar incursiones y convertirte en el superviviente definitivo.",
        specs: [
            { name: "Armas", value: "Shadowstalker, Lanzacohetes, Grizzly" },
            { name: "Munición", value: "Rieles, Cohetes, 1000 Balas" },
            { name: "Armadura", value: "Set Completo de Armadura Edición Especial" },
            { name: "Explosivos", value: "20 C4, 15 Granadas" },
            { name: "Vehículos", value: "Fichas de Generación de Vehículos Militares (2)" },
            { name: "Extras", value: "Sistema de Defensa de Base, Skin de Personaje Especial" }
        ]
    },
    {
        id: 3,
        name: "Kit Vulcan",
        price: 10,
        image: "https://imgur.com/TLM0355.png",
        category: "premium",
        rating: 4.9,
        badge: "Poder de Fuego",
        description: "El kit soñado por los especialistas en pirotecnia. Equipado con armas basadas en llamas y equipo explosivo para reducir a cenizas a tus enemigos y destruir sus bases.",
        specs: [
            { name: "Armas", value: "Lanzallamas, Francotirador Incendiario, Furia del Infierno" },
            { name: "Munición", value: "Tanques de Llamas, Balas Incendiarias" },
            { name: "Protección", value: "Set de Armadura Ignífuga, Máscara de Gas" },
            { name: "Explosivos", value: "15 Cargas Incendiarias, 10 Bombas Incendiarias" },
            { name: "Utilidades", value: "Extintor, Visión Térmica" },
            { name: "Extras", value: "Skin de Personaje Fénix, Rastros de Fuego" }
        ]
    }
];


const productTitle = document.getElementById('product-title');
const productTitleBreadcrumb = document.getElementById('product-title-breadcrumb');
const productMainImage = document.getElementById('product-main-image');
const productPrice = document.getElementById('product-price');
const productRating = document.getElementById('product-rating');
const productDesc = document.getElementById('product-desc');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const qtyBtns = document.querySelectorAll('.qty-btn');
const qtyInput = document.querySelector('.quantity-selector input');
const relatedProductsGrid = document.getElementById('related-products-grid');
const wishlistBtn = document.querySelector('.wishlist-btn');
const specsContainer = document.getElementById('specifications');

// Generar estrellas para calificación de productos
function generateStars(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Obtener ID del producto de la URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Cargar detalles del producto
function loadProductDetails() {
    const productId = getProductIdFromUrl();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        // Redirigir a la página de inicio si no se encuentra el producto
        window.location.href = 'index.html';
        return;
    }
    
    // Actualizar detalles del producto
    document.title = `${product.name} - Tierra Del Sol Unturned`;
    productTitle.textContent = product.name;
    productTitleBreadcrumb.textContent = product.name;
    productMainImage.src = product.image;
    productMainImage.alt = product.name;
    productPrice.textContent = `$${product.price.toFixed(2)}`;
    
    // Actualizar descripción del producto si está disponible
    if (product.description) {
        productDesc.textContent = product.description;
    }
    
    // Actualizar calificación
    productRating.innerHTML = `
        <div class="stars">${generateStars(product.rating)}</div>
        <span>${product.rating.toFixed(1)}</span>
    `;
    
    // Actualizar especificaciones si están disponibles
    if (product.specs && product.specs.length > 0) {
        let specsHTML = '<ul class="specs-list">';
        product.specs.forEach(spec => {
            specsHTML += `<li><strong>${spec.name}:</strong> ${spec.value}</li>`;
        });
        specsHTML += '</ul>';
        document.getElementById('specifications').innerHTML = specsHTML;
    }
    
    // Añadir evento para el botón "Añadir al carrito"
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const qtyInput = document.querySelector('.quantity-selector input');
    
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(qtyInput.value);
        if (quantity > 0) {
            cart.addItem(product, quantity);
            showNotification(`${product.name} añadido al carrito`);
        }
    });
    
    // Cargar productos relacionados
    loadRelatedProducts(product);
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        
        // Eliminar del DOM después de la animación
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Cargar productos relacionados
function loadRelatedProducts(currentProduct) {
    // Filtrar el producto actual para mostrar otros kits
    const related = products.filter(p => p.id !== currentProduct.id);
    
    relatedProductsGrid.innerHTML = '';
    
    related.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span>${product.rating.toFixed(1)}</span>
                </div>
                <div class="product-buttons">
                    <button class="product-button view-details">Ver Detalles</button>
                    <button class="product-button add-to-cart">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        
        relatedProductsGrid.appendChild(productCard);
        
        // Evento para ver detalles
        const viewDetailsBtn = productCard.querySelector('.view-details');
        viewDetailsBtn.addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });
        
        // Evento para añadir al carrito directamente
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que se active el evento de la tarjeta
            cart.addItem(product);
            showNotification(`${product.name} añadido al carrito`);
        });
    });
}

// Funcionalidad de pestañas
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase activa de todos los botones y paneles
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Añadir clase activa al botón clickeado
        button.classList.add('active');
        
        // Mostrar el panel de pestañas correspondiente
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Funcionalidad del selector de cantidad
qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        
        if (btn.classList.contains('plus')) {
            qtyInput.value = currentValue + 1;
        } else if (btn.classList.contains('minus') && currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });
});

// Funcionalidad del botón de lista de deseos
wishlistBtn.addEventListener('click', function() {
    const icon = this.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        this.style.backgroundColor = 'var(--secondary)';
        this.style.color = 'var(--white)';
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        this.style.backgroundColor = 'var(--gray)';
        this.style.color = 'var(--dark)';
    }
});

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    
    // Añadir estilos CSS para notificaciones
    const style = document.createElement('style');
    style.innerHTML = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--card-bg);
            border-left: 4px solid var(--success);
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateY(-20px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
        }
        
        .notification-content i {
            color: var(--success);
            margin-right: 10px;
        }
        
        .product-buttons {
            display: flex;
            gap: 10px;
        }
        
        .product-button {
            flex: 1;
        }
        
        .product-button.add-to-cart {
            flex: 0 0 40px;
        }
    `;
    document.head.appendChild(style);
});
