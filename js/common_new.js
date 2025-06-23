$(function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const wrapper = document.getElementById('wrapper');
  const sections = document.querySelectorAll('.project');
  const values = document.querySelector('.values');
  const container = document.querySelector('.container');
  const footer = document.getElementById('footer');
  const splash = document.getElementById('splash');



  const $ham = $('header .dot_ham');
  $ham.hide();

  let currentSection = 0;
  let isTransitioning = false;


  // 페이지네이션 생성 및 제어
  const pagination = document.querySelector('.pagination');

  const pageBtns = document.querySelectorAll('.page-btn');
  let lockedBtn = null;

  /*  */
  function animateCircle(circle, to, duration) {
    const from = parseFloat(circle.style.strokeDashoffset);
    const start = performance.now();
    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeInOutQuad
      const eased = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
      circle.style.strokeDashoffset = from + (to - from) * eased;
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        circle.style.strokeDashoffset = to;
      }
    }
    requestAnimationFrame(animate);
  }




  function updatePaginationVisibility() {
    if (document.body.classList.contains('in')) {
      pagination.classList.add('visible');
    } else {
      pagination.classList.remove('visible');
    }
  }






  pageBtns.forEach((btn, idx) => {
    const circle = btn.querySelector('.circle-border circle');
    const num = btn.querySelector('.page-num');
    const color = btn.dataset.color || "#ffcc00";
    if (!circle) return;
    const length = 2 * Math.PI * 18;
    circle.style.stroke = color;

    btn.addEventListener('mouseenter', () => {
      animateCircle(circle, 0, 400);
    });

    btn.addEventListener('mouseleave', () => {
      if (btn === lockedBtn || btn.classList.contains('active')) return;
      animateCircle(circle, length, 400);
      btn.classList.remove('glow');
      btn.querySelector('.circle-border').style.filter = 'none';
      /* num.style.color = ''; */
    });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lockedBtn = btn;

      num.style.animation = 'none';
      void num.offsetWidth;
      num.style.animation = '';
      num.style.animation = 'scaleClick 0.25s';

      btn.classList.add('glow');
      animateCircle(circle, 0, 400);

      // 글로우 효과 동적 적용
      btn.querySelector('.circle-border').style.filter =
        `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 16px ${color}) drop-shadow(0 0 32px ${color})`;
      /* num.style.color = color; */

      goToSection(idx);
    });
  });

  // <-- Add this line to close the initial $(function () { ... })

  function setActivePageBtn(newIdx) {
    const length = 2 * Math.PI * 18;
    pageBtns.forEach((b, idx) => {
      const num = b.querySelector('.page-num');
      const circle = b.querySelector('.circle-border circle');
      const color = b.dataset.color || "#ffcc00";
      b.classList.toggle('active', idx === newIdx);

      if (lockedBtn === b) lockedBtn = null;

      if (idx === newIdx) {
        num.style.animation = 'none';
        void num.offsetWidth;
        num.style.animation = '';
        num.style.animation = 'jump 0.7s forwards';
        animateCircle(circle, 0, 400);
        b.classList.add('glow');
        b.querySelector('.circle-border').style.filter =
          `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 16px ${color}) drop-shadow(0 0 32px ${color})`;
        /* num.style.color = color; */
      } else {
        num.style.animation = 'none';
        void num.offsetWidth;
        num.style.animation = '';
        num.style.animation = 'jumpDown 0.4s';
        animateCircle(circle, length, 400);
        b.classList.remove('glow');
        b.querySelector('.circle-border').style.filter = 'none';
        /*   num.style.color = ''; */
      }
    });
  }

  setActivePageBtn(0);


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
        setActivePageBtn(index);  // ← 이 줄 추가!
        console.log(`🎯 이동 완료 → 현재 섹션: ${index}`);
      }
    })
      .to(sections[currentSection], {
        scale: 0.5,
        opacity: 0.5,
        duration: 0.6,
        ease: "power2.out"
      })
      .to(wrapper, {
        x: targetX,
        duration: .8,
        ease: "power2.inOut",
        onStart: () => {
          console.log(`✅ goToSection 실행됨 → ${index}`);
        }
      })
      .to(sections[index], {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out"
      }, "<"); // ✅ 동시에 실행 (전환 자연스럽게)

  }




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
    const footerRect = footer.getBoundingClientRect(); // ← 이 줄을 가장 먼저!
    const footerVisibleRatio = Math.max(
      0,
      Math.min(footerRect.bottom, window.innerHeight) - Math.max(footerRect.top, 0)
    ) / footerRect.height;
    const isFooterMostlyVisible = (footerRect.top < window.innerHeight && footerRect.bottom > 0);
    console.log('isFooterMostlyVisible:', isFooterMostlyVisible, 'currentSection:', currentSection, 'delta:', delta);
    // ★★★ 푸터 → 프로젝트 복귀 (위로 스크롤만 허용, 아래로는 아무 동작도 하지 않음)
    // ★★★ 푸터 → 프로젝트 복귀 (위로 스크롤만 허용, 아래로는 아무 동작도 하지 않음)
    if (
      !document.body.classList.contains('in') &&
      isFooterMostlyVisible
    ) {
      if (e.deltaY > 0) {
        console.log('footer에서 아래로 스크롤: 아무 동작도 하지 않음');
        return;
      }
      if (e.deltaY < 0) {
        console.log('footer에서 위로 스크롤: 프로젝트로 복귀');
        e.preventDefault();
        isTransitioning = true;
        container.scrollIntoView({ behavior: 'smooth' });

        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            document.body.classList.add('in');
            goToSection(sections.length - 1);
            setActivePageBtn(sections.length - 1);
            isTransitioning = false;
            updatePaginationVisibility();
            observer.disconnect();
          }
        }, { threshold: 0.6 });
        observer.observe(container);

        setTimeout(() => {
          if (isTransitioning) {
            document.body.classList.add('in');
            goToSection(sections.length - 1);
            setActivePageBtn(sections.length - 1);
            isTransitioning = false;
            updatePaginationVisibility();
          }
        }, 600);
        return;
      }
    }
    console.log('isFooterMostlyVisible:', isFooterMostlyVisible, 'currentSection:', currentSection, 'delta:', delta);
    // values → 프로젝트 진입
    if (!document.body.classList.contains('in') && valuesRect.top < 10 && delta > 0) {
      isTransitioning = true;
      container.scrollIntoView({ behavior: 'smooth' });
      document.body.classList.add('in');
      updatePaginationVisibility();
      setActivePageBtn(0);

      let called = false;
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !called) {
          called = true;
          isTransitioning = false;
          updatePaginationVisibility();
          setActivePageBtn(0);
          observer.disconnect();
        }
      }, { threshold: 0.6 });
      observer.observe(container);

      setTimeout(() => {
        if (!called) {
          isTransitioning = false;
          updatePaginationVisibility();
          setActivePageBtn(0);
        }
      }, 500);
      return;
    }

    // 프로젝트 마지막 → footer 진입
    if (currentSection === sections.length - 1 && delta > 0) {
      if (!isTransitioning) {
        isTransitioning = true;
        goToSection(currentSection);
        setTimeout(() => {
          document.body.classList.remove('in');
          console.log('footer 진입: body.classList', document.body.classList);
          footer.scrollIntoView({ behavior: 'smooth' });
          updatePaginationVisibility();

          setTimeout(() => {
            if (typeof window.triggerFooterMotion === 'function') window.triggerFooterMotion();
          }, 600);

          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              isTransitioning = false;
              updatePaginationVisibility();
              observer.disconnect();
            }
          }, { threshold: 0.2 });
          observer.observe(footer);

          setTimeout(() => {
            if (isTransitioning) {
              isTransitioning = false;
              updatePaginationVisibility();
            }
          }, 1000);
        }, 800);
      }
      return;
    }

    // 프로젝트 첫 섹션 → values 복귀
    if (
      currentSection === 0 &&
      delta < 0 &&
      document.body.classList.contains('in') &&
      values.getBoundingClientRect().top > -10 && values.getBoundingClientRect().top < 10
    ) {
      isTransitioning = true;
      document.body.classList.remove('in');
      values.scrollIntoView({ behavior: 'smooth' });
      updatePaginationVisibility();

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          isTransitioning = false;
          updatePaginationVisibility();
          observer.disconnect();
        }
      }, { threshold: 0.6 });
      observer.observe(values);

      setTimeout(() => {
        if (isTransitioning) {
          isTransitioning = false;
          updatePaginationVisibility();
        }
      }, 1000);
      return;
    }


    // ★★★ 가로 스크롤(프로젝트 내에서 좌우 이동)
    if (
      document.body.classList.contains('in') &&
      !isFooterMostlyVisible
    ) {
      // 마지막 섹션에서 아래로 스크롤 + 푸터가 이미 보이면 아무 동작도 하지 않음
      if (currentSection >= sections.length - 1 && delta > 0) return;

      e.preventDefault();
      if (isTransitioning) return;
      if (delta > 0) {
        if (currentSection >= sections.length - 1) return;
        goToSection(currentSection + 1);
      } else {
        if (currentSection <= 0) return;
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



  /* document.addEventListener("DOMContentLoaded", function () {
    if (location.hash === "#wrapper") {
      // splash가 있다면 숨기기
      var splash = document.getElementById("splash");
      if (splash) splash.style.display = "none";
      // wrapper로 바로 이동
      var wrapper = document.getElementById("wrapper");
      if (wrapper) wrapper.scrollIntoView({ behavior: "auto" });
    }
  }); */
  document.addEventListener("DOMContentLoaded", function () {
    var splash = document.getElementById("splash");
    // 1. 해시 방식
    if (location.hash === "#wrapper") {
      console.log("해시로 스플래시 스킵");
      if (splash) splash.style.display = "none";
      var wrapper = document.getElementById("wrapper");
      if (wrapper) wrapper.scrollIntoView({ behavior: "auto" });

      // ★ body에 'in' 클래스 추가 (페이지네이션 바로 보이게)
      document.body.classList.add('in');
      updatePaginationVisibility();

      // ★ 첫 번째 프로젝트 섹션 활성화
      setTimeout(function () {
        if (typeof goToSection === "function") goToSection(0);
        if (typeof setActivePageBtn === "function") setActivePageBtn(0);
      }, 100);
    }
  });
  $('.gnb_overlay ul.gnb li a[href="#footer"]').on('click', function (e) {
    e.preventDefault();
    // 부드럽게 스크롤
    document.getElementById('footer').scrollIntoView({ behavior: 'smooth' });

    // footer 모션 트리거 (스크롤 완료 후 실행)
    setTimeout(() => {
      if (typeof window.triggerFooterMotion === 'function') window.triggerFooterMotion();
    }, 700); // 스크롤 애니메이션 시간에 맞춰 조정
  });
  document.querySelectorAll('.project#bloop .not-ready').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      alert('6월23일에 오픈 예정입니다! \n\n많은 기대 부탁드립니다 :)');
    });
  });

});

