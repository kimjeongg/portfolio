$(function(){
    const cursor = document.querySelector(".cursor");
    const textCursor = document.querySelector(".cursor-text");
    const glitchZone = document.querySelector(".glitch-zone");
    let isTextMode = false;

    let lastX = 0, lastY = 0, isFirst = true;

    window.addEventListener("mousemove", (e) => {
      if (!isTextMode) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        if (!isFirst && (Math.abs(e.clientX - lastX) > 2 || Math.abs(e.clientY - lastY) > 2)) {
          createTrail(e.clientX - 2, e.clientY - 2, 'trail-r');
          createTrail(e.clientX + 2, e.clientY + 2, 'trail-g');
          createTrail(e.clientX, e.clientY - 2, 'trail-b');
        }

        lastX = e.clientX;
        lastY = e.clientY;
        isFirst = false;
      }

      textCursor.style.left = `${e.clientX}px`;
      textCursor.style.top = `${e.clientY}px`;
    });

    function createTrail(x, y, trailClass) {
      const trail = document.createElement("div");
      trail.className = `cursor-trail ${trailClass}`;
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      document.body.appendChild(trail);

      setTimeout(() => {
        trail.style.transition = "opacity 0.35s, transform 0.35s";
        trail.style.opacity = "0";
        trail.style.transform = "translate(-50%, -50%) scale(1.4)";
      }, 0);

      setTimeout(() => trail.remove(), 400);
    }

    glitchZone.addEventListener("mouseenter", () => {
      const text = glitchZone.getAttribute("data-text");
      cursor.style.display = "none";
      textCursor.innerHTML = "";
      text.split("").forEach(char => {
        const span = document.createElement("span");
        span.textContent = char;
        textCursor.appendChild(span);
      });
      textCursor.classList.add("active");
      isTextMode = true;
    });

    glitchZone.addEventListener("mouseleave", () => {
      cursor.style.display = "block";
      textCursor.classList.remove("active");
      textCursor.style.opacity = "0";
      textCursor.innerHTML = "";
      isTextMode = false;
    });

    glitchZone.addEventListener("click", (e) => {
      e.preventDefault();
      const spans = textCursor.querySelectorAll("span");
      textCursor.classList.add("glitch");

      spans.forEach(span => {
        const dx = (Math.random() - 0.5) * 100;
        const dy = (Math.random() - 0.5) * 100;
        const rot = (Math.random() - 0.5) * 180;
        span.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
        span.classList.add("active");
      });

      setTimeout(() => {
        window.location.href = glitchZone.getAttribute("href");
      }, 400);
    });
})