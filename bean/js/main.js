$(function () {
  AOS.init();

  /* main */
  $('header .nav ul.gnb>li').hover(function () {
    $(this).find('ul.sub').stop().slideDown();
  }, function () {
    $(this).find('ul.sub').stop().slideUp();
  });

  /* 테블릿 서브바 - 스크롤 막기 추가 */
  $('.h_right button').click(function () {
    $('header').toggleClass('on');
    $(this).removeClass('on').siblings().addClass('on');

    if ($('header').hasClass('on')) {
      $('body').css('overflow', 'hidden');
    } else {
      $('body').css('overflow', 'auto');
    }
  });

  /* 모바일 서브바 */
  $('header .Tablet_nav ul.gnb>li>.tit button').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $this = $(this);
    const $submenu = $this.closest('li').find('ul.sub');
    const isOpen = $submenu.is(':visible');

    if (isOpen) {
      $this.removeClass('rotated');
      $submenu.slideUp(400);
      console.log('slideUp 실행');
    } else {
      $this.addClass('rotated');
      $submenu.css('display', 'grid').hide().slideDown(400);
      console.log('slideDown 실행 - grid 활성화');
    }
  });

  // 리사이즈 이벤트 - 스크롤 허용 추가
  $(window).resize(function () {
    if ($(window).width() >= 1025) {
      $('header').removeClass('on');
      $('header .Tablet_nav ul.sub').slideUp(0);
      $('header .Tablet_nav ul.gnb>li>.tit button').removeClass('rotated');
      $('body').css('overflow', 'auto');
    }
  });

  // ✅ 메인 슬라이드 - 반응형 설정
  var mainSlide = new Swiper(".main_visual", {
    autoplay: {
      delay: 3000,
    },
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // ✅ 페이지네이션 추가
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      type: "bullets",
    },
    // ✅ 반응형 설정
    breakpoints: {
      768: {
        // 768px 이상에서는 네비게이션 버튼 표시
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      767: {
        // 767px 이하에서는 네비게이션 버튼 숨김
        navigation: false,
      }
    }
  });
});