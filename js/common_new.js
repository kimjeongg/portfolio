$(function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const wrapper = document.getElementById('wrapper');
  const sections = document.querySelectorAll('.project');
  const values = document.querySelector('.values');
  const container = document.querySelector('.container');
  const footer = document.querySelector('footer');
  const splash = document.getElementById('splash');

  const $ham = $('header .dot_ham');
  $ham.hide();

  let currentSection = 0;
  let isTransitioning = false;


  // 페이지네이션 생성 및 제어
  const pagination = document.querySelector('.pagination');
 function createPagination() {
  pagination.innerHTML = '';
  sections.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (i === 0 ? ' active' : '');
    btn.textContent = (i - 1); // 숫자 대신 원하는 텍스트로 변경 가능
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSection(i);
    });
    pagination.appendChild(btn);
  });
}
function updatePagination(index) {
  document.querySelectorAll('.pagination .page-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}




  // 페이지네이션 보이기/숨기기
  function showPagination(show) {
    pagination.style.display = show ? 'flex' : 'none';
  }

  // 초기화
  createPagination();
  showPagination(false);

  // goToSection에서 페이지네이션 업데이트
  const originalGoToSection = goToSection;
  goToSection = function (index) {
    if (index < 0 || index >= sections.length) return;
    originalGoToSection(index);
    updatePagination(index);
  };

  // 가로 섹션 진입/이탈 시 페이지네이션 표시
  function handlePaginationVisibility() {
    if (document.body.classList.contains('in')) {
      showPagination(true);
    } else {
      showPagination(false);
    }
  }
  document.addEventListener('DOMContentLoaded', handlePaginationVisibility);
  window.addEventListener('scroll', handlePaginationVisibility);
  window.addEventListener('resize', handlePaginationVisibility);

  // body의 class 변경 시에도 감지
  const bodyObserver = new MutationObserver(handlePaginationVisibility);
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });




  // 👇 전역에서 디버깅 가능하도록 등록할 함수
  function goToSection(index) {
    if (index === currentSection || isTransitioning) return; // 중복 방지
    isTransitioning = true;
    console.log("✅ goToSection 실행됨 ⇒", index);
    const targetX = -index * window.innerWidth;

    gsap.timeline({
      onComplete: () => {
        currentSection = index;
        isTransitioning = false;
        console.log(`🎯 이동 완료 → 현재 섹션: ${index}`);
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
        ease: "power2.inOut",
        onStart: () => {
          console.log(`✅ goToSection 실행됨 → ${index}`);
        }
      })
      .to(sections[index], {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }, "<"); // ✅ 동시에 실행 (전환 자연스럽게)
  }


  // ⬇️ 콘솔에서도 사용 가능하게 전역 등록
  window.goToSection = goToSection;

  function updateScales(index) {
    sections.forEach((sec, i) => {
      sec.style.transform = i === index ? 'scale(1)' : 'scale(0.5)';
      sec.style.opacity = i === index ? '1' : '0.5';
    });
  }

  try {
    updateScales(0);
  } catch (e) {
    console.warn('updateScales 실패:', e);
  }
/*   const observer = new IntersectionObserver(
    ([entry]) => {
      const isSplashVisible = splash.getBoundingClientRect().bottom > 0;
      if (entry.isIntersecting && !isSplashVisible) {
        $ham.fadeIn(300);
      } else {
        $ham.fadeOut(300);
      }
    },
    { threshold: 0.2 }
  );
  observer.observe(values);

  const valuesRect = values.getBoundingClientRect();
  const splashRect = splash.getBoundingClientRect();
  const isSplashVisible = splashRect.bottom > 0;
  if (
    valuesRect.top < window.innerHeight &&
    valuesRect.bottom > 0 &&
    !isSplashVisible
  ) {
    $ham.show();
  } */
  function updateHamVisibility() {
    const footerRect = footer.getBoundingClientRect();
    // footer가 화면에 100px 이상 보이면 숨김
    if (footerRect.top < window.innerHeight - 100) {
      $ham.fadeOut(300);
    } else {
      $ham.fadeIn(300);
    }
  }

  window.addEventListener('scroll', updateHamVisibility);
  window.addEventListener('resize', updateHamVisibility);
  document.addEventListener('DOMContentLoaded', updateHamVisibility);

  $ham.show(); // 초기 표시

  $('.dot_ham').click(() => {
    $('header').toggleClass('on');
    $('.gnb_overlay').toggleClass('on');
  });

  $('.gnb_overlay').click(() => {
    $('header').removeClass('on');
    $('.gnb_overlay').removeClass('on');
  });

  let lastScrollTime = 0;
  window.addEventListener('wheel', (e) => {
    const now = Date.now();
    if (now - lastScrollTime < 100 || isTransitioning) return;
    lastScrollTime = now;

    const delta = e.deltaY;
    const valuesRect = values.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();

    // values → container 진입
    if (!document.body.classList.contains('in') && valuesRect.top < 10 && delta > 0) {
      container.scrollIntoView({ behavior: 'smooth' });
      document.body.classList.add('in');
      isTransitioning = true;
      setTimeout(() => isTransitioning = false, 1000);
      return;
    }

    // container 마지막 → footer 진입
    if (currentSection === sections.length - 1 && delta > 0) {
      document.body.classList.remove('in');
      footer.scrollIntoView({ behavior: 'smooth' });
      isTransitioning = true;
      setTimeout(() => isTransitioning = false, 1000);
      return;
    }

    // container 첫 섹션 → values 복귀
    if (currentSection === 0 && delta < 0 && document.body.classList.contains('in')) {
      document.body.classList.remove('in');
      values.scrollIntoView({ behavior: 'smooth' });
      isTransitioning = true;
      setTimeout(() => isTransitioning = false, 1000);
      return;
    }

    // ✅ footer → container 복귀
    // ✅ footer → container 복귀
    if (
      !document.body.classList.contains('in') &&
      footerRect.top < window.innerHeight &&
      footerRect.top > -300 &&
      delta < 0
    ) {
      console.log("🔥 footer → container 복귀 조건 발동");
      e.preventDefault();
      isTransitioning = true;

      // ✅ container 영역까지 부드럽게 스크롤 이동
      container.scrollIntoView({ behavior: 'smooth' });

      // ✅ 슬라이드 복귀는 약간 늦춰서 실행
      setTimeout(() => {
        document.body.classList.add('in');
        console.log("📌 복귀 시 이동할 슬라이드:", sections.length - 1);
        goToSection(sections.length - 1); // 보통 인덱스 2
        isTransitioning = false;
      }, 600); // 👈 스크롤 완료 예상 시간
      return;
    }


    // container 내에서만 슬라이드 작동
    if (document.body.classList.contains('in')) {
      e.preventDefault();
      if (delta > 0) {
        goToSection(currentSection + 1);
      } else {
        goToSection(currentSection - 1);
      }
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


  function updateContainerBgVisibility() {
    const wrapper = document.querySelector('#wrapper');
    const bg = document.querySelector('.container_bg');
    const rect = wrapper.getBoundingClientRect();

    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInView) {
      bg.style.opacity = '1';
      bg.style.zIndex = '10';
    } else {
      bg.style.opacity = '0';
      bg.style.zIndex = '-1';
    }
  }

  window.addEventListener('scroll', updateContainerBgVisibility);
  window.addEventListener('resize', updateContainerBgVisibility);
  document.addEventListener('DOMContentLoaded', updateContainerBgVisibility);





});
