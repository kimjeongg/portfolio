document.addEventListener("DOMContentLoaded", () => {
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
