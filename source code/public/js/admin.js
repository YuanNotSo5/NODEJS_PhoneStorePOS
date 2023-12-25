// begin admin //
(function() {
    const tableRows = document.querySelectorAll('#employeeTable tr:not(:first-child)');
    tableRows.forEach((row, index) => {
      const sttCell = row.querySelector('td:first-child');
      sttCell.textContent = index + 1;
    });
})();
// end admin //


$(document).ready(function(){
  let isUpdate = false;
  let itemUpdate;
  let itemDelete;
  let itemLock;

  $('.btnCloseModal').on('click', function () {
      location.reload(); // Tải lại trang
  });

  const infoModal = $('#exampleModal');
    if (infoModal) {
        infoModal.on('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            console.log(button)
            const action = button.getAttribute('data-bs-whatever')
            const name = button.getAttribute('data-bs-whatever1')
            const id = button.getAttribute('data-id')
  
            const modalTitle = infoModal.find('.modal-header h4');
            if (action != "add") {
                modalTitle.text(`Information Employee ${name}`);
  
                $.ajax({
                    url: "/admin/api/account_employee/" + id,
                    type: "GET",
                    contentType: 'application/x-www-form-urlencoded',
                    dataType: "json",
                    success: function (result) {
                      var account = result.account
                      var employee = result.employee
                      
                      console.log(result);
                      $("#username_row").css("display","block")
                      
                      $("#usernameInput").val(account.username);
                      $("#nameInput").val(employee.fullname);
                      $("#emailInput").val(account.gmail);
                      $('#phoneNumberInput').val(employee.phoneNumber);
                      $("#addressInput").val(employee.address);

                      $("#usernameInput").prop('disabled', true);
                      $("#nameInput").prop('disabled', true);
                      $("#emailInput").prop('disabled', true);
                      $("#phoneNumberInput").prop('disabled', true);
                      $("#addressInput").prop('disabled', true);

                      $("#addEmployeeBtn").css("display", "none")
                    },
                    error: function (error) {
                        console.log('Error message:', error.responseText);
                    }
                });
            }
        });
    }

  $("#addEmployeeBtn").click(function (e) {
      e.preventDefault();
      let name = $("#nameInput").val();
      let email = $("#emailInput").val();
      let phone = $("#phoneNumberInput").val();
      let address = $("#addressInput").val();

      if (checkInput(name, email, phone, address)) {
          addNewCustomer(name, email, phone, address);
      }
  });

  function checkInput(name, email, phone, address) {
  // Kiểm tra tên
      if (name === "") {
          $("#nameHelper").removeAttr("hidden");
          return false;
      }

      // Kiểm tra số điện thoại
      if (phone !== "" && !/^\d+$/.test(phone)) {
          $("#barcodeHelper").text("Số điện thoại chỉ được chứa các chữ số");
          $("#barcodeHelper").removeAttr("hidden");
          return false;
      }

      // Kiểm tra địa chỉ
      if (email === "") {
          $("#emailHelper").removeAttr("hidden");
          return false;
      }

      // Ẩn các thông báo lỗi
      $("#nameHelper").attr("hidden", true);
      $("#barcodeHelper").attr("hidden", true);
      $("#emailHelper").attr("hidden", true);

      return true;
  }

  function addNewCustomer(name, email, phone, address) {
      if (isUpdate) {
        const oldEmail = $(".updateAccount").attr('data-bs-email')
        $(".updateAccount").click(function(){
          const oldEmail = $(this).attr('data-bs-email')
          console.log(oldEmail)
        })
        let username = $("#self_usernameInput").val();

          $.ajax({
              url: "/admin/api/account_employee/" + itemUpdate,
              type: "PUT",
              data: {
                username: username,
                fullname: name,
                email: email,
                oldEmail: oldEmail,
                phoneNumber: phone,
                address: address,
              },
              contentType: 'application/x-www-form-urlencoded',
              dataType: "json",
              success: function (result) {
                  isUpdate = false;
                  itemUpdate = "";
                //   $("#usernameInput").val("");
                //   $("#nameInput").val("");
                //   $("#emailInput").val("");
                //   $("#phoneNumberInput").val("");
                //   $("#addressInput").val("");
                  
                  $('.alertSuccess').show();
                  $(".alertDanger").hide();
              },
              error: function (error) {
                $(".alertDanger").html("Không thể cập nhật thông tin nhân viên khách hàng: " + error.responseText).show();
                console.log('Error message:', error.responseText);
              }
          });
      } else {
          $.ajax({
              url: "/admin/api/account_employee",
              type: "POST",
              data: {
                  fullname: name,
                  email: email,
                  phoneNumber: phone,
                  address: address,
              },
              contentType: 'application/x-www-form-urlencoded',
              dataType: "json",
              // {{!-- enctype: 'multipart/form-data', --}}
              success: function (result) {
                  $("#nameInput").val("");
                  $("#emailInput").val("");
                  $("#phoneNumberInput").val("");
                  $("#addressInput").val("");

                  $('.alertSuccess').show();
                  $(".alertDanger").hide();
              },
              error: function (error) {
                  $(".alertDanger").html("Không thể thêm nhân viên mới: " + error.responseText).show();
                  console.log('Error message:', error.responseText);
              }
          });
      }
  }

  //-----------------Send form update product ---------------------------//
  const updateModal = $('#exampleModal');
  if (updateModal) {
      updateModal.on('show.bs.modal', function(event) {
          const button = event.relatedTarget;
          const action = button.getAttribute('data-bs-whatever')
          const name = button.getAttribute('data-bs-whatever1')
          const id = button.getAttribute('data-id')

          const modalTitle = updateModal.find('.modal-header h4');
          if (action != "add" && action != "info") {
              isUpdate = true;
              modalTitle.text(`Update Employee ${name}`);
              itemUpdate = id;

              $.ajax({
                  url: "/api/account_employee/" + itemUpdate,
                  type: "GET",
                  contentType: 'application/x-www-form-urlencoded',
                  dataType: "json",
                  success: function (result) {
                    var account = result.account
                    var employee = result.employee
                    
                    console.log(result);
                    $("#username_row").css("display","block")
                    
                    $("#usernameInput").val(account.username);
                    $("#nameInput").val(employee.fullname);
                    $("#emailInput").val(account.gmail);
                    $('#phoneNumberInput').val(employee.phoneNumber);
                    $("#addressInput").val(employee.address);

                    $("#usernameInput").prop('disabled', false);
                    $("#nameInput").prop('disabled', false);
                    $("#emailInput").prop('disabled', false);
                    $("#phoneNumberInput").prop('disabled', false);
                    $("#addressInput").prop('disabled', false);

                    $("#addEmployeeBtn").css("display", "block")
                  },
                  error: function (error) {
                      console.log('Error message:', error.responseText);
                  }
              });
          }
      });
  }

  //-----------------End send form update product ---------------------------//




  //-----------------Delete ---------------------------//
  //Agree Delete Modal


  $("#btnDeleteModal").click(function(e){
      e.preventDefault();
      $.ajax({
          url: "/admin/api/account_employee/"+itemDelete,
          type: "DELETE",
          dataType: "json",
          success: function (result) {
              location.reload();
              itemDelete = ""
          },
          error: function (error) {
              console.log('Error message:', error.responseText);
          }
      });
  });  
  const deleteModal = document.getElementById('deleteModal')
  if (deleteModal) {
      deleteModal.addEventListener('show.bs.modal', event => {
          const button = event.relatedTarget
          const nameCustomer = button.getAttribute('data-bs-whatever')
          itemDelete = button.getAttribute('data-id')
          const modalTitle = deleteModal.querySelector('.modal-title')
          const modalBody = deleteModal.querySelector('.modal-body')
          modalTitle.textContent = `Delete Employee ${nameCustomer}`
          modalBody.textContent = `You want to delete ${nameCustomer}`
      })
  }

  //-----------------End of Delete ---------------------------//

  $("#btnLockModal").click(function(e){
      e.preventDefault();
      $.ajax({
          url: "/admin/api/account_employee/lock/"+itemLock,
          type: "PUT",
          dataType: "json",
          success: function (result) {
              location.reload();
              itemLock = ""
          },
          error: function (error) {
              console.log('Error message:', error.responseText);
          }
      });
  });  

  const lockModal = document.getElementById('lockModal')
  if (lockModal) {
      lockModal.addEventListener('show.bs.modal', event => {
          const button = event.relatedTarget
          console.log(button)
          const name = button.getAttribute('data-bs-whatever')
          const status = button.getAttribute('data-bs-whatever1')

          console.log(name)
          console.log(status)

          itemLock = button.getAttribute('data-id')
          const modalTitle = lockModal.querySelector('.modal-title')
          const modalBody = lockModal.querySelector('.modal-body')
          if(status){
            modalTitle.textContent = `Unlock Employee ${name}`
            modalBody.textContent = `Do you want to unlock ${name}`
          }else{
            modalTitle.textContent = `Lock Employee ${name}`
            modalBody.textContent = `Do you want to lock ${name}`
          }
          
      })
  }

  $(".activateAccount").click(function(){
    
    var email = $(this).val()
    $.ajax({
      url: "/admin/sendEmail",
      type: "POST",
      dataType: "json",
      data:{
        email: email
      },
      success: function (result) {
        $(".alertSuccess").html("Gửi email kích hoạt tài khoản thành công").show();
          location.reload();

          // location.reload();
      },
      error: function (error) {
          console.log('Error message:', error.responseText);
      }
    });
  })
})