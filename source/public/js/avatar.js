$(document).ready(function(){
    let status
    var oldEmail
    let old_pass = null
    let default_pass = null

    $.ajax({
        url: "/api/account/",
        type: "GET",
        contentType: 'application/x-www-form-urlencoded',
        dataType: "json",
        success: function (result) {            
            var account = result.account 
            var employee = result.employee

            $("#your_img").attr("src", employee.profileImg)
            $("#your_name").html(account.username)

            var role = account.authorization
            if(role == 1){
                $("#your_role").html("Manager") 
            }
            else{
                $("#your_role").html("Employee") 
            }
            

            $("#self_usernameInput").val(account.username);
            $("#self_nameInput").val(employee.fullname);
            $("#self_emailInput").val(account.gmail);
            $('#self_phoneNumberInput').val(employee.phoneNumber);
            $("#self_addressInput").val(employee.address);
            oldEmail = account.gmail
            old_pass = account.password
            ////////////////
            $("#self_username_row").css("display","none")
            
            $("#self_usernameInput").prop('disabled', true);
            $("#self_nameInput").prop('disabled', true);
            $("#self_emailInput").prop('disabled', true);
            $("#self_phoneNumberInput").prop('disabled', true);
            $("#self_addressInput").prop('disabled', true);

            $("#self_updateEmployeeBtn").css("display", "none")

            if(role != 1){
                var email = account.gmail
                default_pass = email.split("@")[0]

                if(account.password == default_pass){
                    status = false
                    $("#changeModal").modal('show')
                }
            }
        },
        error: function (error) {
            alert("YOU ARE NOT SIGN IN")
            location.href = "/login"
        }
    });

    $("#self_cancelBtn").click(function(){
        $("#self_username_row").css("display","none")
        
        $("#self_usernameInput").prop('disabled', true);
        $("#self_nameInput").prop('disabled', true);
        $("#self_emailInput").prop('disabled', true);
        $("#self_phoneNumberInput").prop('disabled', true);
        $("#self_addressInput").prop('disabled', true);

        $("#self_updateEmployeeBtn").css("display", "none")
        $("#self_changeEmployeeBtn").css("display", "block")
        $("#self_editEmployeeBtn").css("display", "block")
        
    })

    $("#self_editEmployeeBtn").click(function(){
        $("#self_username_row").css("display","block")


        $("#self_usernameInput").prop('disabled', false);
        $("#self_nameInput").prop('disabled', false);
        $("#self_emailInput").prop('disabled', false);
        $("#self_phoneNumberInput").prop('disabled', false);
        $("#self_addressInput").prop('disabled', false);

        $("#self_updateEmployeeBtn").css("display", "block")
        $("#self_editEmployeeBtn").css("display", "none")
        $("#self_changeEmployeeBtn").css("display", "none")
    })

    $("#self_updateEmployeeBtn").click(function(){
        let username = $("#self_usernameInput").val();
        let name = $("#self_nameInput").val();
        let email = $("#self_emailInput").val();
        let phone = $("#self_phoneNumberInput").val();
        let address = $("#self_addressInput").val();

        $.ajax({
            url: "/api/account",
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
                $(".alertSuccess").html("Cập nhật nhân viên thành công").show();

                $('.alertSuccess').show();
                $(".alertDanger").hide();
            },
            error: function (error) {
              $(".alertDanger").html("Không thể cập nhật thông tin nhân viên: " + error.responseText).show();
              console.log('Error message:', error.responseText);
            }
        });
    })
    
    $("#self_changePWDEmployeeBtn").click(function(){
        let password = $("#self_passwordInput").val();
        let new_password = $("#self_newPasswordInput").val();

        if(password == ""){
            $("#self_passwordHelper").text("Vui lòng nhập mật khẩu");
            $("#self_passwordHelper").removeAttr("hidden");
        }
        else if(new_password == ""){
            $("#self_newPasswordHelper").text("Mật khẩu mới không được phép rỗng");
            $("#self_newPasswordHelper").removeAttr("hidden");
        }
        else if(password === new_password){
            $(".alertDanger").html("Vui lòng nhập mật khẩu mới khác với mật khẩu cũ").show();
        }
        else{
            if(old_pass != null && old_pass == password){
                console.log(default_pass)
                if(new_password == default_pass){
                    $(".alertDanger").html("Vui lòng nhập mật khẩu mới khác với mật khẩu mặc định").show();
                }
                else{
                    $.ajax({
                        url: "/api/account",
                        type: "POST",
                        data: {
                            password: password,
                            new_password: new_password
                        },
                        contentType: 'application/x-www-form-urlencoded',
                        dataType: "json",
                        success: function (result) {
                            $(".alertSuccess").html("Đổi mật khẩu thành công").show();
            
                            $('.alertSuccess').show();
                            $(".alertDanger").hide();
            
                            location.href = "/logout";
            
                        },
                        error: function (error) {
                          $(".alertDanger").html("Không thể cập nhật thông tin nhân viên: " + error.responseText).show();
                          console.log('Error message:', error.responseText);
                        }
                    });
                }
                
            }
            else{
                console.log(old_pass)
                console.log(password)

                $(".alertDanger").html("Sai mật khẩu").show();
            }
            
        }
        
    })


    $("#exitModalBtn").click(function(){
        console.log(status)
        if(status == false){
            document.getElementById("logoutBtn").click()
        }
        else{
            location.reload();
        }
    })

    $("#cancelChangeBtn").click(function(){
        console.log(status)
        if(status == false){
            document.getElementById("logoutBtn").click()
        }
    })
    
})