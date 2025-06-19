$(function () {
  AOS.init();
  /* main */
  $('header nav ul.gnb>li').hover(function () {
    $(this).find('ul.sub').stop().slideDown();
  }, function () {
    $(this).find('ul.sub').stop().slideUp();
  });

  let mainSlide = new Swiper(".main_visual", {
    autoplay: {
      delay: 2500,
    },
    effect: 'fade',
    loop: true,

    pagination: {
      el: ".main_visual .swiper-pagination",
      dynamicBullets: true,
    },
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



  /* heart */
/*   $('.product ul.card li a i').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('active');
  });
 */





  
  /* menu */
  let right_con_txt = {
    con1: ['캐러멜 아이스 블렌디드', '브라운 마끼아토네', '카페 라떼', '제주 첫물 말차 라떼', '아이스 헤이즐넛 라떼'],
    con2: ['말차초코 갸또', '크랜베리 크림치즈 스콘', '스트로베리 초코우유 케익', '딸기 피스타치오 티라미수', '그릴드 비프치즈 샌드위치'],
    con3: ['베이컨 파 크림치즈 베이글', 'BLT 치킨 샌드위치', '콘치즈 소시지 페스츄리', '스윗포테이토 피자그라탕', '함박스테이크&파스타']
  };

  let swipers = {}; // Swiper 인스턴스 저장

  function updateSlidePosition(swiper, selector, conName) {
    let activeIndex = swiper.realIndex;
    document.querySelector(`${selector} .swiper-pagination-wrap span`).innerText = right_con_txt[conName][activeIndex];
    /* 
        let activeSlide = swiper.slides[swiper.activeIndex];
        if (activeSlide) {
          let slideOffset = activeSlide.offsetLeft;
          // console.log(`[${conName}] 현재 이동 거리:`, slideOffset);
    
          if (swiper.touches?.diff > 0) {
            // console.log(`[${conName}] 정방향 이동: 추가 보정 필요`);
            swiper.setTransition(500);
            slideOffset = -slideOffset - 50;
            swiper.setTranslate(slideOffset, 0);
          } else {
            console.log(`[${conName}] 역방향 이동: 기본 이동`);
            swiper.setTranslate(-slideOffset, 0);
          }
        } */
  }

  function initSwiper(selector, conName) {
    if (swipers[conName]) {
      swipers[conName].destroy(true, true);
    }

    swipers[conName] = new Swiper(`${selector} .swiper`, {
      slidesPerView: 'auto',
      centeredSlides: false,
      loop: true,
      loopedSlides: 5,
      speed: 700,
      spaceBetween: 30,
      navigation: {
        nextEl: `${selector} .swiper-button-next`,
        prevEl: `${selector} .swiper-button-prev`,
      },
      on: {
        slideChange: function () { updateSlidePosition(this, selector, conName); },
        transitionEnd: function () { updateSlidePosition(this, selector, conName); },
      }
    });
    const prevBtn = document.querySelector('.swiper-button-prev');
    prevBtn.addEventListener('click', function (e) {
      e.preventDefault();
    });
    return swipers[conName];
  }

  // 초기 Swiper 설정
  let right_con1 = initSwiper(".right_con1", "con1");
  let right_con2 = initSwiper(".right_con2", "con2");
  let right_con3 = initSwiper(".right_con3", "con3");

  $('.menu .left .sub li').click(function () {
    let i = $(this).index();
    let swiperClass = `.right_con${i + 1}`;
    let swiperKey = `con${i + 1}`;

    $('.menu .left .sub li, .menu .right ul.right_con > li').removeClass('on');
    $(this).addClass('on');
    $('.menu .right ul.right_con > li').eq(i).addClass('on');

    // ✅ Swiper를 리셋 (첫 번째 슬라이드로 이동 & 업데이트)
    if (swipers[swiperKey]) {
      swipers[swiperKey].slideToLoop(0, 700); // 자연스럽게 첫 슬라이드로 이동
      swipers[swiperKey].update();
    } else {
      // Swiper가 없으면 새로 초기화
      initSwiper(swiperClass, swiperKey);
    }
  });





  /* banner */
  let bannerSlide = new Swiper(".banner", {
    autoplay: {
      delay: 4000,
    },
    effect: 'fade',
    loop: true,
    on: {
      slideChangeTransitionStart: function () {
        AOS.refresh(); // AOS 애니메이션 다시 초기화
      }
    }

  });
});