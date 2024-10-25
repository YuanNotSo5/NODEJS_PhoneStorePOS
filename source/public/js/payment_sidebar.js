function openPSidebar() {
    document.getElementById("p_sidebar").style.width = "500px";
    document.getElementById("main").style.marginRight = "500px";
    document.getElementById("main").style.paddingRight = "10px";
    document.getElementById("header").style.marginRight = "450px";

  }
  

  function closePSidebar() {
    document.getElementById("p_sidebar").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("main").style.paddingRight = "50px";
    document.getElementById("header").style.marginRight = "0px";
}