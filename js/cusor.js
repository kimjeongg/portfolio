/* document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("main-cursor");

  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY + 30,
      duration: 0.1,
      ease: "power2.out"
    });
  });

  document.addEventListener("mousedown", () => {
    gsap.to(cursor, { scale: 0.9, duration: 0.1 });
  });

  document.addEventListener("mouseup", () => {
    gsap.to(cursor, { scale: 1, duration: 0.1 });
  });
});
 */


document.addEventListener("DOMContentLoaded", () => {
  // ✅ GSAP 로딩 확인
  if (typeof gsap === 'undefined') {
    console.error('GSAP이 로드되지 않았습니다.');
    return;
  }

  // ✅ 먼저 요소를 정의
  const cursor = document.getElementById("main-cursor");
  const splash = document.getElementById("splash");

  // ✅ 그 다음에 존재 확인
  if (!cursor || !splash) {
    console.error('커서 관련 DOM 요소를 찾을 수 없습니다.');
    return;
  }

  // ✅ 나머지 요소들
  const cursorText = cursor.querySelector(".cursor-text");
  const hoverTargets = document.querySelectorAll(
    'button, a, .cursor-button, [data-cursor="hover"]'
  );


  // 🟡 마우스 이동 시 커서 따라가기
  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY + 30, // 살짝 아래로
      duration: 0.1,
      ease: "power2.out"
    });
  });

  // 🔘 마우스 클릭 효과
  document.addEventListener("mousedown", () => {
    gsap.to(cursor, { scale: 0.9, duration: 0.1 });
  });
  document.addEventListener("mouseup", () => {
    gsap.to(cursor, { scale: 1, duration: 0.1 });
  });

  // 🔹 인트로 섹션 감지
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        cursor.classList.add("intro");
        cursorText.textContent = "CLICK!";
      } else {
        cursor.classList.remove("intro");
        cursorText.textContent = "";
      }
    },
    { threshold: 0.5 }
  );
  observer.observe(splash);

  // 🔸 버튼 hover 시
  hoverTargets.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
      // 인트로 아닌 경우에는 텍스트 숨김
      if (!cursor.classList.contains("intro")) {
        cursorText.textContent = "";
      }
    });
    btn.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
      // 인트로라면 다시 SCROLL 복구
      if (cursor.classList.contains("intro")) {
        cursorText.textContent = "CLICK!";
      }
    });
  });
});


