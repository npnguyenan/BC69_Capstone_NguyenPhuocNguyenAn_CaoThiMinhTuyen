const API_URL = "https://6698a23b2069c438cd6f58f5.mockapi.io/api/v1/Products";
let arrPhone = [];
let editPhoneId = 0;

function getPhones() {
  axios
    .get(API_URL)
    .then(function (response) {
      console.log(response.data);
      arrPhone = response.data;
      let html = renderPhoneEle(response.data);
      let tableBody = document.getElementById("tableDanhSach");
      tableBody.innerHTML = html;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function renderPhoneEle(data) {
  let content = "";
  for (let phone of data) {
    let { id, name, price, img, desc } = phone;
    content += `
      <tr id='${id}'>
      <td>${id}</td>
      <td>${name}</td>
      <td>${price}</td>
      <td><img src="${img}" class="phone-img"></img></td>
      <td>${desc}</td>
      <td>
        <button  class='btn btn-danger ' onclick="deletePhone('${phone.id}')">Xoá</button>
        <button class='btn btn-warning' onclick="showModalEdit(${phone.id})">Sửa</button>
      </td>
    </tr>
      `;
  }
  return content;
}

function addPhone() {
  if (!validation()) {
    return;
  }
  let arrField = document.querySelectorAll(
    "#formPhone input, #formPhone select"
  );
  let phone = {};
  for (let field of arrField) {
    let { id, value } = field;
    phone[id] = value;
  }
  $("#myModal").modal("hide");
  axios
    .post(API_URL, phone)
    .then(function (response) {
      getPhones();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function deletePhone(id) {
  axios
    .delete(API_URL + `/${id}`)
    .then(function (response) {
      getPhones();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function searchPhone(event) {
  let newKeyWord = removeVietnameseTones(
    event.target.value.toLowerCase().trim()
  );
  let arrSearchPhone = arrPhone.filter((item, index) => {
    // format lại dữ liệu của tên Phone
    let newPhone = removeVietnameseTones(item.name.toLowerCase().trim());
    return newPhone.includes(newKeyWord);
  });
  let html = renderPhoneEle(arrSearchPhone);
  let tableBody = document.getElementById("tableDanhSach");
  tableBody.innerHTML = html;
}

function showModalEdit(id) {
  $("#myModal").modal("show");

  let editPhone = arrPhone.filter((item, index) => {
    return item.id == id;
  });

  let name = $("#myModal").find('input[name="name"]')[0];
  name.value = editPhone[0].name;

  let price = $("#myModal").find('input[name="price"]')[0];
  price.value = editPhone[0].price;

  let screen = $("#myModal").find('input[name="screen"]')[0];
  screen.value = editPhone[0].screen;

  let backCamera = $("#myModal").find('input[name="backCamera"]')[0];
  backCamera.value = editPhone[0].backCamera;

  let frontCamera = $("#myModal").find('input[name="frontCamera"]')[0];
  frontCamera.value = editPhone[0].frontCamera;

  let img = $("#myModal").find('input[name="image"]')[0];
  img.value = editPhone[0].img;

  let description = $("#myModal").find('input[name="description"]')[0];
  description.value = editPhone[0].desc;

  let type = $("#myModal").find('select[name="type"]')[0];
  type.value = editPhone[0].type;

  editPhoneId = editPhone[0].id;
}

function editPhone() {
  if (!validation()) {
    return;
  }
  let arrField = document.querySelectorAll(
    "#formPhone input, #formPhone select"
  );
  let phone = {};
  for (let field of arrField) {
    let { id, value } = field;
    phone[id] = value;
  }

  axios
    .put(API_URL + `/${editPhoneId}`, phone)
    .then(function (response) {
      $("#myModal").modal("hide");
      getPhones();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function validation() {
  var myForm = $("#myForm");
  myForm.validate({
    rules: {
      name: {
        required: true,
      },
      price: {
        required: true,
        number: true,
      },
      type: {
        required: true,
      },
    },
    messages: {
      name: "Nhập tên điện thoại hợp lệ",
      price: "Nhập số tiền hợp lệ",
    },
    errorElement: "span",
  });

  return myForm.valid();
}

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}
getPhones();
setTimeout(() => {
  $("#myTable").DataTable({
    searching: false,
    paging: false,
  });
}, 300);
