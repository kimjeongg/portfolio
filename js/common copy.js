$(function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const $ham = $('header .dot_ham');
  $ham.hide();

  $(window).on('scroll', function () {
    const triggerTop = $('.values').offset().top;
    const scrollTop = $(window).scrollTop();

    if (scrollTop >= triggerTop - 100) {
      $ham.fadeIn(300);
    } else {
      $ham.fadeOut(300);
    }
  });

  $('.dot_ham').click(function () {
    $('header').toggleClass('on');
    $('.gnb_overlay').toggleClass('on');
  });

  $('.gnb_overlay').click(function () {
    $('header').removeClass('on');
    $(this).removeClass('on');
  });

  const wrapper = document.getElementById('wrapper');
  const sections = document.querySelectorAll('.project');
  const values = document.querySelector('.values');
  const container = document.querySelector('.container');
  const footer = document.querySelector('footer');

  let currentSection = 0;
  let isTransitioning = false;
  const commonBackground = "url('../img/coffeeBean_bg.jpg')";

  function updateScales(index) {
    sections.forEach((sec, i) => {
      sec.style.transform = i === index ? 'scale(1)' : 'scale(0.5)';
      sec.style.opacity = i === index ? '1' : '0.5';
      sec.style.backgroundImage = commonBackground;
      sec.style.backgroundSize = "cover";
      sec.style.backgroundPosition = "center";
      sec.style.backgroundRepeat = "no-repeat";
    });
  }

  function goToSection(index) {

    if (index < 0 || index >= sections.length || isTransitioning) return;
    isTransitioning = true;

    const targetX = -index * window.innerWidth;

    gsap.timeline({
      onComplete: () => {
        currentSection = index;
        isTransitioning = false;
      }
    })
      .to(sections[currentSection], {
        scale: 0.5,
        opacity: 0.5,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(wrapper, {
        x: targetX,
        duration: 0.8,
        ease: "power2.inOut"
      })
      .to(sections[index], {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });

    updateScales(index);
  }

  updateScales(0);

  let lastScrollTime = 0;
  window.addEventListener('wheel', (e) => {
    const now = Date.now();
    if (now - lastScrollTime < 100 || isTransitioning) return;
    lastScrollTime = now;

    const delta = e.deltaY;
    const valuesRect = values.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();


    // ✅ values → container 진입
    if (!document.body.classList.contains('in') && valuesRect.top < 10 && delta > 0) {
      container.scrollIntoView({ behavior: 'smooth' });
      document.body.classList.add('in');
      isTransitioning = true;
      setTimeout(() => isTransitioning = false, 1000);
      return;
    }




    // ✅ container 마지막 → footer 진입
    if (currentSection === sections.length - 1 && delta > 0) {
      document.body.classList.remove('in');
      footer.scrollIntoView({ behavior: 'smooth' });
      isTransitioning = true;
      setTimeout(() => isTransitioning = false, 1000);
      return;
    }

    // ✅ container 첫 섹션 → values 복귀
    if (
      currentSection === 0 &&
      delta < 0 &&
      document.body.classList.contains('in') // ⭐ 슬라이드 모드일 때만
    ) {
      document.body.classList.remove('in');
      values.scrollIntoView({ behavior: 'smooth' });
      isTransitioning = true;
      setTimeout(() => isTransitioning = false, 1000);
      return;
    }

    /* footer -> container */
    if (
      !document.body.classList.contains('in') &&
      footerRect.top < window.innerHeight &&
      footerRect.top > -100 &&
      delta < 0
    ) {
      console.log("🔥 footer → container 복귀 조건 발동");

      e.preventDefault();
      isTransitioning = true;

      // ✅ 먼저 스크롤만 이동시키고, body.in은 나중에 추가해야 함
      gsap.to(window, {
        scrollTo: container,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          document.body.classList.add('in'); // ← 애니메이션 끝난 뒤 슬라이드 모드 진입
          console.log("✅ goToSection 실행됨", sections.length - 1);
          goToSection(sections.length - 1);
          isTransitioning = false;
        }
      });

      return;
    }




    // ✅ footer → container 복귀 (위로 스크롤 시)
    /*     if (!document.body.classList.contains('in') && footerRect.top < window.innerHeight && delta < 0) {
          e.preventDefault();
          isTransitioning = true;
          document.body.classList.add('in');
          window.scrollTo({ top: container.offsetTop, behavior: 'auto' });
          setTimeout(() => {
            goToSection(0);
            isTransitioning = false;
          }, 100);
          return;
        } */


    // ✅ container 외부면 가로 슬라이드 무시
    if (!document.body.classList.contains('in')) return;
    // ✅ 가로 슬라이드
    e.preventDefault();
    if (delta > 0) {
      goToSection(currentSection + 1);
    } else {
      goToSection(currentSection - 1);
    }
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    if (e.key === 'ArrowRight') goToSection(currentSection + 1);
    if (e.key === 'ArrowLeft') goToSection(currentSection - 1);
  });

  setTimeout(() => {
    const el = document.querySelector('.loose');
    el?.classList.remove('loose');
    void el?.offsetWidth;
    el?.classList.add('loose');
  }, 1000);
});
