const cartStorageKey = "meCafeCart";
let cart = loadCart();

function loadCart() {
  let savedCart;
  try {
    savedCart = localStorage.getItem(cartStorageKey);
  } catch (error) {
    console.error("Could not access saved cart data in this browser.", error);
    return [];
  }

  if (!savedCart) {
    return [];
  }

  try {
    const parsedCart = JSON.parse(savedCart);
    if (!Array.isArray(parsedCart)) {
      throw new TypeError("Saved cart data must be an array.");
    }

    return parsedCart.filter(item =>
      item &&
      typeof item.product === "string" &&
      item.product.trim() !== "" &&
      Number.isFinite(item.price) &&
      item.price >= 0 &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch (error) {
    console.error("Could not read the saved cart. Starting with an empty cart.", error);
    try {
      localStorage.removeItem(cartStorageKey);
    } catch (storageError) {
      console.error("Could not clear invalid saved cart data.", storageError);
    }
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save the cart in this browser.", error);
  }
}

function addToCart(product, price) {
  if (typeof product !== "string" || !product.trim() || !Number.isFinite(price) || price < 0) {
    console.error("A valid product name and price are required to add an item to the cart.");
    return;
  }

  const existingProduct = cart.find(item => item.product === product);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ product, price, quantity: 1 });
  }

  updateCartDisplay();
}

function removeFromCart(product) {
  cart = cart.filter(item => item.product !== product);
  updateCartDisplay();
}

function changeCartQuantity(product, amount) {
  const item = cart.find(cartItem => cartItem.product === product);
  if (!item) {
    return;
  }

  item.quantity += amount;
  if (item.quantity <= 0) {
    removeFromCart(product);
    return;
  }

  updateCartDisplay();
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cartItems");
  const totalPriceElement = document.getElementById("totalPrice");
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartIcon = document.querySelector('.nav-icons a[href="#shopping"] .bx-shopping-bag');

  cartItems.replaceChildren();
  if (cartIcon) {
    cartIcon.setAttribute("aria-label", `Shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`);
  }

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Your cart is empty!";
    cartItems.append(emptyMessage);
    totalPriceElement.textContent = "Total: $0";
    saveCart();
    return;
  }

  let totalPrice = 0;
  cart.forEach(item => {
    totalPrice += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");
    details.className = "cart-item-details";

    const name = document.createElement("span");
    name.className = "cart-item-name";
    name.textContent = item.product;

    const price = document.createElement("span");
    price.textContent = `$${item.price} each`;
    details.append(name, price);

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";

    const decreaseButton = createCartButton("−", `Decrease ${item.product} quantity`, () => {
      changeCartQuantity(item.product, -1);
    });
    const quantity = document.createElement("span");
    quantity.textContent = String(item.quantity);
    quantity.setAttribute("aria-label", `Quantity: ${item.quantity}`);
    const increaseButton = createCartButton("+", `Increase ${item.product} quantity`, () => {
      changeCartQuantity(item.product, 1);
    });
    const removeButton = createCartButton("Remove", `Remove ${item.product}`, () => {
      removeFromCart(item.product);
    });
    removeButton.className = "remove-btn";

    controls.append(decreaseButton, quantity, increaseButton, removeButton);
    row.append(details, controls);
    cartItems.append(row);
  });

  totalPriceElement.textContent = `Total: $${Number(totalPrice.toFixed(2))}`;
  saveCart();
}

function createCartButton(label, accessibleLabel, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-label", accessibleLabel);
  button.addEventListener("click", onClick);
  return button;
}

