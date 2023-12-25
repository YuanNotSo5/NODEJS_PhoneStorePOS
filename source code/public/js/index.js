document.addEventListener('click', function(event) {
  if (event.target.classList.contains('btn-danger')) {
    const barcode = event.target.closest('.product-item').id;

    fetch(`/api/products/${barcode}`)
      .then(response => response.json())
      .then(product => {
        const { name, fileName, retailPrice, _barcode, importPrice, totalQuantity } = product.product;
        if (totalQuantity <= 0) {
          alert("Sản phẩm trong kho đã hết hàng.");
          return;
        }

        addCart(retailPrice, fileName, name, _barcode, importPrice, totalQuantity);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
});

function addCart(productPrice, productImg, productName, _barcode, importPrice, totalQuantity) {
  var cartItems = document.querySelectorAll("tbody tr");
  var existingProduct = null;

  // Kiểm tra sp tồn tại
  cartItems.forEach(function(cartItem) {
    var nameElement = cartItem.querySelector(".col-md-9 h4");
    if (nameElement.innerText === productName) {
      existingProduct = cartItem;
    }
  });

  if (existingProduct) {
    // Nếu sp đã tồn tại, tăng số lượng lên 1
    var quantityElement = existingProduct.querySelector("input");
    var currentQuantity = parseInt(quantityElement.value);
    if(currentQuantity >= totalQuantity) {
      alert("Bạn không thể mua nhiều hơn vì sản phẩm trong kho đã hết");
      return;
    }
    quantityElement.value = currentQuantity + 1;

  } else {
    // Nếu sp chưa tồn tại, thêm mới vào giỏ hàng
    var addtr = document.createElement("tr");
    var trcontent = `<tr>
      <td data-th="Product">
          <div class="row">
              <div class="col-md-6 text-left">
                  <img src="/images/productImg/${productImg}" alt="" class="img-fluid d-none d-md-block rounded mb-2 shadow">
              </div>
              <div class="col-md-9 text-left mt-sm-2">
                  <h4>${productName}</h4>
              </div>
          </div>
      </td>
      <td data-th="Price"><span>${productPrice}</span></td>
      <td data-th="importPrice" style="display: none;"><b>${importPrice}</b></td>

      <td data-th="Quantity">
          <input type="number" class="form-control form-control-lg text-center" value="1" onchange="updateTotal()" max="${totalQuantity}">
      </td>
      <td data-th="Total">500</td>
      <td data-th="Totalimport" style="display: none;">500</td>

      <td data-th="Barcode" style="display: none;">${_barcode}</td> <!-- Thêm cột cho mã vạch -->
      <td class="actions" data-th="">
          <div class="text-right">
              <button class="btn-trash btn btn-white border-secondary bg-white btn-md mb-2">
                  <i class="fas fa-trash"></i>
              </button>
          </div>
      </td>
    </tr>`;
    addtr.innerHTML = trcontent;
    
    var cartTable = document.querySelector("tbody");
    cartTable.append(addtr);

    // Xoá sản phẩm
    var deleteBtn = addtr.querySelector(".btn-trash");
    deleteBtn.addEventListener("click", function() {
      var row = deleteBtn.closest("tr");
      row.remove();
      updateTotal();
    });
  }

  updateTotal(totalQuantity);
}

function updateTotal(totalQuantity) {
  var cartItems = document.querySelectorAll("tbody tr");
  var totalC = 0;

  //import price
  var totalH = 0; 

  cartItems.forEach(function(cartItem) {
    var inputValue = cartItem.querySelector("input").value;
    if (inputValue < 1) {
      inputValue = 1; // Đặt sl = 1 nếu < 0
      cartItem.querySelector("input").value = inputValue; // Cập nhật giá trị trong input
    }

    var productPrice = cartItem.querySelector("span").innerText;
    var totalA = inputValue * productPrice;
    totalC += totalA;

    //////////////////////// import price
    var importPrice = cartItem.querySelector("b").innerText;
    var totalG = inputValue * importPrice;
    totalH += totalG;             


    // Cập nhật giá trị tổng tiền 
    var totalElement = cartItem.querySelector("td[data-th='Total']");
    totalElement.innerText = totalA.toFixed(2);

    var totalElementimport = cartItem.querySelector("td[data-th='Totalimport']");
    totalElementimport.innerText = totalG.toFixed(2);
  });

  var cartTotalA = document.querySelector(".price-total");
  cartTotalA.innerHTML = totalC.toFixed(2);

  

  var cartTotalM = document.querySelector(".revenue");
  cartTotalM.innerHTML = totalH.toFixed(2);

  
}

