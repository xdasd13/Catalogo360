document.addEventListener('DOMContentLoaded', () => {
  const detailWrapper = document.querySelector('[data-product-detail]');
  const addToCartBtn = document.getElementById('add-to-cart');
  const priceLabel = document.querySelector('[data-price]');

  if (!detailWrapper || !addToCartBtn) {
    return;
  }

  const parseNumber = (value) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const productDetail = {
    id: parseNumber(detailWrapper.dataset.id),
    titulo: detailWrapper.dataset.titulo || 'Producto',
    precio: parseNumber(detailWrapper.dataset.precio),
    imagen: detailWrapper.dataset.imagen || '',
  };

  const formatCurrency = (amount) => `S/ ${amount.toFixed(2)}`;

  if (priceLabel && productDetail.precio) {
    priceLabel.textContent = `Precio sugerido: ${formatCurrency(productDetail.precio)}`;
  }

  const getCart = () => {
    try {
      const cart = localStorage.getItem('cartItems');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('No se pudo leer el carrito', error);
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  };

  const notify = (message, type = 'success') => {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      window.alert(message);
    }
  };

  addToCartBtn.addEventListener('click', () => {
    const cart = getCart();
    const index = cart.findIndex((item) => item.id === productDetail.id);

    if (index > -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({
        id: productDetail.id,
        name: productDetail.titulo,
        price: productDetail.precio,
        image: productDetail.imagen,
        quantity: 1,
      });
    }

    saveCart(cart);
    notify('Producto agregado al carrito', 'success');
  });
});
