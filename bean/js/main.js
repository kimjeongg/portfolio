// main.js - 기존 코드에 몇 줄만 추가
$(function () {
  AOS.init();

  /* main */
  $('header ul.gnb>li').hover(function () {
    $(this).find('ul.sub').stop().slideDown();
  }, function () {
    $(this).find('ul.sub').stop().slideUp();
  });

  /* 테블릿 서브바 - 스크롤 막기 추가 */
  $('.h_right button').click(function () {
    $('header').toggleClass('on');
    $(this).removeClass('on').siblings().addClass('on');

    // ✅ 추가: 스크롤 막기/허용
    if ($('header').hasClass('on')) {
      $('body').css('overflow', 'hidden');
    } else {
      $('body').css('overflow', 'auto');
    }
  });

  /* 모바일 서브바 */
  /* 모바일 서브바 - grid로 나타나게 */
  $('header .Tablet_nav ul.gnb>li>.tit button').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $this = $(this);
    const $submenu = $this.closest('li').find('ul.sub');
    const isOpen = $submenu.is(':visible');

    if (isOpen) {
      // ✅ 위로 슬라이드 (닫기)
      $this.removeClass('rotated');
      $submenu.slideUp(400);
      console.log('slideUp 실행');
    } else {
      // ✅ 아래로 슬라이드 (열기) + grid 활성화
      $this.addClass('rotated');
      $submenu.css('display', 'grid').hide().slideDown(400);
      console.log('slideDown 실행 - grid 활성화');
    }
  });

  // 리사이즈 이벤트 - 스크롤 허용 추가
  $(window).resize(function () {
    if ($(window).width() >= 1025) {
      // 데스크톱에서는 태블릿 메뉴 강제 닫기
      $('header').removeClass('on');
      $('header .Tablet_nav ul.sub').slideUp(0); // ✅ slideUp 사용
      $('header .Tablet_nav ul.gnb>li>.tit button').removeClass('rotated'); // ✅ 선택자 수정
      $('body').css('overflow', 'auto');
    }
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