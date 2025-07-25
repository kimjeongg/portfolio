
$(function () {
  // ✅ 의존성 확인
  if (typeof gsap === 'undefined') {
    console.error('GSAP이 로드되지 않았습니다.');
    return;
  }

  if (typeof ScrollTrigger === 'undefined') {
    console.error('ScrollTrigger가 로드되지 않았습니다.');
    return;
  }

  if (typeof Matter === 'undefined') {
    console.error('Matter.js가 로드되지 않았습니다.');
    return;
  }

  // ✅ GSAP 플러그인 등록
  gsap.registerPlugin(ScrollTrigger);

  // ✅ 요소 존재 확인
  const footer = document.querySelector(".footer_top");
  const canvas = document.getElementById("matter-canvas");
  const tags = document.querySelectorAll(".tag");

  if (!footer || !canvas || !tags.length) {
    console.error('Footer 관련 DOM 요소를 찾을 수 없습니다.');
    return;
  }

  window.addEventListener("wheel", function (e) {
    // console.log("✅ window wheel fired", e.deltaY);
  });

  /*  글자 모션 */
  gsap.registerPlugin(ScrollTrigger);

  // ✅ 구조 유지하면서 텍스트를 글자별로 <span class="char">로 감싸기
  function splitTextPreserveStructure(selector) {
    const targets = document.querySelectorAll(selector);

    targets.forEach(target => {
      const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null, false);

      let textNode;
      while ((textNode = walker.nextNode())) {
        const parent = textNode.parentNode;
        const text = textNode.textContent;

        const frag = document.createDocumentFragment();
        [...text].forEach(char => {
          const span = document.createElement("span");
          span.classList.add("char");


          // 공백은 그대로 삽입하되 스타일은 별도로 빼기 위해 클래스 추가
          if (char === " ") {
            span.innerHTML = "&nbsp;";
            span.classList.add("space");
          } else {
            span.textContent = char;
          }
          frag.appendChild(span);
        });
        parent.replaceChild(frag, textNode);
      }
    });
  }

  // ✅ 대상 선택자 (span 대신 이제 p, strong, li 등)
  splitTextPreserveStructure(`
     .footer_top .txt ul.left li,
    .footer_top .txt ul.right li
  `);

  // ✅ footer 영역 진입 시 애니메이션 트리거
  ScrollTrigger.create({
    trigger: ".footer_top",
    start: "top bottom",
    onEnter: () => {
      const chars = document.querySelectorAll(".footer_top .char");
      chars.forEach((char, i) => {
        char.style.transitionDelay = `${i * 0.01}s`;
        char.classList.add("on");
      });
      tags.forEach(tag => tag.style.opacity = 1);

      // ★ 태그의 Matter.js body 위치/속도 리셋 (여기 추가!)
      if (window.Body && window.bodies) {
        window.bodies.forEach((body, i) => {
          const tag = tags[i];
          window.Body.setPosition(body, {
            x: gsap.utils.random(tag.offsetWidth / 2, canvas.width - tag.offsetWidth / 2),
            y: -gsap.utils.random(100, 300)
          });
          window.Body.setVelocity(body, { x: 0, y: 0 });
          window.Body.setAngle(body, 0);
          window.Body.setAngularVelocity(body, 0);
        });
      }
    },
    onLeaveBack: () => {
      const chars = document.querySelectorAll(".footer_top .char");
      chars.forEach((char) => {
        char.classList.remove("on");
        char.style.transitionDelay = "0s";
      });
      tags.forEach(tag => tag.style.opacity = 0);
    },
    toggleActions: "play none none reset"
  });




  /* 떨어지는 프레임 */
  gsap.registerPlugin(ScrollTrigger);



  /* console.log("✅ canvas:", canvas); */

  // scrollTarget을 계산하는 코드 (바닐라 JS)
  let scrollTarget = document.querySelector('.container').offsetTop;

  canvas.style.pointerEvents = "auto"; // canvas가 pointer 이벤트를 받을 수 있도록 설정




  /*   canvas.addEventListener("wheel", function (event) {
      if (event.deltaY < 0 && window.scrollY > 10) {
        window.scrollTo({
          top: scrollTarget,
          behavior: 'smooth'
        });
        event.preventDefault(); // 위로 스크롤할 때만 막기
      }
    });
   */
  canvas.width = window.innerWidth;
  canvas.height = footer.offsetHeight;

  const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Mouse,
    MouseConstraint,
    Events,
    Body
  } = Matter;

  const engine = Engine.create();
  const world = engine.world;

  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: canvas.width,
      height: canvas.height,
      wireframes: false,
      background: 'transparent'
    }
  });

  Render.run(render);
  Runner.run(Runner.create(), engine);

  // ground (for collision)
  const ground = Bodies.rectangle(
    canvas.width / 2,
    canvas.height + 20,
    canvas.width,
    40,
    { isStatic: true }
  );
  World.add(world, ground);

  const bodies = [];
  tags.forEach(tag => {
    tag.style.position = 'absolute';
    tag.style.pointerEvents = 'auto';
    tag.style.opacity = 0;

    const rect = tag.getBoundingClientRect();
    const x = gsap.utils.random(rect.width / 2, canvas.width - rect.width / 2);
    const y = -gsap.utils.random(100, 300);

    const body = Bodies.rectangle(x, y, rect.width, rect.height, {
      restitution: 0.6,
      friction: 0.3,
      render: {
        visible: false // ✅ 이거 필수!
      }
    });

    World.add(world, body);
    bodies.push(body);

    tag.addEventListener("mousedown", () => {
      tag.style.cursor = "grabbing";
    });
    document.addEventListener("mouseup", () => {
      tag.style.cursor = "grab";
    });

  });
  // ✅ 여기 아래에 추가!
  window.Body = Body;
  window.bodies = bodies;

  // 업데이트마다 DOM 위치 반영
  Events.on(engine, 'afterUpdate', () => {
    tags.forEach((tag, i) => {
      const body = bodies[i];
      if (!body) return;
      tag.style.transform = `translate(${body.position.x - tag.offsetWidth / 2}px, ${body.position.y - tag.offsetHeight / 2}px) rotate(${body.angle}rad)`;
    });
  });

  // 마우스 드래그
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });
  World.add(world, mouseConstraint);
  render.mouse = mouse;

  // 버튼 위 드래그 방지
  let isHoveringButton = false;
  const button = document.querySelector('.botton a');

  button.addEventListener("mouseenter", () => {
    isHoveringButton = true;
    // 버튼 위에 올 때 태그와 캔버스 클릭 막기
    document.querySelectorAll('.tag').forEach(tag => tag.style.pointerEvents = "none");
    canvas.style.pointerEvents = "none";
  });
  button.addEventListener("mouseleave", () => {
    isHoveringButton = false;
    // 버튼에서 나가면 다시 태그와 캔버스 클릭 가능
    document.querySelectorAll('.tag').forEach(tag => tag.style.pointerEvents = "auto");
    canvas.style.pointerEvents = "auto";
  });

  Events.on(mouseConstraint, "startdrag", (event) => {
    if (isHoveringButton) {
      event.source.body = null;
    }
  });

  // 떨어뜨리는 트리거
  ScrollTrigger.create({
    trigger: ".footer_top",
    start: "top bottom",
    onEnter: () => {
      const chars = document.querySelectorAll(".footer_top .char");
      chars.forEach((char, i) => {
        char.style.transitionDelay = `${i * 0.01}s`;
        char.classList.add("on");
      });
      tags.forEach(tag => tag.style.opacity = 1); // ← 진입 시 보이게
    },
    onLeaveBack: () => {
      const chars = document.querySelectorAll(".footer_top .char");
      chars.forEach((char) => {
        char.classList.remove("on");
        char.style.transitionDelay = "0s";
      });
      tags.forEach(tag => tag.style.opacity = 0); // ← 이탈 시 숨김
    },
    toggleActions: "play none none reset"
  });
  window.triggerFooterMotion = function () {
    // 글자 모션
    const chars = document.querySelectorAll(".footer_top .char");
    chars.forEach((char, i) => {
      char.style.transitionDelay = `${i * 0.01}s`;
      char.classList.add("on");
    });

    // 프레임(태그) 떨어뜨리기
    setTimeout(() => {
      const tags = document.querySelectorAll(".tag");
      if (window.Body && window.bodies) {
        tags.forEach(tag => tag.style.opacity = 1);
        window.bodies.forEach((body, i) => {
          const tag = tags[i];
          window.Body.setPosition(body, {
            x: gsap.utils.random(tag.offsetWidth / 2, canvas.width - tag.offsetWidth / 2),
            y: -gsap.utils.random(100, 300)
          });
          window.Body.setVelocity(body, { x: 0, y: 0 });
          window.Body.setAngle(body, 0);
          window.Body.setAngularVelocity(body, 0);
        });
      }
    }, 300);

  };


});
