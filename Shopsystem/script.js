const products = [
  { id: 1, name: "T-Shirt", price: 19.99 },
  { id: 2, name: "Hoodie", price: 39.99 },
  { id: 3, name: "Tasse", price: 9.99 }
];

class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class CartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  get totalPrice() {
    return this.product.price * this.quantity;
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product) {
    const existingItem = this.items.find(
      item => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      const newItem = new CartItem(product);
      this.items.push(newItem);
    }
  }
  
  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  getItems() {
    return this.items;
  }

  get total() {
    return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }
}

class ShopView {
  constructor() {
    this.productListElement = document.getElementById('productList');
    this.cartListElement = document.getElementById('cartList');
    this.cartTotalElement = document.getElementById('cartTotal');
  }

  renderProductList(products, onAddToCartCallback) {
    this.productListElement.innerHTML = '';

    products.forEach(product => {
      const li = document.createElement('li');
      li.textContent = `${product.name} - ${product.price.toFixed(2)} € `;

      const addButton = document.createElement('button');
      addButton.textContent = 'Zum Warenkorb hinzufügen';
      
      addButton.addEventListener('click', () => {
        onAddToCartCallback(product);
      });

      li.appendChild(addButton);
      this.productListElement.appendChild(li);
    });
  }

  renderCart(cartModel, onRemoveFromCartCallback) {
    this.cartListElement.innerHTML = '';

    cartModel.getItems().forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.product.name} (Menge: ${item.quantity}) - ${item.totalPrice.toFixed(2)} € `;
      
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Entfernen';
      removeButton.style.marginLeft = '10px';
      
      removeButton.addEventListener('click', () => {
        onRemoveFromCartCallback(item.product.id);
      });

      li.appendChild(removeButton);
      this.cartListElement.appendChild(li);
    });
     
    this.cartTotalElement.textContent = cartModel.total.toFixed(2);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cart = new ShoppingCart();
  const productModels = products.map(p => new Product(p.id, p.name, p.price));
  
  const view = new ShopView();

  const handleRemoveFromCart = (productId) => {
    cart.removeItem(productId);
    view.renderCart(cart, handleRemoveFromCart);
  };

  const handleAddToCart = (product) => {
    cart.addItem(product);
    view.renderCart(cart, handleRemoveFromCart);
  };

  view.renderProductList(productModels, handleAddToCart);
});