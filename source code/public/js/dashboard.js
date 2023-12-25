function openDashboard() {
  document.getElementById("dashboard").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.getElementById("main").style.paddingLeft = "0";

  document.getElementById("header").style.marginLeft = "200px";
  document.getElementById("avatar").style.marginLeft = "0";
}


function closeDashboard() {
  document.getElementById("dashboard").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.getElementById("main").style.paddingLeft = "70px";

  document.getElementById("header").style.marginLeft = "0px";
  document.getElementById("avatar").style.marginLeft = "0px";
}

$(document).ready(function(){

  $.ajax({
    url: "/getSession",
    type: "GET",
    dataType: "json",
    success: function (result) {     
      var user = result.user  
      if(user.role == 1){
        $("#employee_bar").css("display", "show")
        $(".report_income").css("display", "show")
        $(".product_action").css("display", "show")
        $(".customer_action").css("display", "show")

      }
      else{
        $("#employee_bar").css("display", "none")
        $(".report_income").css("display", "none")
        $(".product_action").css("display", "none")
        $(".customer_action").css("display", "none")
      }
    },
    error: function (error) {
      console.log(error)
    }
  });
})
