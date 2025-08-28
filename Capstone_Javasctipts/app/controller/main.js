import service from "../service/api.js";
// import product from "../models/product.js";
import Product from "../model/product.js";
import ProductList from "../model/productList.js";

const productList = new ProductList();

function getId(id) {
  return document.getElementById(id);
}

function getListProduct() {
  const promise = service.fetchListData();
  /**
   * Promise: có 3 trạng thái
   *      - pending (chờ)
   *      - resolve (thực hiện)
   *      - reject (không thực hiện)
   */
  // hàm Axios
  // const promise = axios({
  //     url: "https://688b65992a52cabb9f519560.mockapi.io/api/Product",
  //     method: "GET"
  // });

  // cú pháp của promise

  // pending
  getId("loader").style.display = "block";

  promise
    // truyền đối số là callback function
    .then(function (result) {
      console.log(result.data);
      for (let i = 0; i < result.data.length; i++) {
        productList.addProduct(result.data[i]);
      }

      // gọi lại renderHTML để khi có danh sách thì mới hiện lên
      renderHTML(result.data);
      // loader hide
      getId("loader").style.display = "none";
    })
    .catch(function (error) {
      console.log(error);
      // loader hide
      getId("loader").style.display = "none";
    });
}

// render ra ngoài giao diện
function renderHTML(data) {
  console.log("render", data);
  let contentHTML = "";

  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    contentHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>
              <img src="${product.img}" alt="${
      product.name
    }" style="width: 60px; height: 60px; object-fit: cover;">
            </td>
            <td>${product.screen}</td>
            <td>${product.backCamera}</td>
            <td>${product.frontCamera}</td>
            <td>${product.desc}</td>
            <td><span class="badge badge-primary">${product.type}</span></td>
            <td>
                <button class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal" onclick="onEditProduct(${
                  product.id
                })">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="onDelete(${
                  product.id
                })">Delete</button>
                
            </td>
            
        </tr>
        `;
  }
  document.getElementById("tblDanhSachSP").innerHTML = contentHTML;
}

getListProduct();

// Delete
function onDelete(id) {
  const promise = service.deleteProductApi(id);

  // pending
  getId("loader").style.display = "block";
  promise
    .then(function (result) {
      console.log(result);
      getListProduct();
      getId("loader").style.display = "none";
    })
    .catch(function (error) {
      console.log(error);

      // loader
      getId("loader").style.display = "none";
    });
}

window.onDelete = onDelete;

// btnThemSP = Open Modal
getId("btnThemSP").addEventListener("click", function () {
  // Update title Modal
  document.getElementById("modal-title").innerHTML = "Thêm Sản Phẩm";

  // Show Add button, hide Update button
  getId("btnThemSanPham").style.display = "inline-block";
  getId("btnCapNhatSanPham").style.display = "none";

  // Clear form
  clearForm();
});

// Clear form function
function clearForm() {
  getId("TenSP").value = "";
  getId("GiaSP").value = "";
  getId("ManHinh").value = "";
  getId("CameraSau").value = "";
  getId("CameraTruoc").value = "";
  getId("HinhSP").value = "";
  getId("moTa").value = "";
  getId("loaiSP").value = "";
}

// Add product event listener
getId("btnThemSanPham").addEventListener("click", onAddProduct);

// Add product
function onAddProduct() {
  // Lay thong tin tu user nhap
  const name = getId("TenSP").value;
  const price = getId("GiaSP").value;
  const screen = getId("ManHinh").value;
  const backCamera = getId("CameraSau").value;
  const frontCamera = getId("CameraTruoc").value;
  const img = getId("HinhSP").value;
  const desc = getId("moTa").value;
  const type = getId("loaiSP").value;

  // Validation
  if (
    !name ||
    !price ||
    !screen ||
    !backCamera ||
    !frontCamera ||
    !img ||
    !desc ||
    !type
  ) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // create object product
  const product = new Product(
    "",
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  getId("loader").style.display = "block";

  // request api add product
  service
    .addProductApi(product)
    .then(function (result) {
      getId("loader").style.display = "none";
      const data = result.data;
      alert(`Thêm sản phẩm ${data.name} thành công!`);
      // close modal
      document.getElementsByClassName("close")[0].click();
      // re-render get list product
      getListProduct();
    })
    .catch(function (error) {
      // loader hide
      getId("loader").style.display = "none";
      console.log(error);
      alert("Có lỗi xảy ra khi thêm sản phẩm!");
    });
}

window.onAddProduct = onAddProduct;

// edit product
function onEditProduct(id) {
  console.log(id);

  document.getElementById("modal-title").innerHTML = "Cập Nhật Sản Phẩm";

  // Show Update button, hide Add button
  getId("btnThemSanPham").style.display = "none";
  getId("btnCapNhatSanPham").style.display = "inline-block";

  // Update the onclick event for update button
  getId("btnCapNhatSanPham").onclick = function () {
    onUpdateProduct(id);
  };

  service
    .getProductByIdApi(id)
    .then(function (result) {
      // populate product => input
      const data = result.data;
      getId("TenSP").value = data.name;
      getId("GiaSP").value = data.price;
      getId("ManHinh").value = data.screen;
      getId("CameraSau").value = data.backCamera;
      getId("CameraTruoc").value = data.frontCamera;
      getId("HinhSP").value = data.img;
      getId("moTa").value = data.desc;
      getId("loaiSP").value = data.type;
    })
    .catch(function (error) {
      console.log(error);
      getId("loader").style.display = "none";
    });
}

window.onEditProduct = onEditProduct;

// Update product
function onUpdateProduct(id) {
  // Lay thong tin tu user nhap
  const name = getId("TenSP").value;
  const price = getId("GiaSP").value;
  const screen = getId("ManHinh").value;
  const backCamera = getId("CameraSau").value;
  const frontCamera = getId("CameraTruoc").value;
  const img = getId("HinhSP").value;
  const desc = getId("moTa").value;
  const type = getId("loaiSP").value;

  // Validation
  if (
    !name ||
    !price ||
    !screen ||
    !backCamera ||
    !frontCamera ||
    !img ||
    !desc ||
    !type
  ) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // create object product
  const product = new Product(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  getId("loader").style.display = "block";

  service
    .updateProductApi(product)
    .then(function (result) {
      getId("loader").style.display = "none";
      const data = result.data;
      alert(`Cập nhật ${data.name} thành công!`);
      // close modal
      document.getElementsByClassName("close")[0].click();

      // re-render
      getListProduct();
    })
    .catch(function (error) {
      console.log(error);
      getId("loader").style.display = "none";
      alert("Có lỗi xảy ra khi cập nhật sản phẩm!");
    });
}

// search product
getId("searchName").addEventListener("keyup", function () {
  const searchName = getId("searchName").value;
  const productSearch = productList.searchTypeProduct(searchName);
  console.log(productSearch);
  renderHTML(productSearch);
});

// Filter product
getId("sortPrice").addEventListener("change", function () {
  const type = getId("sortPrice").value;
  console.log(type);
  const productFiltered = productList.filterProduct(type);
  renderHTML(productFiltered);
});

window.onUpdateProduct = onUpdateProduct;
