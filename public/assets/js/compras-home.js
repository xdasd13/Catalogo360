// Define openCart globally so it's available immediately
window.openCart = function () {
  const sidebar = document.getElementById("cart-sidebar");
  const overlay = document.getElementById("cart-overlay");
  if (sidebar && overlay) {
    sidebar.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";

    // Trigger a render update
    if (window.renderCartInstance) {
      window.renderCartInstance();
    }
  } else {
    console.warn("Cart elements not found");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const cartFooter = document.getElementById("cart-footer");
  const cartTotalAmount = document.getElementById("cart-total-amount");

  // Helper to format currency
  const formatCurrency = (amount) => {
    return `S/ ${amount.toFixed(2)}`;
  };

  // Helper to check if user is authenticated
  const isUserAuthenticated = () => {
    // Verificar la variable global establecida por la vista EJS
    return window.isUserLoggedIn === true;
  };

  // Load cart from localStorage (user-specific key)
  const getCart = () => {
    try {
      // Si no hay usuario autenticado, retornar carrito vacío
      if (!isUserAuthenticated()) {
        return [];
      }
      const cart = localStorage.getItem("cartItems");
      return cart ? JSON.parse(cart) : [];
    } catch (e) {
      console.error("Error reading cart", e);
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
    renderCart();
  };

  // Close Cart Function
  const closeCart = () => {
    if (cartSidebar) cartSidebar.classList.remove("open");
    if (cartOverlay) cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  // Event Listeners for closing
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // Checkout Button
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (getCart().length > 0) {
        window.location.href = "/checkout";
      } else {
        if (window.showToast)
          window.showToast("Tu carrito está vacío", "error");
      }
    });
  }

  // Render Cart Items
  const renderCart = () => {
    if (!cartItemsContainer) return;

    const cart = getCart();

    // Clear current items (except empty message which we toggle)
    const existingItems = cartItemsContainer.querySelectorAll(".cart-item");
    existingItems.forEach((item) => item.remove());

    if (cart.length === 0) {
      if (emptyCartMessage) emptyCartMessage.style.display = "flex";
      if (cartFooter) cartFooter.style.display = "none";
    } else {
      if (emptyCartMessage) emptyCartMessage.style.display = "none";
      if (cartFooter) cartFooter.style.display = "block";

      let total = 0;

      cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div>
              <h3 class="cart-item-title">${item.name}</h3>
              <p class="cart-item-price">${formatCurrency(item.price)}</p>
            </div>
            <div class="cart-item-actions">
              <div class="quantity-controls">
                <button class="qty-btn minus" data-index="${index}">-</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn plus" data-index="${index}">+</button>
              </div>
              <button class="remove-item-btn" data-index="${index}">Eliminar</button>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(itemEl);
      });

      if (cartTotalAmount) cartTotalAmount.textContent = formatCurrency(total);

      // Add event listeners to new buttons
      attachItemListeners();
    }
  };

  // Expose render function for the global openCart
  window.renderCartInstance = renderCart;

  const attachItemListeners = () => {
    document.querySelectorAll(".qty-btn.plus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const cart = getCart();
        cart[index].quantity += 1;
        saveCart(cart);
      });
    });

    document.querySelectorAll(".qty-btn.minus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const cart = getCart();
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveCart(cart);
      });
    });

    document.querySelectorAll(".remove-item-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
      });
    });
  };

  // Expose addToCart globally with authentication check
  window.addToCart = (product) => {
    // Verificar si el usuario está autenticado
    if (!isUserAuthenticated()) {
      if (window.showToast) {
        window.showToast(
          "Inicie sesión primero para añadir productos a su carrito personal",
          "error"
        );
      }
      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    const cart = getCart();
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    saveCart(cart);
    openCart(); // Open cart when item is added

    if (window.showToast) {
      window.showToast("Producto agregado al carrito", "success");
    }
  };

  // Initial render
  renderCart();

  // Limpiar el carrito cuando se cierre sesión
  // Detectar logout cuando la URL contiene loggedOut=true
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("loggedOut") === "true") {
    localStorage.removeItem("cartItems");
    renderCart();
    // Limpiar el parámetro de la URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Monitoreo periódico: si la variable global cambia de true a false
  let previousAuthState = window.isUserLoggedIn;
  setInterval(() => {
    const currentAuthState = window.isUserLoggedIn;

    // Si cambió de autenticado a no autenticado
    if (previousAuthState === true && currentAuthState === false) {
      // El usuario se desconectó
      localStorage.removeItem("cartItems");
      renderCart();
      if (window.showToast) {
        window.showToast(
          "Sesión finalizada. Tu carrito ha sido limpiado.",
          "info"
        );
      }
    }

    previousAuthState = currentAuthState;
  }, 1000);
});
