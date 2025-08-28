import service from "../service/api.js";
import CartItem from "../model/cartItem.js";

function getId(id) {
  return document.getElementById(id);
}

// Biến global
let allProducts = []; // Lưu tất cả sản phẩm
let cart = []; // Giỏ hàng global

// Load cart from localStorage
function loadCartFromStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    const cartData = JSON.parse(savedCart);
    cart = cartData.map(item => new CartItem(item.id, item.name, item.price, item.img, item.quantity));
  }
  updateCartUI();
}

// Hàm lấy danh sách sản phẩm cho khách hàng
function getListProductForCustomer() {
  const promise = service.fetchListData();

  // Show loading spinner
  const loadingSpinner = getId("loadingSpinner");
  const productContainer = getId("productContainer");
  
  if (loadingSpinner) loadingSpinner.style.display = "flex";
  if (productContainer) productContainer.style.display = "none";

  promise
    .then(function (result) {
      console.log("Products data:", result.data);
      allProducts = result.data; // Lưu tất cả sản phẩm
      // Gọi hàm render sản phẩm cho khách hàng
      renderProductCards(result.data);
      
      // Hide loading spinner and show products
      if (loadingSpinner) loadingSpinner.style.display = "none";
        if (productContainer) productContainer.style.display = "flex";
    })
    .catch(function (error) {
      console.log("Error fetching products:", error);
      
      // Hide loading spinner
      if (loadingSpinner) loadingSpinner.style.display = "none";
      
      // Hiển thị thông báo lỗi cho khách hàng
      if (productContainer) {
        productContainer.style.display = "block";
        productContainer.innerHTML = `
          <div class="col-12 text-center">
            <div class="alert alert-danger">
              <h4>Không thể tải danh sách sản phẩm</h4>
              <p>Vui lòng kiểm tra kết nối mạng và thử lại sau!</p>
              <button class="btn btn-primary" onclick="location.reload()">Thử lại</button>
            </div>
          </div>
        `;
      }
    });
}

// Hàm filter sản phẩm theo loại (yêu cầu số 4)
function filterProductsByType(type) {
  console.log("Filtering by type:", type);
  
  if (type === "") {
    // Hiển thị tất cả sản phẩm
    renderProductCards(allProducts);
  } else {
    // Lọc sản phẩm theo type (case insensitive)
    const filteredProducts = allProducts.filter(product => {
      // Xử lý trường hợp "iphone" vs "Iphone"
      const productType = product.type.toLowerCase();
      const filterType = type.toLowerCase();
      return productType === filterType || 
             (filterType === "iphone" && productType === "iphone");
    });
    renderProductCards(filteredProducts);
    
    console.log(`Filtered ${filteredProducts.length} products of type: ${type}`);
  }
}

