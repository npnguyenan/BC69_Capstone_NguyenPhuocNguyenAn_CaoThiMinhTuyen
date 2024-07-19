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

// Thông báo lỗi
function showError(text, duration = 3000) {
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
    console.log(result.data);
  } catch (error) {
    console.log(error);
    showError("Có lỗi xảy ra, vui lòng thử lại");
  }
}

getAllProducts();

// Render all products
function renderProductsList(arrProducts) {
  let content = "";
  arrProducts.forEach((item, index) => {
    let { name, price, desc, img, type, backCamera, frontCamera, screen } =
      item;
    content += `
          <div class="col-3">
            <div class="product_item p-2">
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
                    <button class="btn btn-warning">Thêm vào giỏ hàng<i class="fa-solid fa-cart-shopping"></i></button>
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
    showError("Có lỗi xảy ra, vui lòng thử lại");
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
    showError("Có lỗi xảy ra, vui lòng thử lại");
  }
}

document.getElementById("txtSearch").oninput = searchProducts;
