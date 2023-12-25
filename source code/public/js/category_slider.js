$(document).ready(function(){
   document.getElementById("next").addEventListener("click", function(){
      const widthItem = document.querySelector('.category').offsetWidth;
      document.getElementById('category-list').scrollLeft += widthItem;
   })
   
   document.getElementById('prev').addEventListener("click", function(){
      const widthItem = document.querySelector('.category').offsetWidth;
      document.getElementById('category-list').scrollLeft -= widthItem;
    })
})
   