// Hàm render card sản phẩm cho khách hàng (tương tự như render table cho admin)
function renderProductCards(data) {
  console.log("Rendering product cards:", data);
  let contentHTML = "";

  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    
    contentHTML += `
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card cardPhone h-100">
          <img
            src="${product.img}"
            class="card-img-top"
            alt="${product.name}"
            style="height: 250px; object-fit: cover;"
            onerror="this.src='../../assets/img/product1.png'"
          />
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h3 class="cardPhone__title">${product.name}</h3>
                <p class="cardPhone__text">${product.type}</p>
                <small class="text-muted">Màn hình: ${product.screen}</small>
              </div>
              <div class="text-right">
                <h3 class="cardPhone__title text-primary">$${product.price}</h3>
              </div>
            </div>
            
            <div class="mb-2">
              <small class="text-muted">
                <i class="fa fa-camera"></i> ${product.backCamera}<br>
                <i class="fa fa-camera"></i> Camera trước: ${product.frontCamera}
              </small>
            </div>
            
            <p class="card-text text-muted small mb-3">${product.desc}</p>
            
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-end">
                <div>
                  <button class="btnPhone-shadow" onclick="addToCart('${product.id}')">
                    <i class="fa fa-shopping-cart"></i> Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Render vào container
  const productContainer = getId("productContainer");
  if (productContainer) {
    productContainer.innerHTML = contentHTML;
  }
}


// Hàm xử lý thêm vào giỏ hàng (yêu cầu số 5, 6, 7)
function addToCart(productId) {
  // Tìm sản phẩm trong danh sách
  const product = allProducts.find(p => p.id === productId);
  if (!product) {
    alert("Không tìm thấy sản phẩm!");
    return;
  }
  
  // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
  const existingCartItem = cart.find(item => item.id === productId);
  
  if (existingCartItem) {
    // Nếu đã có, tăng quantity lên 1
    existingCartItem.quantity += 1;
    alert(`Đã tăng số lượng ${product.name} lên ${existingCartItem.quantity}!`);
  } else {
    // Nếu chưa có, tạo CartItem mới với quantity = 1
    const cartItem = new CartItem(product.id, product.name, product.price, product.img, 1);
    cart.push(cartItem);
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  }
  
  // Lưu vào localStorage và cập nhật UI
  saveCartToStorage();
  updateCartUI();
}

// Lưu cart vào localStorage (yêu cầu số 11)
function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Cập nhật UI giỏ hàng
function updateCartUI() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.getTotalPrice(), 0);
  
  // Cập nhật số lượng trên icon giỏ hàng (nếu có)
  const cartCountElement = getId("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
    // Ẩn badge nếu giỏ hàng trống
    cartCountElement.style.display = cartCount > 0 ? 'inline' : 'none';
  }
  
  // Render lại bảng giỏ hàng nếu đang mở
  renderCart();
}

// Render giỏ hàng (yêu cầu số 8)
function renderCart() {
  const cartTableBody = getId("cartTableBody");
  const cartTotal = getId("cartTotal");
  
  if (!cartTableBody) return; // Nếu không có bảng giỏ hàng thì return
  
  if (cart.length === 0) {
    cartTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-4">
          <i class="fa fa-shopping-cart" style="font-size: 48px; opacity: 0.3;"></i>
          <p class="mt-2">Giỏ hàng của bạn đang trống</p>
        </td>
      </tr>
    `;
    if (cartTotal) {
      cartTotal.innerHTML = `<strong>Tổng tiền: $0</strong>`;
    }
    return;
  }
  
  let contentHTML = "";
  let totalPrice = 0;
  
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const itemTotal = item.getTotalPrice();
    totalPrice += itemTotal;
    
    contentHTML += `
      <tr>
        <td>
          <img src="${item.img}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded">
        </td>
        <td><strong>${item.name}</strong></td>
        <td><span class="text-primary">$${item.price}</span></td>
        <td>
          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity('${item.id}')" title="Giảm số lượng">
              <i class="fa fa-minus"></i>
            </button>
            <span class="mx-3 font-weight-bold">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity('${item.id}')" title="Tăng số lượng">
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </td>
        <td><strong class="text-success">$${itemTotal}</strong></td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="removeFromCart('${item.id}')" title="Xóa khỏi giỏ hàng">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }
  
  cartTableBody.innerHTML = contentHTML;
  
  // Hiển thị tổng tiền (yêu cầu số 10)
  if (cartTotal) {
    cartTotal.innerHTML = `<strong class="h5 text-primary">Tổng tiền: $${totalPrice}</strong>`;
  }
}

// Tăng số lượng sản phẩm (yêu cầu số 9)
function increaseQuantity(productId) {
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
    saveCartToStorage();
    updateCartUI();
  }
}

// Giảm số lượng sản phẩm (yêu cầu số 9)  
function decreaseQuantity(productId) {
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
    } else {
      // Nếu quantity = 1, xóa khỏi giỏ hàng
      removeFromCart(productId);
      return;
    }
    saveCartToStorage();
    updateCartUI();
  }
}

// Xóa sản phẩm khỏi giỏ hàng (yêu cầu số 13)
function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    const item = cart[index];
    if (confirm(`Bạn có chắc muốn xóa ${item.name} khỏi giỏ hàng?`)) {
      cart.splice(index, 1);
      saveCartToStorage();
      updateCartUI();
      alert("Đã xóa sản phẩm khỏi giỏ hàng!");
    }
  }
}

// Thanh toán và clear giỏ hàng (yêu cầu số 12)
function checkout() {
  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }
  
  const totalPrice = cart.reduce((total, item) => total + item.getTotalPrice(), 0);
  
  if (confirm(`Tổng tiền: $${totalPrice}\nBạn có chắc muốn thanh toán?`)) {
    // Clear giỏ hàng
    cart = [];
    saveCartToStorage();
    updateCartUI();
    alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng!");
  }
}

// Expose functions to global scope
window.addToCart = addToCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.filterProductsByType = filterProductsByType;

// Khởi chạy khi trang load
document.addEventListener('DOMContentLoaded', function() {

  // Load cart từ localStorage
  loadCartFromStorage();
  
  // Load danh sách sản phẩm
  getListProductForCustomer();
  
  // Gắn sự kiện cho dropdown filter (yêu cầu số 4)
  const typeFilter = getId("typeFilter");
  if (typeFilter) {
    typeFilter.addEventListener('change', function() {
      filterProductsByType(this.value);
    });
  }
  
  // Event listener cho modal giỏ hàng
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    $(cartModal).on('show.bs.modal', function (e) {
      // Render cart khi mở modal
      renderCart();
    });
  }
});

// Export functions nếu cần
export { getListProductForCustomer, renderProductCards, addToCart, filterProductsByType, renderCart };
