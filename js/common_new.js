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




  // ✅ 페이지네이션 가시성 업데이트 함수 수정
  function updatePaginationVisibility() {
    const isInWrapper = document.body.classList.contains('in');
    const footerRect = footer.getBoundingClientRect();
    const isFooterVisible = footerRect.top < window.innerHeight * 0.8; // ✅ 조건 완화

    console.log('📊 페이지네이션 상태:', {
      isInWrapper,
      isFooterVisible,
      isTransitioning,
      footerTop: footerRect.top,
      windowHeight: window.innerHeight
    });

    // ✅ 조건 수정: footer가 화면 하단 근처에 있을 때만 숨김
    if (isInWrapper && !isFooterVisible) {
      pagination.classList.add('visible');
      console.log('✅ 페이지네이션 표시');
    } else if (isFooterVisible) {
      pagination.classList.remove('visible');
      console.log('❌ 페이지네이션 숨김 (footer 보임)');
    }
    // ✅ isTransitioning 조건 제거로 더 안정적으로 표시
  }

  // ✅ 70번째 줄에 상태 확인 함수 추가
  function checkCurrentState() {
    console.log('🔍 현재 상태 확인:', {
      currentSection: currentSection,
      isInWrapper: document.body.classList.contains('in'),
      isPaginationVisible: pagination.classList.contains('visible'),
      isTransitioning: isTransitioning,
      footerTop: footer.getBoundingClientRect().top,
      windowHeight: window.innerHeight
    });
  }

  // 전역 등록
  window.checkCurrentState = checkCurrentState;


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
    const isOpening = !$('header').hasClass('on');

    $('header').toggleClass('on');
    $('.gnb_overlay').toggleClass('on');

    // ✅ GNB 열릴 때 스크롤 방지
    if (isOpening) {
      console.log('🔒 GNB 열림 - 스크롤 방지');
      document.body.style.overflow = 'hidden';
    } else {
      console.log('🔓 GNB 닫힘 - 스크롤 허용');
      document.body.style.overflow = '';
    }
  });

  // ✅ GNB 오버레이 클릭 시 닫기 (스크롤 허용)
  $('.gnb_overlay').click(() => {
    $('header').removeClass('on');
    $('.gnb_overlay').removeClass('on');

    // ✅ GNB 닫힐 때 스크롤 허용
    console.log('🔓 GNB 닫힘 - 스크롤 허용');
    document.body.style.overflow = '';
  });




  let lastScrollTime = 0;
  // common_new.js의 wheel 이벤트 리스너 수정
  window.addEventListener('wheel', (e) => {
    if ($('header').hasClass('on') || $('.gnb_overlay').hasClass('on')) {
      e.preventDefault();
      return;
    }
    console.log('📊 wheel 이벤트 - 페이지네이션 상태:', {
      isPaginationVisible: pagination.classList.contains('visible'),
      isInWrapper: document.body.classList.contains('in'),
      currentSection: currentSection
    });

    const now = Date.now();
    if (now - lastScrollTime < 100 || isTransitioning) return;
    lastScrollTime = now;

    const delta = e.deltaY;
    const valuesRect = values.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    const footerVisibleRatio = Math.max(
      0,
      Math.min(footerRect.bottom, window.innerHeight) - Math.max(footerRect.top, 0)
    ) / footerRect.height;
    const isFooterMostlyVisible = (footerRect.top < window.innerHeight && footerRect.bottom > 0);

    console.log('isFooterMostlyVisible:', isFooterMostlyVisible, 'currentSection:', currentSection, 'delta:', delta);

    // ✅ footer에서 위로 스크롤 시 프로젝트 복귀 (조건 수정)
    if (isFooterMostlyVisible && !document.body.classList.contains('in')) {
      if (delta > 0) {
        console.log('footer에서 아래로 스크롤: 아무 동작도 하지 않음');
        return;
      }
      if (delta < 0) {
        console.log('footer에서 위로 스크롤: 프로젝트 마지막 섹션으로 복귀');
        e.preventDefault();

        // ✅ 상태 초기화
        isTransitioning = true;
        currentSection = sections.length - 1;

        // ✅ 즉시 body 클래스 추가
        document.body.classList.add('in');

        // wrapper로 스크롤
        container.scrollIntoView({ behavior: 'smooth' });

        // ✅ 페이지네이션 즉시 업데이트
        updatePaginationVisibility();

        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            console.log('🎯 container 도착 - 마지막 섹션으로 이동');

            // ✅ 마지막 섹션으로 이동
            goToSection(sections.length - 1);
            setActivePageBtn(sections.length - 1);

            isTransitioning = false;
            updatePaginationVisibility();
            observer.disconnect();
          }
        }, { threshold: 0.5 }); // ✅ threshold 조정
        observer.observe(container);

        // ✅ 타임아웃 시간 단축
        setTimeout(() => {
          if (isTransitioning) {
            console.log('⏰ 타임아웃 - 마지막 섹션으로 이동');

            goToSection(sections.length - 1);
            setActivePageBtn(sections.length - 1);

            isTransitioning = false;
            updatePaginationVisibility();
          }
        }, 800); // ✅ 600ms → 800ms로 조정
        return;
      }
    }

    // ✅ values → 프로젝트 진입 (페이지네이션 즉시 표시)
    if (!document.body.classList.contains('in') && valuesRect.top < 10 && delta > 0) {
      isTransitioning = true;
      document.body.classList.add('in'); // ✅ 먼저 body 클래스 추가

      // ✅ 페이지네이션 즉시 표시
      pagination.classList.add('visible');

      container.scrollIntoView({ behavior: 'smooth' });
      setActivePageBtn(0);

      let called = false;
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !called) {
          called = true;
          isTransitioning = false;

          // ✅ 다시 한 번 페이지네이션 표시 확인
          pagination.classList.add('visible');
          updatePaginationVisibility();
          setActivePageBtn(0);
          observer.disconnect();
        }
      }, { threshold: 0.6 });
      observer.observe(container);

      setTimeout(() => {
        if (!called) {
          isTransitioning = false;

          // ✅ 타임아웃에서도 페이지네이션 표시 확인
          pagination.classList.add('visible');
          updatePaginationVisibility();
          setActivePageBtn(0);
        }
      }, 500);
      return;
    }

    // ✅ 프로젝트 마지막 → footer 진입 (currentSection 확실히 설정)
    if (currentSection === sections.length - 1 && delta > 0 && document.body.classList.contains('in')) {
      if (!isTransitioning) {
        isTransitioning = true;

        // ✅ 현재 섹션이 마지막 섹션인지 확실히 하기
        goToSection(sections.length - 1);
        setActivePageBtn(sections.length - 1);

        setTimeout(() => {
          // ✅ currentSection을 마지막 섹션으로 확실히 설정
          currentSection = sections.length - 1;

          document.body.classList.remove('in');
          console.log('footer 진입: currentSection =', currentSection);

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

    // ✅ 프로젝트 첫 섹션 → values 복귀 (조건 완화)
    if (
      currentSection === 0 &&
      delta < 0 &&
      document.body.classList.contains('in') &&
      !isFooterMostlyVisible // footer가 보이지 않을 때만
    ) {
      console.log('wrapper에서 values로 복귀 시도');
      e.preventDefault(); // 스크롤 막기
      isTransitioning = true;
      document.body.classList.remove('in');
      values.scrollIntoView({ behavior: 'smooth' });
      updatePaginationVisibility();

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log('values 도착 완료');
          isTransitioning = false;
          updatePaginationVisibility();
          observer.disconnect();
        }
      }, { threshold: 0.6 });
      observer.observe(values);

      setTimeout(() => {
        if (isTransitioning) {
          console.log('values 복귀 타임아웃');
          isTransitioning = false;
          updatePaginationVisibility();
        }
      }, 1000);
      return;
    }

    // ✅ 가로 스크롤(프로젝트 내에서 좌우 이동)
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
  /*   document.addEventListener("DOMContentLoaded", function () {
      var splash = document.getElementById("splash");
      // 1. 해시 방식
      if (location.hash === "#values") {
        console.log("해시로 스플래시 스킵");
        if (splash) splash.style.display = "none";
        var wrapper = document.getElementById("values");
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
    }); */
  /*   $('.gnb_overlay ul.gnb li a[href="#footer"]').on('click', function (e) {
      e.preventDefault();
      // 부드럽게 스크롤
      document.getElementById('footer').scrollIntoView({ behavior: 'smooth' });
  
      // footer 모션 트리거 (스크롤 완료 후 실행)
      setTimeout(() => {
        if (typeof window.triggerFooterMotion === 'function') window.triggerFooterMotion();
      }, 700); // 스크롤 애니메이션 시간에 맞춰 조정
    });
   */

  // ✅ GNB 클릭 이벤트 수정 (values 섹션 처리 추가)
  $('.gnb_overlay ul.gnb li a').on('click', function (e) {
    const href = $(this).attr('href');

    if (href && href.startsWith('#')) {
      e.preventDefault();

      const targetId = href.substring(1);

      // 네비게이션 메뉴 닫기
      $('header').removeClass('on');
      $('.gnb_overlay').removeClass('on');

      // ✅ GNB 닫힐 때 스크롤 허용
      document.body.style.overflow = '';

      console.log('🎯 GNB 클릭:', targetId);

      // ✅ values 섹션으로 이동 (대기 없이 바로 이동)
      if (targetId === 'values') {
        console.log('📍 values 섹션으로 바로 이동');

        // ✅ wrapper에서 나가기
        document.body.classList.remove('in');
        pagination.classList.remove('visible');
        updatePaginationVisibility();

        // ✅ 바로 values로 스크롤
        document.getElementById('values').scrollIntoView({ behavior: 'smooth' });

        return;
      }
      // ✅ footer 섹션으로 이동 (대기 없이 바로 이동)
      if (targetId === 'footer') {
        console.log('📍 footer 섹션으로 바로 이동');

        // ✅ currentSection을 마지막 섹션으로 설정 (복귀용)
        currentSection = sections.length - 1;

        // ✅ wrapper에서 나가기
        document.body.classList.remove('in');
        pagination.classList.remove('visible');
        updatePaginationVisibility();

        // ✅ 바로 footer로 스크롤
        document.getElementById('footer').scrollIntoView({ behavior: 'smooth' });

        // ✅ footer 모션 트리거
        setTimeout(() => {
          if (typeof window.triggerFooterMotion === 'function') {
            window.triggerFooterMotion();
          }
        }, 700);

        return;
      }

      // ✅ 프로젝트 섹션으로 바로 이동
      const sectionNames = ['bloop', 'bean', 'bobissue', 'ontour', 'busan'];
      const sectionIndex = sectionNames.indexOf(targetId);

      if (sectionIndex !== -1) {
        console.log(`✅ GNB 클릭: ${targetId} (인덱스: ${sectionIndex})`);

        // footer에서 클릭했는지 확인
        const footerRect = footer.getBoundingClientRect();
        const isInFooter = footerRect.top < window.innerHeight && footerRect.bottom > 0;

        // ✅ 해결: 화면도 올바르게 변경됨
        if (isInFooter) {
          console.log('🔄 footer에서 프로젝트 섹션으로 바로 이동');

          isTransitioning = true;
          currentSection = sectionIndex;
          document.body.classList.add('in');
          pagination.classList.add('visible');
          container.scrollIntoView({ behavior: 'smooth' });

          // ✅ 스크롤 완료 후 바로 섹션 이동
          setTimeout(() => {
            console.log('🎯 container 도착 완료, 섹션 바로 이동');

            // ✅ 강제로 wrapper transform 설정
            const targetX = -sectionIndex * window.innerWidth;
            wrapper.style.transform = `translateX(${targetX}px)`;

            // ✅ 섹션 스케일 설정
            sections.forEach((section, index) => {
              if (index === sectionIndex) {
                section.style.transform = 'scale(1)';
                section.style.opacity = '1';
              } else {
                section.style.transform = 'scale(0.5)';
                section.style.opacity = '0.5';
              }
            });

            setActivePageBtn(sectionIndex);
            pagination.classList.add('visible');
            updatePaginationVisibility();
            isTransitioning = false;

            console.log('✅ footer → 프로젝트 이동 완료 - 화면 표시:', sectionIndex);
          }, 600); // ✅ 600ms로 단축
        } else if (!document.body.classList.contains('in')) {
          // wrapper 밖에 있는 경우 (values 섹션 등)
          console.log('📍 wrapper 밖에서 프로젝트 섹션으로 바로 이동');

          // ✅ 즉시 body 클래스 추가 및 페이지네이션 표시
          document.body.classList.add('in');
          pagination.classList.add('visible');

          container.scrollIntoView({ behavior: 'smooth' });

          // ✅ 스크롤 완료 후 바로 해당 섹션으로 이동
          setTimeout(() => {
            goToSection(sectionIndex);
            setActivePageBtn(sectionIndex);

            // ✅ 페이지네이션 표시 확인
            pagination.classList.add('visible');
            updatePaginationVisibility();

            console.log('✅ GNB 프로젝트 바로 이동 완료');
          }, 800);

        } else {
          // 이미 wrapper 안에 있는 경우
          console.log('📍 wrapper 안에서 섹션 바로 이동');

          // ✅ 바로 해당 섹션으로 이동
          goToSection(sectionIndex);

          // ✅ 페이지네이션 표시 확인
          pagination.classList.add('visible');
          updatePaginationVisibility();
        }
      }
    }
  });
  // 실시간 상태 모니터링
  function monitorFooterState() {
    const interval = setInterval(() => {
      const footerRect = footer.getBoundingClientRect();
      const isInWrapper = document.body.classList.contains('in');
      const isPaginationVisible = pagination.classList.contains('visible');

      console.log('🔍 실시간 상태:', {
        currentSection,
        isInWrapper,
        isPaginationVisible,
        footerTop: Math.round(footerRect.top),
        windowHeight: window.innerHeight,
        isTransitioning
      });
    }, 1000);

    // 10초 후 자동 중단
    setTimeout(() => clearInterval(interval), 10000);
  }

  // 전역 등록
  window.monitorFooterState = monitorFooterState;
});

