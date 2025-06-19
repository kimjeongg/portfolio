
$(function () {

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
        char.classList.add("on"); // ✅ 각 char에 on 클래스 개별 적용!
      });
    },
    onLeaveBack: () => {
      const chars = document.querySelectorAll(".footer_top .char");
      chars.forEach((char) => {
        char.classList.remove("on");
        char.style.transitionDelay = "0s";
      });
    },
    toggleActions: "play none none reset"
  });




  /* 떨어지는 프레임 */
  gsap.registerPlugin(ScrollTrigger);

  const footer = document.querySelector(".footer_top");
  const canvas = document.getElementById("matter-canvas");
  const tags = document.querySelectorAll(".tag");

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

  button.addEventListener("mouseenter", () => isHoveringButton = true);
  button.addEventListener("mouseleave", () => isHoveringButton = false);

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
      tags.forEach(tag => tag.style.opacity = 1);
      bodies.forEach((body, i) => {
        const tag = tags[i];
        Body.setPosition(body, {
          x: gsap.utils.random(tag.offsetWidth / 2, canvas.width - tag.offsetWidth / 2),
          y: -gsap.utils.random(100, 300)
        });
        Body.setVelocity(body, { x: 0, y: 0 });
        Body.setAngle(body, 0);
        Body.setAngularVelocity(body, 0);
      });
    },
    toggleActions: "restart none none reset"
  });
  window.triggerFooterMotion = function () {
    // 글자 모션
    const chars = document.querySelectorAll(".footer_top .char");
    chars.forEach((char, i) => {
      char.style.transitionDelay = `${i * 0.01}s`;
      char.classList.add("on");
    });

    // 프레임(태그) 떨어뜨리기
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
  };


});
