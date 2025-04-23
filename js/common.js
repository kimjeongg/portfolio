$(function () {

  function preventScroll(e) {
    e.preventDefault();
  }

  const $ham = $('header .dot_ham');
  $ham.hide(); // 처음엔 숨김

  $(window).on('scroll', function () {
    const triggerTop = $('.values').offset().top;
    const scrollTop = $(window).scrollTop();

    if (scrollTop >= triggerTop - 100) {
      $ham.fadeIn(300) // 나타남
    } else {
      $ham.fadeOut(300); // 사라짐
    }
  });

  // 열기

  $('.dot_ham').click(function () {
    $('header').toggleClass('on');
    $('.gnb_overlay').toggleClass('on');
  });
  $('.gnb_overlay').click(function () {
    $('header').removeClass('on');
    $(this).removeClass('on');
  });





  
  gsap.registerPlugin(ScrollTrigger);

  

  // 1. 배경을 pin으로 고정
  ScrollTrigger.create({
    trigger: ".scroll",
    start: "top top",
    end: "bottom bottom",
    pin: ".bg_pin",
    pinSpacing: false, // pinned 된 만큼 여백 안 만들기
  });

  


  // 2. 카드마다 배경 이미지 변경
  const bgPin = document.querySelector(".bg_pin");

  const bgImages = [
    "url('img/onTour_bg.jpg')",
    "url('img/coffeeBean_bg.jpg')",
    "url('img/dlatl.jpg')",
    "url('img/dlatl.jpg')",
    "url('img/dlatl.jpg')"
  ];
  const cards = gsap.utils.toArray(".scroll ul li");
  const ul = document.querySelector(".project_wrap");

  const total = cards.length;
  let currentIndex = -1;

  ScrollTrigger.create({
  trigger: ul,
  start: "top center+=100",
  end: () => `+=${cards.length * 650}`,
  scrub: 1,
  markers: false,
  onUpdate: self => {
    const index = Math.round(self.progress * (total - 1));
    if (index !== currentIndex) {
      currentIndex = index;

      // 모든 카드에서 on 제거
      cards.forEach(c => c.classList.remove("on"));
      // 현재 카드에만 on 부여
      cards[index].classList.add("on");

      // 배경 이미지 변경
      bgPin.style.backgroundImage = bgImages[index];
    }
  }
});

  setTimeout(() => {
    const el = document.querySelector('.loose');
    el.classList.remove('loose');
    void el.offsetWidth;
    el.classList.add('loose');
  }, 1000); // 1초 후 실행


  if (window.location.hash === '#scroll') {
    // splash 제거
    document.querySelector('.splash')?.remove();
  
    // 스크롤 해제
    window.removeEventListener("wheel", window.preventScroll, { passive: false });
    window.removeEventListener("touchmove", window.preventScroll, { passive: false });
  
    // body 초기화
    document.body.classList.remove('in');
    $('.loose').addClass('on');
  
    // 스크롤 위치 이동
    setTimeout(() => {
      const target = document.querySelector('#scroll') || document.querySelector('.values');
      target?.scrollIntoView({ behavior: 'auto' });
    }, 0);
  }
  




});