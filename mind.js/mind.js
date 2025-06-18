document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById('canvas');
  const view = document.getElementById('view');
  const cursor = document.getElementById("custom-cursor");
  const handOpen = document.getElementById("hand-open");
  const handClosed = document.getElementById("hand-closed");
  const btnGroup = document.querySelector('.btn-group');


  (function hideSkillContentsInitially() {
    const target = document.getElementById("design_skill");
    if (!target) return;
    const ai = target.querySelector(".ai");
    const coding = target.querySelector(".coding");
    const design = target.querySelector(".design");
    const sections = [ai, coding, design];
    sections.forEach(section => {
      if (!section) return;
      const txt = section.querySelector(":scope > .txt");
      const top = section.querySelector(":scope > .tol, :scope > .go_trip, :scope > .aiImg, :scope > .deImg, :scope > .coImg");
      const bottom = section.querySelector(":scope > .vid, :scope > .re_movie");
      if (txt) gsap.set(txt, { autoAlpha: 0, y: -60 });
      if (top) gsap.set(top, { autoAlpha: 0, y: 30 });
      if (bottom) gsap.set(bottom, { autoAlpha: 0, y: 30 });
    });
  })();

  let isDragging = false, startX, startY, initialX = 0, initialY = 0;
  let lastX = 0;
  let clickStartX = 0;
  let clickStartY = 0;

  const handleMouseUp = () => {
    isDragging = false;
    handOpen.style.display = 'block';
    handClosed.style.display = 'none';
  };

  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mouseleave', handleMouseUp);
  window.addEventListener('mouseup', handleMouseUp);


  // 커서 이동
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    const deltaX = e.clientX - lastX;
    lastX = e.clientX;
    if (!isDragging) return;
    initialX = e.pageX - startX;
    initialY = e.pageY - startY;
    canvas.style.transform = `translate(${initialX}px, ${initialY}px)`;
  });

  // 드래그 시작
  document.addEventListener('mousedown', (e) => {
    const allBtn = document.querySelector('.btn-group .all');
    const isAllView = allBtn && allBtn.classList.contains('on');
    if (!isAllView) return;

    e.preventDefault();

    isDragging = true;
    startX = e.pageX - initialX;
    startY = e.pageY - initialY;
    handOpen.style.display = 'none';
    handClosed.style.display = 'block';
    clickStartX = e.clientX;
    clickStartY = e.clientY;
  });

  // 드래그 종료
  document.addEventListener('mouseup', () => {
    isDragging = false;
    handOpen.style.display = 'block';
    handClosed.style.display = 'none';
  });

  document.addEventListener('mouseleave', () => {
    isDragging = false;
    handOpen.style.display = 'block';
    handClosed.style.display = 'none';
  });

  // 안내 텍스트
  setTimeout(() => {
    const dragTip = document.createElement('div');
    dragTip.className = 'drag-tip';
    dragTip.innerText = "전체 보기(all view)에서만 드래그가 가능합니다!";
    document.body.appendChild(dragTip);

    Object.assign(dragTip.style, {
      position: 'fixed', top: '40px', left: '50%',
      transform: 'translateX(-50%)', background: 'rgba(105, 157, 0, 0.85)',
      color: '#fff', padding: '10px 20px', borderRadius: '30px',
      fontSize: '23px', zIndex: '9999', opacity: '0',
      transition: 'opacity 0.5s ease'
    });

    requestAnimationFrame(() => {
      dragTip.style.opacity = '1';
      setTimeout(() => {
        dragTip.style.opacity = '0';
        setTimeout(() => dragTip.remove(), 1000);
      }, 2000);
    });
  }, 2000);

  // 섹션 클릭 시 중심 이동 (all view에서만 가능)
  const sectionToBtnClass = {
    'design_skill': 'skill',
    'experience': 'ex',
    'character': 'ch',
    'hobby': 'ho',
    'main': 'ma',
  };

  view.addEventListener('click', (e) => {
    const section = e.target.closest('.section');
    if (!section || section.classList.contains('active')) return;
    const allBtn = document.querySelector('.btn-group .all');
    const isAllView = allBtn && allBtn.classList.contains('on');
    if (!isAllView || section.id === 'main') return;

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    section.classList.add('active');

    const targetClass = sectionToBtnClass[section.id];
    document.querySelectorAll('.btn-group button, .btn-group a').forEach(btn => {
      btn.classList.remove('on');
      if (btn.classList.contains(targetClass)) btn.classList.add('on');
    });

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
      }
    });
  });

  function zoomFromMain(targetId, pathId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const main = document.getElementById('main');
    const target = document.getElementById(targetId);
    const path = document.querySelector(pathId);
    const length = path.getTotalLength();

    // 1️⃣ 절대 좌표 기준으로 재계산 (기존 += 방식 제거)
    const canvasRect = canvas.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const canvasCenterX = canvasRect.left + canvasRect.width / 2;
    const canvasCenterY = canvasRect.top + canvasRect.height / 2;

    const offsetX = window.innerWidth / 2 - targetCenterX;
    const offsetY = window.innerHeight / 2 - targetCenterY;

    initialX += offsetX;
    initialY += offsetY;

    // 2️⃣ path 애니메이션
    gsap.set(canvas, { x: initialX, y: initialY });
    canvas.style.transform = `translate(${initialX}px, ${initialY}px)`;

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1, // path 보이게
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {

        path.style.display = "none";

        // 3️⃣ 확대 + 정중앙 이동
        gsap.to(canvas, {
          x: initialX,
          y: initialY,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: () => {
            canvas.style.transform = `translate(${initialX}px, ${initialY}px)`;
          },
          onComplete: () => {
            target.classList.add('active');
          }
        });
      }
    });
  }


  function zoomTo(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
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
      }
    });
  }

  function resetView() {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    initialX = -1500;
    initialY = -1400;
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

  btnGroup.addEventListener('click', (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") return;

    // GNB 상태 초기화
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
      case "mainview": zoomFromMain('main', '#pathMain'); break;

      case "allview":
        resetView();
        break;
    }
  });


  window.onload = () => {
    resetView();
    setTimeout(() => {
      zoomTo('main');
      const mainBtn = document.querySelector('.btn-group .ma');
      if (mainBtn) {
        btnGroup.querySelectorAll('button, a').forEach(btn => btn.classList.remove('on'));
        mainBtn.classList.add('on');
      }
    }, 1000);
  };

  const sectionObservers = {
    /*    design_skill: () => {
         const target = document.getElementById("design_skill");
         const text = target.querySelector(".txt");
         const icons = target.querySelectorAll("#design_skill li");
         return new MutationObserver((mutations) => {
           mutations.forEach(() => {
             if (target.classList.contains("active")) {
               text.classList.add("glow");
               icons.forEach((icon, i) => {
                 const angle = getComputedStyle(icon).getPropertyValue("--angle");
                 gsap.fromTo(icon,
                   { autoAlpha: 0, y: -150, rotation: parseFloat(angle) - 5 },
                   { autoAlpha: 1, y: 0, rotation: parseFloat(angle), duration: 0.9, ease: "bounce.out", delay: 0.3 + i * 0.15 }
                 );
               });
             } else {
               text.classList.remove("glow");
               icons.forEach((icon) => gsap.set(icon, { autoAlpha: 0, y: -100, rotation: -5 }));
             }
           });
         });
       }, */
    design_skill: () => {
      const target = document.getElementById("design_skill");
      const mainTxt = target.querySelector(":scope > .txt"); // Dev Tools
      const ai = target.querySelector(".ai");
      const coding = target.querySelector(".coding");
      const design = target.querySelector(".design");
      const sections = [ai, coding, design];

      // 각 섹션의 txt, tol, img(wrapper)
      const sectionData = [
        {
          txt: ai?.querySelector(":scope > .txt"),
          tol: ai?.querySelector(".tol"),
          imgs: ai?.querySelectorAll(".aiImg > *")
        },
        {
          txt: coding?.querySelector(":scope > .txt"),
          tol: coding?.querySelector(".tol"),
          imgs: coding?.querySelectorAll(".coImg > *, .vid")
        },
        {
          txt: design?.querySelector(":scope > .txt"),
          tol: design?.querySelector(".tol"),
          imgs: design?.querySelectorAll(".deImg > *, .vid")
        }
      ];

      // 초기 상태: Dev Tools만 보이고 나머지 숨김
      gsap.set(mainTxt, { autoAlpha: 1, y: 0 });
      sectionData.forEach(({ txt, tol, imgs }) => {
        if (txt) gsap.set(txt, { autoAlpha: 0, y: -60 });
        if (tol) gsap.set(tol, { autoAlpha: 0, y: 0 });
        if (imgs) gsap.set(imgs, { autoAlpha: 0, y: 40 });
      });

      // tol 둥둥 애니메이션 함수
      function floatTol(tol) {
        if (!tol) return;
        gsap.to(tol, {
          y: -15,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
      function stopFloatTol(tol) {
        if (!tol) return;
        gsap.killTweensOf(tol);
        gsap.set(tol, { y: 0 });
      }

      return new MutationObserver(() => {
        if (target.classList.contains("active")) {
          // Dev Tools 글로우
          mainTxt.classList.add("glow");

          // 각 섹션 순차 등장
          sectionData.forEach(({ txt, tol, imgs }, i) => {
            // txt 떨어짐
            if (txt) {
              gsap.to(txt, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                delay: i * 0.9,
                ease: "bounce.out",
                onStart: () => {
                  // tol 둥둥 애니메이션 시작
                  if (tol) {
                    gsap.to(tol, { autoAlpha: 1, duration: 0.3 });
                    floatTol(tol);
                  }
                }
              });
            }
            // img들 아래에서 위로 자연스럽게 페이드인 (hobby와 유사)
            if (imgs) {
              gsap.to(imgs, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                delay: (i * 0.9) + 0.5,
                stagger: 0.17,
                ease: "power2.out"
              });
            }
          });
        } else {
          mainTxt.classList.remove("glow");
          // Dev Tools만 보이고 나머지 숨김
          sectionData.forEach(({ txt, tol, imgs }) => {
            if (txt) gsap.set(txt, { autoAlpha: 0, y: -60 });
            if (tol) {
              gsap.set(tol, { autoAlpha: 0, y: 0 });
              stopFloatTol(tol);
            }
            if (imgs) gsap.set(imgs, { autoAlpha: 0, y: 40 });
          });
        }
      });
    },
    experience: () => {
      const target = document.getElementById("experience");
      const text = target.querySelector(".txt");
      const uls = target.querySelectorAll("ul");
      return new MutationObserver((mutations) => {
        mutations.forEach(() => {
          if (target.classList.contains("active")) {
            text.classList.add("glow");
            uls.forEach((ul, i) => setTimeout(() => ul.classList.add("reveal"), i * 400));
          } else {
            text.classList.remove("glow");
            uls.forEach((ul) => ul.classList.remove("reveal"));
          }
        });
      });
    },
    character: () => {
      const target = document.getElementById("character");
      const text = target.querySelector(".txt");
      const lis = target.querySelectorAll("li");
      return new MutationObserver((mutations) => {
        mutations.forEach(() => {
          if (target.classList.contains("active")) {
            text.classList.add("glow");
            lis.forEach((li, i) => setTimeout(() => li.classList.add("reveal"), 300 + i * 300));
          } else {
            text.classList.remove("glow");
            lis.forEach((li) => li.classList.remove("reveal"));
          }
        });
      });
    },
    hobby: () => {
      const hobby = document.getElementById("hobby");
      const hobbyText = hobby.querySelector(".txt");

      return new MutationObserver((mutations) => {
        mutations.forEach(() => {
          const isActive = hobby.classList.contains("active");

          if (isActive) {
            hobbyText.classList.add("glow");

            const tl = gsap.timeline();

            tl.fromTo("#hobby .go_trip .txt", { autoAlpha: 0, y: -200, rotation: -5 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.9, ease: "bounce.out" })
              .fromTo("#hobby .go_trip img", { autoAlpha: 0, y: 30 }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out",
                onComplete: () => {
                  const target = document.querySelector('#hobby .go_trip .two');
                  const crown = document.querySelector('#hobby .go_trip .na');

                  if (!target.dataset.animated) {
                    const tl = gsap.timeline({ repeat: -1 });
                    tl.to(target, { x: -3, y: -3, duration: 0.01, delay: 0.3 })
                      .to(target, { x: 3, y: -3, duration: 0.01, delay: 0.3 })
                      .to(target, { x: -2, y: 2, duration: 0.01, delay: 0.2 })
                      .to(target, { x: 3, y: 3, duration: 0.01, delay: 0.3 })
                      .to(target, { x: 0, y: 0, duration: 0.01, delay: 0.2 });
                    target.dataset.animated = true;
                  }

                  if (!crown.dataset.animated) {
                    const tl = gsap.timeline({ repeat: -1 });
                    tl.to(crown, { y: -5, rotation: -5, duration: 0.01, delay: 0.3 })
                      .to(crown, { y: -3, rotation: 3, duration: 0.01, delay: 0.3 })
                      .to(crown, { y: -6, rotation: -4, duration: 0.01, delay: 0.3 })
                      .to(crown, { y: 0, rotation: 0, duration: 0.01, delay: 0.3 });
                    crown.dataset.animated = true;
                  }
                }
              })
              .fromTo("#hobby .re_movie .txt", { autoAlpha: 0, y: -200, rotation: -5 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.9, ease: "bounce.out" })
              .fromTo("#hobby .re_movie .sticker_txt, #hobby .re_movie img", { autoAlpha: 0, y: 30 }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.15,
                ease: "power2.out",
                onComplete: () => {
                  const poster = document.querySelector('#hobby .re_movie ul .begin img.seco');
                  const conanTape = document.querySelector('#hobby .re_movie ul .conan .sticker_txt');

                  if (!poster.dataset.animated) {
                    const tl = gsap.timeline({ repeat: -1 });
                    tl.to(poster, { rotation: -2, x: -1, y: 1, duration: 0.01, delay: 0.4 })
                      .to(poster, { rotation: 2, x: 2, y: -1, duration: 0.01, delay: 0.4 })
                      .to(poster, { rotation: -1, x: -1, y: 0, duration: 0.01, delay: 0.4 })
                      .to(poster, { rotation: 0, x: 0, y: 0, duration: 0.01, delay: 0.4 });
                    poster.dataset.animated = true;
                  }

                  if (!conanTape.dataset.animated) {
                    const tl = gsap.timeline({ repeat: -1 });
                    tl.to(conanTape, { rotation: 2, x: 1, y: -0.5, duration: 0.01, delay: 0.35 })
                      .to(conanTape, { rotation: -2, x: -1.5, y: 1, duration: 0.01, delay: 0.35 })
                      .to(conanTape, { rotation: 1, x: 0.5, y: -1, duration: 0.01, delay: 0.35 })
                      .to(conanTape, { rotation: 0, x: 0, y: 0, duration: 0.01, delay: 0.35 });
                    conanTape.dataset.animated = true;
                  }
                }
              });
          } else {
            hobbyText.classList.remove("glow");
            const jitterTargets = [
              "#hobby .go_trip .na",
              "#hobby .go_trip .two",
              "#hobby .re_movie ul .begin img.seco",
              "#hobby .re_movie ul .conan .sticker_txt"
            ];

            gsap.killTweensOf(jitterTargets);
            gsap.set(jitterTargets, { x: 0, y: 0, rotation: 0 });

            jitterTargets.forEach(sel => {
              const el = document.querySelector(sel);
              if (el && el.dataset.animated) delete el.dataset.animated;
            });
          }
        });
      });
    },
    main: () => {
      const target = document.getElementById("main");
      const content = target.querySelector(".content");
      return new MutationObserver((mutations) => {
        mutations.forEach(() => {
          if (!content) return;
          if (target.classList.contains("active")) content.classList.add("glow");
          else content.classList.remove("glow");
        });
      });
    }
  };

  Object.entries(sectionObservers).forEach(([id, fn]) => {
    const el = document.getElementById(id); // ← 소문자 document로 수정
    if (el) fn().observe(el, {
      attributes: true,
      attributeFilter: ["class"]
    });
  });





});