$(function () {
  AOS.init();
  /* main */
  $('header nav ul.gnb>li').hover(function () {
    $(this).find('ul.sub').stop().slideDown();
  }, function () {
    $(this).find('ul.sub').stop().slideUp();
  });


  var mainSlide = new Swiper(".main_visual", {
    autoplay: {
      delay: 3000,
    },
    loop: true,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});