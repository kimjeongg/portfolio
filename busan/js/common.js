// ✅ 1. DOMContentLoaded 이벤트로 감싸기
document.addEventListener('DOMContentLoaded', function () {

    // ✅ 2. 기존 GSAP 코드 앞에 요소 존재 확인
    const txtArea = document.querySelector('.txt_area');
    const visionSection = document.querySelector('.vision');
    const vidBox = document.querySelector('.vid_box');
    const trustContainer = document.querySelector('.trust .con');

    // ✅ 3. 요소가 존재할 때만 GSAP 실행
    if (txtArea) {
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.txt_area',
                start: 'top 20%',
                end: 'bottom bottom',
                scrub: true,
            }
        });

        tl.to('.txt_area strong.tit', {
            backgroundSize: '100%',
            duration: 1,
            ease: 'none'
        }).to('.txt_area b.tit', {
            backgroundSize: '100%',
            duration: 1,
            ease: 'none'
        }, '+=0.6')
            .to('.txt_area em.tit', {
                backgroundSize: '100%',
                duration: 1,
                ease: 'none'
            }, '+=1.2');
    }

    // ✅ 4. vision 카드 애니메이션
    if (visionSection) {
        const visionCards = gsap.utils.toArray('.vision .card');
        if (visionCards.length > 0) {
            visionCards.forEach((card, i) => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.vision',
                        start: `top+=${i * 300} center`,
                        end: `top+=${(i + 1) * 300} center`,
                        scrub: 1.2,
                    }
                });
                tl.fromTo(card, { rotationY: 0 }, {
                    rotationY: 180,
                    transformOrigin: "center center",
                    ease: "power2.out"
                });
            });
        }
    }

    // ✅ 5. vid 섹션 애니메이션
    if (vidBox) {
        gsap.timeline({
            scrollTrigger: {
                trigger: '.vid',
                start: 'top 40%',
                end: 'bottom center',
                scrub: true,
                toggleClass: { targets: '.vid', className: 'on' },
            }
        });

        gsap.timeline({
            scrollTrigger: {
                trigger: '.vid_box',
                start: 'top 10%',
                end: "top 10%+=1500",
                scrub: 1,
                pin: '.vid_box',
                pinSpacing: true,
                pinReparent: true,
            }
        }).fromTo('.vid_box iframe', {
            scale: 0.65,
            transformOrigin: "center center"
        }, {
            scale: 1,
            ease: "power2.out",
            duration: 2
        });
    }

    // ✅ 6. trust 섹션 애니메이션
    if (trustContainer) {
        const cards = gsap.utils.toArray('.trust ul li');
        if (cards.length > 0) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: trustContainer,
                    start: 'top 20%',
                    end: () => "+=" + (cards.length * 380),
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            })
                .fromTo(cards, {
                    y: 300,
                    z: 200,
                    opacity: 0.8
                }, {
                    y: 0,
                    z: 0,
                    duration: 1,
                    ease: "power2.out",
                    stagger: 1,
                    opacity: 1
                })
                .to(cards, {
                    y: -300,
                    z: -200,
                    skewY: 5,
                    duration: 1,
                    ease: "power2.in",
                    stagger: 1,
                }, '+=0.5');
        }
    }

}); // DOMContentLoaded 끝