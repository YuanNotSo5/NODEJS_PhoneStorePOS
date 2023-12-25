$(document).ready(function(){
   const nextButtons = document.querySelectorAll(".product-next");
   const prevButtons = document.querySelectorAll(".product-prev");

   nextButtons.forEach(function (nextButton) {
       nextButton.addEventListener("click", function () {
            const productListId = nextButton.dataset.id;
            const productList = document.getElementById(productListId);
            const widthItem = productList.querySelector('.product').offsetWidth;
            productList.scrollLeft += widthItem;
       });
   });

   prevButtons.forEach(function (nextButton) {
      nextButton.addEventListener("click", function () {
           const productListId = nextButton.dataset.id;
           const productList = document.getElementById(productListId);
           const widthItem = productList.querySelector('.product').offsetWidth;
           productList.scrollLeft -= widthItem;
      });
  });
});