function showCart() {
  document.getElementById("cartModal").style.display = "block";
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

function openModal() {
  document.getElementById("authModal").style.display = "block";
  document.getElementById("signUpForm").style.display = "block";
  document.getElementById("signInForm").style.display = "none";
  document.getElementById("modalTitle").textContent = "Sign Up";
}

function closeModal() {
  document.getElementById("authModal").style.display = "none";
}

function switchToSignUp() {
  document.getElementById("signInForm").style.display = "none";
  document.getElementById("signUpForm").style.display = "block";
  document.getElementById("modalTitle").textContent = "Sign Up";
}

function switchToSignIn() {
  document.getElementById("signUpForm").style.display = "none";
  document.getElementById("signInForm").style.display = "block";
  document.getElementById("modalTitle").textContent = "Sign In";
}

document.getElementById("signUpFormContent").addEventListener("submit", event => {
  event.preventDefault();

  const username = document.getElementById("signUpUsername").value.trim();
  const password = document.getElementById("signUpPassword").value;
  const confirmPassword = document.getElementById("signUpConfirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  alert(`Sign up form completed for ${username}. Account creation requires a connected service.`);
  closeModal();
});

document.getElementById("signInFormContent").addEventListener("submit", event => {
  event.preventDefault();
  alert("Sign-in requires a connected account service.");
});

const menu = document.querySelector(".menu-icon");
const navbar = document.querySelector(".navbar");

function closeMenu() {
  menu?.classList.remove("move");
  navbar?.classList.remove("open-menu");
}

if (menu && navbar) {
  menu.addEventListener("click", () => {
    menu.classList.toggle("move");
    navbar.classList.toggle("open-menu");
  });
  navbar.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", closeMenu));
}

document.querySelectorAll('.nav-icons a[href="#shopping"]').forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    showCart();
  });
});

document.querySelectorAll('.nav-icons a[href="#authModal"]').forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    openModal();
  });
});

document.querySelectorAll(".product-box .product-info .bx-shopping-bag").forEach(addButton => {
  const addProduct = () => {
    const productBox = addButton.closest(".product-box");
    const productName = productBox.querySelector("h2").textContent.trim();
    const price = Number(productBox.querySelector(".product-info span").textContent.replace(/[^0-9.]/g, ""));
    addToCart(productName, price);
  };

  addButton.addEventListener("click", addProduct);
  addButton.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      addProduct();
    }
  });
});

document.querySelectorAll(".product-box .heart-icon").forEach(heart => {
  heart.setAttribute("role", "button");
  heart.setAttribute("tabindex", "0");
  heart.setAttribute("aria-label", "Add to favorites");
  heart.setAttribute("aria-pressed", "false");

  const toggleFavorite = () => {
    const isFavorite = heart.classList.toggle("is-favorite");
    heart.setAttribute("aria-pressed", String(isFavorite));
    heart.setAttribute("aria-label", isFavorite ? "Remove from favorites" : "Add to favorites");
  };

  heart.addEventListener("click", toggleFavorite);
  heart.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFavorite();
    }
  });
});

const bookingForm = document.querySelector(".book-data form");
if (bookingForm) {
  bookingForm.addEventListener("submit", event => {
    event.preventDefault();
    const confirmation = document.querySelector(".book-data > p");
    confirmation.textContent = "Thanks! We'll contact you to confirm your booking.";
    bookingForm.reset();
  });
}

document.addEventListener("click", event => {
  const cartModal = document.getElementById("cartModal");
  const target = event.target;
  if (
    cartModal.style.display === "block" &&
    !event.composedPath().includes(cartModal) &&
    target instanceof Element &&
    !target.closest('.nav-icons a[href="#shopping"]')
  ) {
    closeCart();
  }

  const authModal = document.getElementById("authModal");
  if (target === authModal) {
    closeModal();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeModal();
    closeMenu();
  }
});

window.addEventListener("scroll", closeMenu);
window.addEventListener("resize", closeMenu);

updateCartDisplay();

if (typeof window.Swiper === "function" && document.querySelector(".mySwiper")) {
  new window.Swiper(".mySwiper", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

if (typeof window.ScrollReveal === "function") {
  const animate = window.ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 2500,
    delay: 400,
  });

  animate.reveal(".nav");
  animate.reveal(".home-text", { origin: "left" });
  animate.reveal(".home-img", { origin: "bottom" });
  animate.reveal(".ser-box, .product-box, .team-box, .book-data", { interval: 100 });
}
