document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById('canvas');
  const view = document.getElementById('view');
  let isDragging = false, startX, startY, initialX = 0, initialY = 0;

  // 🎯 드래그 이동
  view.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - initialX;
    startY = e.pageY - initialY;
    canvas.style.cursor = 'grabbing';
  });

  view.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
  });

  view.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    initialX = e.pageX - startX;
    initialY = e.pageY - startY;
    canvas.style.transform = `translate(${initialX}px, ${initialY}px)`;
  });

  // 🎯 Path 따라 확대 이동
  function zoomFromMain(targetId, pathId) {
    // ✅ 버튼 클릭 순간 모든 section active 제거
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

    const main = document.getElementById('main');
    const target = document.getElementById(targetId);
    const path = document.querySelector(pathId);
    const length = path.getTotalLength();

    // 2) main 위치 기준으로 먼저 이동
    const mainRect = main.getBoundingClientRect();
    const mainCenterX = mainRect.left + mainRect.width / 2;
    const mainCenterY = mainRect.top + mainRect.height / 2;
    const mainOffsetX = window.innerWidth / 2 - mainCenterX;
    const mainOffsetY = window.innerHeight / 2 - mainCenterY;

    initialX += mainOffsetX;
    initialY += mainOffsetY;

    // ✅ 메인으로 순간 이동 (딜레이 없이)
    gsap.set(canvas, {
      x: initialX,
      y: initialY
    });
    canvas.style.transform = `translate(${initialX}px, ${initialY}px)`;

    // 3) path 애니메이션 준비
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    // 4) path를 따라서 이동
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      onComplete: () => {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const offsetX = window.innerWidth / 2 - centerX;
        const offsetY = window.innerHeight / 2 - centerY;

        initialX += offsetX;
        initialY += offsetY;

        gsap.to(canvas, {
          x: initialX,
          y: initialY,
          duration: 1,
          ease: "power2.out",
          onUpdate: () => {
            canvas.style.transform = `translate(${initialX}px, ${initialY}px)`;
          },
          onComplete: () => {
            target.classList.add('active'); // 최종 target만 active!
          }
        });
      }
    });
  }

  // 🎯 특정 섹션으로 확대 이동
  function zoomTo(sectionId) {
    document.querySelectorAll('.section').forEach(s => {
      s.classList.remove('active');
    });

    const section = document.getElementById(sectionId);
    section.classList.add('active');

    const rect = section.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = window.innerWidth / 2 - centerX;
    const offsetY = window.innerHeight / 2 - centerY;

    initialX += offsetX;
    initialY += offsetY;

    gsap.to(canvas, {
      x: initialX,
      y: initialY,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        canvas.style.transform = `translate(${initialX}px, ${initialY}px)`;
      },
      onComplete: () => {
        section.classList.add('active'); // 이동 끝나고 딱 추가
      }
    });
  }

  // 🎯 전체 보기 - 모두 축소 상태로 리셋
  function resetView() {
    document.querySelectorAll('.section').forEach(s => {
      s.classList.remove('active');
    });

    initialX = -1800;
    initialY = -1500;

    gsap.to(canvas, {
      x: initialX,
      y: initialY,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        canvas.style.transform = `translate(${initialX}px, ${initialY}px)`;
      }
    });
  }

  //메인
  const main = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const target = mutation.target;
  
      if (target.id === "design_skill") {
        const text = target.querySelector(".txt");
        const icons = target.querySelectorAll("li");
  
        if (target.classList.contains("active")) {
          // 텍스트에 glow 효과 추가
          text.classList.add("glow");
  
          // li 아이콘들이 뒤에서 나오면서 바운스
          icons.forEach((icon, i) => {
            // 아이템들이 나타날 때 바운스 효과
            gsap.fromTo(icon,
              { 
                opacity: 0,  // 처음에는 투명
                y: -100,       // 위에서 떨어지도록 설정
                rotation: -5    // 살짝 회전
              },
              {
                opacity: 1,  // 완전 가시화
                y: 0,          // 원래 위치로 떨어짐
                rotation: 0,    // 회전은 없애기
                duration: 0.6,  // 바운스 효과 길이
                ease: "bounce.out",  // 바운스 효과
                delay: 0.5 + i * 0.2 // 순차적으로 등장
              }
            );
          });
        } else {
          // 비활성화 시 원복
          text.classList.remove("glow");
          icons.forEach((icon) => {
            gsap.set(icon, { opacity: 0, y: -100, rotation: -5 });
          });
        }
      }
  
    });
  });


  /* 
    const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const target = mutation.target;

      if (target.id === "design_skill") {
        const text = target.querySelector(".txt");
        const icons = target.querySelectorAll("li");

        if (target.classList.contains("active")) {
          // ✅ 활성화 됐을 때
          text.classList.add("glow");

          setTimeout(() => {
            icons.forEach((icon, i) => {
              setTimeout(() => icon.classList.add("show"), i * 150);
            });
          }, 500);
        } else {
          // ❌ 비활성화 됐을 때
          text.classList.remove("glow");
          icons.forEach((icon) => icon.classList.remove("show"));
        }
      }
    });
  });

  observer.observe(document.getElementById("design_skill"), {
    attributes: true,
    attributeFilter: ["class"],
  });
 */
  
  // MutationObserver로 active 클래스 변경을 감지하여 애니메이션 실행
  main.observe(document.getElementById("design_skill"), {
    attributes: true,
    attributeFilter: ["class"], // "active" 클래스 변화만 감지
  });
  


  // 스킬 

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const target = mutation.target;

      if (target.id === "design_skill") {
        const text = target.querySelector(".txt");
        const icons = target.querySelectorAll("li");
      
        if (target.classList.contains("active")) {
          // 텍스트 glow 효과는 그대로
          text.classList.add("glow");
      
          // li 요소 바운스 효과 (위치 유지)
          icons.forEach((icon, i) => {
            gsap.fromTo(icon,
              { scale: 0, autoAlpha: 0 },
              {
                scale: 1,
                autoAlpha: 1,
                duration: 0.6,
                ease: "bounce.out",
                delay: 0.2 + i * 0.1
              }
            );
          });
      
        } else {
          // 비활성화 시 원상복귀
          text.classList.remove("glow");
          icons.forEach((icon) => {
            gsap.set(icon, { scale: 0, autoAlpha: 0 });
          });
        }
      }
      
    });
  });

  observer.observe(document.getElementById("design_skill"), {
    attributes: true,
    attributeFilter: ["class"],
  });

  //경험

  const experience = document.getElementById("experience");
  const experienceText = experience.querySelector(".txt");

  const experienceObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const isActive = experience.classList.contains("active");

      if (isActive) {
        experienceText.classList.add("glow");
      } else {
        experienceText.classList.remove("glow");
      }
    });
  });

  experienceObserver.observe(experience, {
    attributes: true,
    attributeFilter: ["class"],
  });
  //캐릭터


  const character = document.getElementById("character");
  const characterText = character.querySelector(".txt");

  const characterObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const isActive = character.classList.contains("active");

      if (isActive) {
        characterText.classList.add("glow");
      } else {
        characterText.classList.remove("glow");
      }
    });
  });

  characterObserver.observe(character, {
    attributes: true,
    attributeFilter: ["class"],
  });


  //취미 

  const hobby = document.getElementById("hobby");
  const hobbyText = hobby.querySelector(".txt");

  const hobbyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const isActive = hobby.classList.contains("active");

      if (isActive) {
        hobbyText.classList.add("glow");

        const tl = gsap.timeline();

        // 🎯 1. go_trip 제목 (.go_trip .txt)
        tl.fromTo("#hobby .go_trip .txt",
          { autoAlpha: 0, y: -200, rotation: -5 },
          {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            duration: 0.9,
            ease: "bounce.out"
          }
        )

          // 🎯 2. go_trip 이미지들
          .fromTo("#hobby .go_trip img",
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "power2.out",
              onComplete: () => {
                const target = document.querySelector('#hobby .go_trip .two');

                function sharpSquareStep(el) {
                  const tl = gsap.timeline({ repeat: -1 });

                  tl.to(el, {
                    x: -3,
                    y: -3,
                    duration: 0.01,  // 순간이동처럼 딱
                    delay: 0.3       // 멈췄다 이동
                  })
                    .to(el, {
                      x: 3,
                      y: -3,
                      duration: 0.01,
                      delay: 0.3
                    })
                    .to(el, {
                      x: -2,
                      y: 2,
                      duration: 0.01,
                      delay: 0.2
                    })
                    .to(el, {
                      x: 3,
                      y: 3,
                      duration: 0.01,
                      delay: 0.3
                    })
                    .to(el, {
                      x: 0,
                      y: 0,
                      duration: 0.01,
                      delay: 0.2
                    });
                }
                function crownJitter(el) {
                  const tl = gsap.timeline({ repeat: -1 });

                  tl.to(el, { y: -5, rotation: -5, duration: 0.01, delay: 0.3 })
                    .to(el, { y: -3, rotation: 3, duration: 0.01, delay: 0.3 })
                    .to(el, { y: -6, rotation: -4, duration: 0.01, delay: 0.3 })
                    .to(el, { y: 0, rotation: 0, duration: 0.01, delay: 0.3 });
                }

                const crown = document.querySelector('#hobby .go_trip .na');
                crownJitter(crown);

                sharpSquareStep(target);
              }

            }

          )

          // 🎯 3. re_movie 제목 (.re_movie .txt)
          .fromTo("#hobby .re_movie .txt",
            { autoAlpha: 0, y: -200, rotation: -5 },
            {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              duration: 0.9,
              ease: "bounce.out"
            }
          )

          // 🎯 4. re_movie 이미지들
          .fromTo("#hobby .re_movie .sticker_txt, #hobby .re_movie img",
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "power2.out",
              onComplete: () => {
                function collageJitter(el) {
                  const tl = gsap.timeline({ repeat: -1 });

                  tl.to(el, { rotation: -2, x: -1, y: 1, duration: 0.01, delay: 0.4 })
                    .to(el, { rotation: 2, x: 2, y: -1, duration: 0.01, delay: 0.4 })
                    .to(el, { rotation: -1, x: -1, y: 0, duration: 0.01, delay: 0.4 })
                    .to(el, { rotation: 0, x: 0, y: 0, duration: 0.01, delay: 0.4 });
                }
                const poster = document.querySelector('#hobby .re_movie ul .begin img.seco ');
                collageJitter(poster);



                /* 테이프 */

                function tapeJitter(el) {
                  const tl = gsap.timeline({ repeat: -1 });

                  tl.to(el, { rotation: 2, x: 1, y: -0.5, duration: 0.01, delay: 0.35 })
                    .to(el, { rotation: -2, x: -1.5, y: 1, duration: 0.01, delay: 0.35 })
                    .to(el, { rotation: 1, x: 0.5, y: -1, duration: 0.01, delay: 0.35 })
                    .to(el, { rotation: 0, x: 0, y: 0, duration: 0.01, delay: 0.35 });
                }
                const conanTape = document.querySelector('#hobby .re_movie ul .conan .sticker_txt ');
                tapeJitter(conanTape);
              }
            }
          )
      }

      else {
        hobbyText.classList.remove("glow");
      }
    });
  });

  hobbyObserver.observe(hobby, {
    attributes: true,
    attributeFilter: ["class"],
  });





  // 기존 드래그 이동, 줌 함수들 다 있고

  // 👉 여기!! 버튼 클릭 이벤트 추가하는 거야
  const btnGroup = document.querySelector('.btn-group');

  btnGroup.addEventListener('click', (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") return;

    btnGroup.querySelectorAll('button, a').forEach(btn => btn.classList.remove('on'));

    e.target.classList.add('on');

    const action = e.target.innerText.trim().toLowerCase().replace(/\s/g, "");

    switch (action) {
      case "skill":
        zoomFromMain('design_skill', '#path1');
        break;
      case "experience":
        zoomFromMain('experience', '#path2');
        break;
      case "character":
        zoomFromMain('character', '#path3');
        break;
      case "hobby":
        zoomFromMain('hobby', '#path4');
        break;
      case "mainview":
        zoomTo('main');
        break;
      case "allview":
        resetView();
        break;
    }
  });

  window.onload = () => {
    resetView();
    setTimeout(() => {
      zoomTo('main');
      // ✅ mainview 버튼도 on
      const mainBtn = document.querySelector('.btn-group .ma');
      if (mainBtn) {
        btnGroup.querySelectorAll('button, a').forEach(btn => btn.classList.remove('on'));
        mainBtn.classList.add('on');
      }
    }, 1000);
  };

});
