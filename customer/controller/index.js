// Dark and light mode button
function darkMode() {
  let body = document.body;
  body.classList.remove("light-mode");
  body.classList.add("dark-mode");
  document.querySelector("header .dark_theme").classList.add("d-none");
  document.querySelector("header .light_theme").classList.remove("d-none");
  document.querySelector(".slick-dots li button:before").style.color = "white";
}
function lightMode() {
  let body = document.body;
  body.classList.remove("dark-mode");
  body.classList.add("light-mode");
  document.querySelector("header .light_theme").classList.add("d-none");
  document.querySelector("header .dark_theme").classList.remove("d-none");
}

// Notication
function notification(text, duration = 3000) {
  Toastify({
    text,
    duration,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

// Get API products
async function getAllProducts() {
  try {
    let result = await axios({
      method: "GET",
      url: "https://6698aa952069c438cd6f73c2.mockapi.io/api/v1/Products",
    });
    renderProductsList(result.data);
  } catch (error) {
    console.log(error);
    notification("Có lỗi xảy ra, vui lòng thử lại");
  }
}

getAllProducts();

// Render all products
function renderProductsList(arrProducts) {
  let content = "";
  arrProducts.forEach((item, index) => {
    let { id, name, price, desc, img, type, backCamera, frontCamera, screen } =
      item;
    content += `
          <div class="col-3">
            <div class="product-item">
              <div class="item_bg text-center">
                <img
                  src="${img}"
                  alt=""
                />
              </div>
              <div class="item_content">
                <p>${name}</p>
                <p>${price.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}</p>
              </div>
              <div class="item_overlay">
                <div class="overlay_content">
                  <div class="content_text">
                    <p>Thương hiệu: ${type}</p>
                    <p>Camera trước: ${frontCamera}</p>
                    <p>Camera sau: ${backCamera}</p>
                    <p>Màn hình: ${screen}</p>
                    <p>Mô tả sản phẩm: ${desc}</p>
                  </div>
                  <div class="content_button text-center">
                    <button class="btn btn-warning" onclick="addToCart(${id})">Thêm vào giỏ hàng<i class="fa-solid fa-cart-shopping"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
    `;
  });
  document.getElementById("listProducts").innerHTML = content;
}

// Filter products
async function filterProducts() {
  let arrFilterProducts = [];
  let filterValue = document.getElementById("filterTypeProducts").value;
  try {
    let result = await axios({
      method: "GET",
      url: "https://6698aa952069c438cd6f73c2.mockapi.io/api/v1/Products",
    });
    let arrProducts = [];
    arrProducts = result.data;
    if (filterValue == "Chọn thương hiệu") {
      renderProductsList(result.data);
    } else {
      arrFilterProducts = arrProducts.filter((item, index) => {
        return item.type.toLowerCase() == filterValue.toLowerCase();
      });
      renderProductsList(arrFilterProducts);
    }
  } catch (error) {
    console.log(error);
    notification("Có lỗi xảy ra, vui lòng thử lại");
  }
}

// Search products
async function searchProducts(event) {
  let arrSearchProducts = [];
  let searchValue = removeVietnameseTones(
    event.target.value.toLowerCase().trim()
  );
  try {
    let result = await axios({
      method: "GET",
      url: "https://6698aa952069c438cd6f73c2.mockapi.io/api/v1/Products",
    });
    let arrProducts = [];
    arrProducts = result.data;
    arrSearchProducts = arrProducts.filter((item, index) => {
      let newSearchValue = removeVietnameseTones(
        item.name.toLowerCase().trim()
      );
      return newSearchValue.includes(searchValue);
    });
    if (arrSearchProducts.length != 0) {
      renderProductsList(arrSearchProducts);
    } else {
      document.getElementById("listProducts").innerHTML = `
        <div class="text-center notFound">
          <i class="fa-solid fa-face-sad-tear"></i>
          <h2>Rất tiếc chúng tôi không tìm thấy sản phẩm!</h2>
        </div>>`;
    }
  } catch (error) {
    console.log(error);
    notification("Có lỗi xảy ra, vui lòng thử lại");
  }
}

document.getElementById("txtSearch").oninput = searchProducts;

// Shopping cart
let arrCart = [];
let cardIcon = document.getElementById("cart-icon");
let card = document.querySelector("header .cart .card");
let closeCard = document.querySelector("#close-card");

// Open cart
function openCart() {
  card.classList.toggle("active");
}

// Close Cart
function closeCart() {
  card.classList.remove("active");
}

// Add to cart
async function addToCart(id) {
  try {
    let result = await axios({
      method: "GET",
      url: `https://6698aa952069c438cd6f73c2.mockapi.io/api/v1/Products/${id}`,
    });
    let newProduct = new Cart();
    Object.assign(newProduct, result.data);
    let existProduct = new Cart();
    Object.assign(
      existProduct,
      arrCart.find((item, index) => {
        return item.id == newProduct.id;
      })
    );
    if (newProduct.id == existProduct.id) {
      let index = arrCart.findIndex((item, index) => {
        return item.id == newProduct.id;
      });
      console.log(index);
      arrCart[index].quantity++;
      saveLocalStorage();
      getLocalStorage();
    } else {
      newProduct.quantity = 1;
      arrCart.push(newProduct);
      saveLocalStorage();
      getLocalStorage();
    }
    console.log(arrCart);
  } catch (error) {
    console.log(error);
    notification("Có lỗi xảy ra, vui lòng thử lại");
  }
}

// Render cart
function renderCart(arr = arrCart) {
  let content = "";
  let total = 0;
  let counting = 0;
  arrCart.forEach((item, index) => {
    let { id, name, price, img, quantity } = item;
    total += price * quantity;
    counting += quantity;
    content += `
                    <div class="cart-item row">
                      <div class="item-image col-4">
                        <img
                          src="${img}"
                          alt=""
                          width="100%"
                        />
                      </div>
                      <div class="item-content col-8">
                        <h3>${name}</h3>
                        <p>Giá: ${price.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}</p>
                        <div class="item-button">
                          <button class="btn btn-outline-dark col-2" onclick="minusButton(${id})">-</button>
                          <input
                            type="text"
                            name=""
                            id=""
                            placeholder="${quantity}"
                            width="20px"
                            class="col-4 text-center"
                            disabled
                          />
                          <button class="btn btn-outline-dark col-2" onclick="plusButton(${id})">+</button>
                          <i class="fa-regular fa-trash-can" onclick="deleteProductInCart(${id})"></i>
                        </div>
                      </div>
                    </div>                   
    `;
  });
  document.querySelector("header .cart .cart-content").innerHTML = content;
  document.querySelector("header .cart .total-price").innerHTML =
    total.toLocaleString("vi", {
      style: "currency",
      currency: "VND",
    });
  document.querySelector(
    "header .cart .cart-overlay .count-product"
  ).innerHTML = counting;
}

// Delete product in cart
function deleteProductInCart(id) {
  let index = arrCart.findIndex((item, index) => {
    return item.id == id;
  });
  arrCart.splice(index, 1);
  saveLocalStorage();
  getLocalStorage();
}

// Plus button
function plusButton(id) {
  let index = arrCart.findIndex((item, index) => {
    return item.id == id;
  });
  arrCart[index].quantity++;
  saveLocalStorage();
  getLocalStorage();
}

// Minus button
function minusButton(id) {
  let index = arrCart.findIndex((item, index) => {
    return item.id == id;
  });
  arrCart[index].quantity--;
  if (arrCart[index].quantity == 0) {
    arrCart.splice(index, 1);
  }
  saveLocalStorage();
  getLocalStorage();
}

// Check empty cart
function checkEmptyCart(arr = arrCart) {
  let totalField = document.querySelector("header .cart .total");
  let btnBuy = document.querySelector("header .cart .btn-buy");
  if (arr.length == 0) {
    totalField.classList.add("invisible");
    btnBuy.classList.add("invisible");
    document.querySelector("header .cart .cart-content").innerHTML = `
                  <div class="empty-cart text-center">
                    <img
                      src="./asset/img/cart_empty_icon.png"
                      alt=""
                      width="80%"
                    />
                    <h4>Giỏ hàng trống</h4>
                  </div>
    `;
  } else {
    totalField.classList.remove("invisible");
    btnBuy.classList.remove("invisible");
  }
  console.log(totalField);
}
checkEmptyCart();

// Counting products in cart
function countingCart(arr = arrCart) {
  if (arr.length == 0) {
    document
      .querySelector("header .cart .cart-overlay")
      .classList.add("d-none");
  } else {
    document
      .querySelector("header .cart .cart-overlay")
      .classList.remove("d-none");
  }
}

// Buy button
function buyButton() {
  arrCart = [];
  saveLocalStorage();
  getLocalStorage();
  closeCart();
  notification("Chúc mừng bạn đã thanh toán thành công");
}

// Locale Storage
// Save data to locale storage
function saveLocalStorage(key = "arrCart", value = arrCart) {
  let stringJSON = JSON.stringify(value);
  localStorage.setItem(key, stringJSON);
}

// Get data from locale storage
function getLocalStorage(key = "arrCart") {
  let dataLocal = localStorage.getItem(key);
  if (dataLocal) {
    let revertData = JSON.parse(dataLocal);
    arrCart = revertData;
    renderCart();
    checkEmptyCart();
    countingCart();
  }
}

getLocalStorage();
