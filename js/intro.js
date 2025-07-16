document.addEventListener('DOMContentLoaded', function () {

    // ✅ GSAP 로딩 확인
    if (typeof gsap === 'undefined') {
        console.error('GSAP이 로드되지 않았습니다.');
        return;
    }

    // ✅ 요소 존재 확인
    const textElement = document.getElementById('text');
    const particlesCanvas = document.getElementById('particles');

    if (!textElement || !particlesCanvas) {
        console.error('필요한 DOM 요소를 찾을 수 없습니다.');
        return;
    }

    if (location.hash === "#values") {
        $('#splash').hide();

        // values 섹션으로 이동
        const valuesSection = document.getElementById('values');
        if (valuesSection) {
            valuesSection.scrollIntoView({ behavior: 'auto' });
        }

        // ✅ 중요: 스크롤 허용 (기존 스크롤 막기 해제)
        window.removeEventListener("wheel", preventScroll);
        window.removeEventListener("touchmove", preventScroll);

        // ✅ body에 'in' 클래스 제거 (values에서 wrapper로 스크롤 가능하게)
        document.body.classList.remove('in');

        // ✅ ScrollTrigger 새로고침
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }

        // 페이지네이션 업데이트 함수가 있다면 실행
        if (typeof updatePaginationVisibility === 'function') {
            updatePaginationVisibility();
        }

        // 첫 번째 프로젝트 섹션 활성화 (wrapper 관련)
        setTimeout(function () {
            if (typeof goToSection === "function") goToSection(0);
            if (typeof setActivePageBtn === "function") setActivePageBtn(0);
        }, 100);

        return;
    }

    // 기존 스플래시 애니메이션 코드들...
    function preventScroll(e) {
        e.preventDefault();
    }

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    // splash 애니메이션 끝난 뒤에 정확히 해제 가능
    /*    window.removeEventListener("wheel", preventScroll);
       window.removeEventListener("touchmove", preventScroll);
   
    */

    const text = document.getElementById('text');
    const broken = document.getElementById('brokenGlass');
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.splash .txt');
    const splash = document.querySelector('.splash');
    const values = document.querySelector('.values');

    text.innerHTML = text.innerText.split('').map(char => `<span class="char">${char}</span>`).join('');

    setTimeout(() => {
        // 글자만 서서히 등장
        gsap.to(text.querySelectorAll('.char'), {
            opacity: 1,
            duration: 1,
            stagger: 0.03,
            ease: "power2.out"
        });
    }, 500);


    const chars = document.querySelectorAll('.char');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let particles = [];

    function createParticles(x, y) {
        for (let i = 0; i < 150; i++) {
            const angle = Math.random() * Math.PI * 2; // 0~2파이 (360도)
            const distance = Math.random() * 200; // 원 밖으로 얼마나 퍼질지


            particles.push({
                x: x,
                y: y,
                radius: Math.random() * 4 + 2, // 작게 다양하게
                speedX: Math.cos(angle) * distance / 20, // 나누기 클수록 부드러움
                speedY: Math.sin(angle) * distance / 20,
                alpha: 1
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.alpha -= 0.02;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            ctx.fill();
            if (p.alpha <= 0) particles.splice(index, 1);
        });
        requestAnimationFrame(animateParticles);
    }

    function shakeScreen() {
        return gsap.timeline()
            .to(container, { x: -50, y: 50, duration: 0.05 })
            .to(container, { x: 50, y: -50, duration: 0.08 })
            .to(container, { x: -20, y: 20, duration: 0.08 })
            .to(container, { x: 10, y: -10, duration: 0.05 })
            .to(container, { x: 0, y: 0, duration: 0.05 });
    }
    /* 마우스 텍스트 */
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // 커서 움직임 감지
    /*     document.addEventListener("mousemove", (e) => {
            targetX = e.clientX / window.innerWidth;
            targetY = e.clientY / window.innerHeight;
        }); */

    // 프레임마다 조금씩 따라가게 업데이트
    /* function animateGlow() {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
    
      const posX = 10 + currentX * 80;
      const posY = 10 + currentY * 80;
    
      document.querySelectorAll('.char').forEach(char => {
        char.style.backgroundImage = `radial-gradient(
          circle at ${posX}% ${posY}%,
          rgba(255, 255, 255, 1) 0%,
          rgba(210, 210, 210, 0.8) 15%,
          rgba(120, 120, 120, 0.4) 35%,
          rgba(120, 120, 120, 1) 65%
        )`;
      });
    
      requestAnimationFrame(animateGlow);
    }
        
        
       animateGlow();
     */


    document.addEventListener("mousemove", (e) => {
        targetX = e.clientX / window.innerWidth;
        targetY = e.clientY / window.innerHeight;
    });

    function animateLight() {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        const px = window.innerWidth * (currentX - 0.5) * 1.5 + window.innerWidth / 2;
        const py = window.innerHeight * (currentY - 0.5) * 1.5 + window.innerHeight / 2;

        document.querySelectorAll('.char').forEach(char => {
            char.style.backgroundImage = `radial-gradient(circle at ${px}px ${py}px,
 #1a1a1a 0%,
  #444444 20%,
  #777777 40%,
  #aaaaaa 60%,
  #ffffff 100%`;
        });

        requestAnimationFrame(animateLight);
    }
    animateLight();



    let hasPlayed = false;

    container.addEventListener('click', (e) => {
        window.scrollTo(0, 0);
        if (hasPlayed) return; // 이미 실행됐으면 막기
        hasPlayed = true;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const tl = gsap.timeline();

        // (1) 흔들기 → (2) 유리 → (3) 텍스트 → (4) 파편 → (5) splash → (6) values
        tl.add(shakeScreen())

            .fromTo(broken, { opacity: 1 }, { opacity: 0, duration: 1, ease: "power2.out" })

            .to(chars, {
                duration: 0.5,
                x: () => gsap.utils.random(-200, 200),
                y: () => gsap.utils.random(-200, 200),
                rotation: () => gsap.utils.random(-360, 360),
                opacity: 0,
                ease: "power3.out",
                stagger: 0.02
            }, "-=1")

            .add(() => {
                createParticles(mouseX, mouseY);
                animateParticles();
            }, "-=0.8")

            .to(".splash", {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    document.querySelector(".splash")?.remove();
                }
            }, "-=0.4")

            .fromTo(values, {
                scale: 0,
                clipPath: "circle(0% at 50% 50%)",
                opacity: 0
            }, {
                scale: 1,
                clipPath: "circle(100% at 50% 50%)",
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                onComplete: function () {
                    $('.loose').addClass('on');
                    document.body.classList.remove('in');
                    window.scrollTo(0, 0);
                    // 다시 허용
                    window.removeEventListener("wheel", preventScroll);
                    window.removeEventListener("touchmove", preventScroll);
                    ScrollTrigger.refresh();
                }
            }, "-=0.5");



    });



});
