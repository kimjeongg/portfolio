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
    document.querySelectorAll('.section').forEach(s => {
      s.classList.remove('active');
    });

    const target = document.getElementById(targetId);
    const path = document.querySelector(pathId);
    const length = path.getTotalLength();

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


  // 스킬 
  
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
    } else {
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

  // 🎯 초기 상태: 전체 보기 후 메인 확대
  window.onload = () => {
    resetView();
    setTimeout(() => zoomTo('main'), 1000);
  };

});
