$(function () {
  AOS.init();
  /* main */
  $('header nav ul.gnb>li').hover(function () {
    $(this).find('ul.sub').stop().slideDown();
  }, function () {
    $(this).find('ul.sub').stop().slideUp();
  });
  /* 테블릿 서브바  */
  $('.h_right button').click(function () {
    $('header').toggleClass('on');
    $(this).removeClass('on').siblings().addClass('on');
  });
  /* 모바일 서브바 */
  $(' header .Tablet_nav ul.gnb>li>a button').on('click', function () {
    $(this).toggleClass('rotated');
    $(this).siblings('span').toggleClass('active');
    $(this).parent('a').siblings('ul.sub').slideToggle('slow');
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