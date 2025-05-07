document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById('canvas');
  const view = document.getElementById('view');
  const cursor = document.getElementById("custom-cursor");
  const handOpen = document.getElementById("hand-open");
  const handClosed = document.getElementById("hand-closed");
  const btnGroup = document.querySelector('.btn-group');

  let isDragging = false, startX, startY, initialX = 0, initialY = 0;
  let lastX = 0;
  let clickStartX = 0;
  let clickStartY = 0;

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

    const mainRect = main.getBoundingClientRect();
    const mainCenterX = mainRect.left + mainRect.width / 2;
    const mainCenterY = mainRect.top + mainRect.height / 2;
    const mainOffsetX = window.innerWidth / 2 - mainCenterX;
    const mainOffsetY = window.innerHeight / 2 - mainCenterY;
    initialX += mainOffsetX;
    initialY += mainOffsetY;

    gsap.set(canvas, { x: initialX, y: initialY });
    canvas.style.transform = `translate(${initialX}px, ${initialY}px)`;

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
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
    btnGroup.querySelectorAll('button, a').forEach(btn => btn.classList.remove('on'));
    e.target.classList.add('on');
    const action = e.target.innerText.trim().toLowerCase().replace(/\s/g, "");

    switch (action) {
      case "skill": zoomFromMain('design_skill', '#path1'); break;
      case "experience": zoomFromMain('experience', '#path2'); break;
      case "character": zoomFromMain('character', '#path3'); break;
      case "hobby": zoomFromMain('hobby', '#path4'); break;
      case "mainview": zoomTo('main'); break;
      case "allview": resetView(); break;
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
    design_skill: () => {
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
    
            // 1. go_trip 제목
            tl.fromTo("#hobby .go_trip .txt",
              { autoAlpha: 0, y: -200, rotation: -5 },
              { autoAlpha: 1, y: 0, rotation: 0, duration: 0.9, ease: "bounce.out" }
            )
    
            // 2. go_trip 이미지들
            .fromTo("#hobby .go_trip img",
              { autoAlpha: 0, y: 30 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.1,
                ease: "power2.out",
                onComplete: () => {
                  const target = document.querySelector('#hobby .go_trip .two');
                  const crown = document.querySelector('#hobby .go_trip .na');
    
                  function sharpSquareStep(el) {
                    const tl = gsap.timeline({ repeat: -1 });
                    tl.to(el, { x: -3, y: -3, duration: 0.01, delay: 0.3 })
                      .to(el, { x: 3, y: -3, duration: 0.01, delay: 0.3 })
                      .to(el, { x: -2, y: 2, duration: 0.01, delay: 0.2 })
                      .to(el, { x: 3, y: 3, duration: 0.01, delay: 0.3 })
                      .to(el, { x: 0, y: 0, duration: 0.01, delay: 0.2 });
                  }
    
                  function crownJitter(el) {
                    const tl = gsap.timeline({ repeat: -1 });
                    tl.to(el, { y: -5, rotation: -5, duration: 0.01, delay: 0.3 })
                      .to(el, { y: -3, rotation: 3, duration: 0.01, delay: 0.3 })
                      .to(el, { y: -6, rotation: -4, duration: 0.01, delay: 0.3 })
                      .to(el, { y: 0, rotation: 0, duration: 0.01, delay: 0.3 });
                  }
    
                  sharpSquareStep(target);
                  crownJitter(crown);
                }
              })
    
            // 3. re_movie 제목
            .fromTo("#hobby .re_movie .txt",
              { autoAlpha: 0, y: -200, rotation: -5 },
              { autoAlpha: 1, y: 0, rotation: 0, duration: 0.9, ease: "bounce.out" }
            )
    
            // 4. re_movie 이미지들
            .fromTo("#hobby .re_movie .sticker_txt, #hobby .re_movie img",
              { autoAlpha: 0, y: 30 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.1,
                ease: "power2.out",
                onComplete: () => {
                  const poster = document.querySelector('#hobby .re_movie ul .begin img.seco');
                  const conanTape = document.querySelector('#hobby .re_movie ul .conan .sticker_txt');
    
                  function collageJitter(el) {
                    const tl = gsap.timeline({ repeat: -1 });
                    tl.to(el, { rotation: -2, x: -1, y: 1, duration: 0.01, delay: 0.4 })
                      .to(el, { rotation: 2, x: 2, y: -1, duration: 0.01, delay: 0.4 })
                      .to(el, { rotation: -1, x: -1, y: 0, duration: 0.01, delay: 0.4 })
                      .to(el, { rotation: 0, x: 0, y: 0, duration: 0.01, delay: 0.4 });
                  }
    
                  function tapeJitter(el) {
                    const tl = gsap.timeline({ repeat: -1 });
                    tl.to(el, { rotation: 2, x: 1, y: -0.5, duration: 0.01, delay: 0.35 })
                      .to(el, { rotation: -2, x: -1.5, y: 1, duration: 0.01, delay: 0.35 })
                      .to(el, { rotation: 1, x: 0.5, y: -1, duration: 0.01, delay: 0.35 })
                      .to(el, { rotation: 0, x: 0, y: 0, duration: 0.01, delay: 0.35 });
                  }
    
                  collageJitter(poster);
                  tapeJitter(conanTape);
                }
              });
    
          } else {
            hobbyText.classList.remove("glow");
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
    const el = document.getElementById(id);
    if (el) fn().observe(el, { attributes: true, attributeFilter: ["class"] });
  });






});