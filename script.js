// Datos de productos Kit de Unturned
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
            { name: "Armadura", value: "Set Completo Militar" },
            { name: "Explosivos", value: "20 C4, 15 Granadas" },
            { name: "Vehículos", value: "Apache" },
            { name: "Extras", value: "Un besito en la drente" }
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

// Elementos DOM
const productGrid = document.querySelector('.product-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

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

// Mostrar productos
function displayProducts(products) {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.setAttribute('data-id', product.id);
        
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
        
        productGrid.appendChild(productCard);
        
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
            
            // Mostrar notificación
            showNotification(`${product.name} añadido al carrito`);
        });
    });
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

// Filtrar productos
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

// Event listeners para los botones de filtro
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase activa de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Añadir clase activa al botón clickeado
        button.classList.add('active');
        
        // Filtrar productos
        const filter = button.getAttribute('data-filter');
        filterProducts(filter);
    });
});

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    
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
