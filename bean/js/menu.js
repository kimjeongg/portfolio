$(function () {
    // 메뉴 목데이터
    const menuData = [
        {
            img: "img/menu1.jpg",
            title: "그릴드 비프치즈 샌드위치",
            description: "따뜻한 곡물 브레드에 멜팅된 매콤달콤 샌드위치",
            badges: [{ text: "BEST", type: "best" }, { text: "NEW", type: "new" }]
        },
        {
            img: "img/menu2.jpg",
            title: "말차초코 갸또",
            description: "초코갸또시트에 달콤쌉싸름한 말차초콜릿 가나슈와 크림이 조화로운 케익",
            badges: [{ text: "BEST", type: "best" }, { text: "HOT", type: "hot" }]
        },
        {
            img: "img/menu3.jpg",
            title: "카페라떼(HOT)",
            description: "에스프레소와 스팀밀크 그리고 거품",
            badges: [{ text: "HOT", type: "hot" }]
        },
        {
            img: "img/menu4.jpg",
            title: "헤이즐넛 라떼(ICE)",
            description: "에스프레소와 헤이즐넛 파우더, 저지방 우유와 얼음",
            badges: [
                 { text: "BEST", type: "best" },{ text: "HOT", type: "hot" }
           
            ]
        },
        {
            img: "img/menu5.jpg",
            title: "크랜베리 크림치즈 스콘",
            description: "진한 크림치즈와  크랜베리의 새콤달콤 풍미가 조화롭게 어울리는 스콘",
            badges: [{ text: "BEST", type: "best" }]
        },
        {
            img: "img/menu6.jpg",
            title: "함박스테이크&파스타",
            description: "에그후라이가 더해진 촉촉한 육즙의 함박과 토마토 펜네 파스타",
            badges: [{ text: "NEW", type: "new" }]
        },
        {
            img: "img/menu7.jpg",
            title: "캐러멜 블렌디드(ICE)",
            description: "커피 원액과 바닐라 파우더, 캐러멜, 저지방 우유의 조화",
            badges: [{ text: "NEW", type: "new" },
                { text: "HOT", type: "hot" }
            ]
        },
        {
            img: "img/menu8.jpg",
            title: "흑임자 티라미수",
            description: "흑임자 시트에 흑임자 크림과 떡이 한 입 가득 느껴지는 고소한 풍미",
            badges: [{ text: "HOT", type: "hot" }]
        },
        {
            img: "img/menu9.jpg",
            title: "이탈리안 쿡 살라미 샌드위치",
            description: "먹물 치아바타에 짭짤한 살라미와 루꼴라 등 풍성하게 어우러진 샌드위치",
            badges: [{ text: "NEW", type: "new" }]
        }
    ];

    function createBadges(badges) {
        return badges.map(badge =>
            `<div class="badge ${badge.type}">${badge.text}</div>`
        ).join('');
    }

    function createInfiniteMarquee() {
        const wrapper = document.getElementById('menu-marquee-wrapper');

        if (!wrapper) {
            console.error('wrapper 요소를 찾을 수 없습니다!');
            return;
        }

        // 기존 내용 제거
        wrapper.innerHTML = '';

        // 데이터를 3번 복사
        const tripleData = [...menuData, ...menuData, ...menuData];

        tripleData.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="badges-container">
                    ${createBadges(item.badges)}
                </div>
                <div class="info">
                    <div class="title">${item.title}</div>
                    <div class="description">${item.description}</div>
                </div>
            `;
            wrapper.appendChild(menuItem);
        });

        // 변수 설정
        let currentTranslate = 0;
        let isAnimating = false;
        const itemWidth = 330;
        const totalItems = menuData.length;
        let animationId;

        // 초기 위치 (두 번째 세트에서 시작)
        currentTranslate = -totalItems * itemWidth;
        wrapper.style.transform = `translateX(${currentTranslate}px)`;

        // 부드러운 마퀴 애니메이션 함수
        function smoothMarquee() {
            if (!isAnimating) {
                currentTranslate -= 1; // 1px씩 이동

                // 경계 체크 (세 번째 세트 끝에 도달하면 첫 번째 세트로 리셋)
                if (currentTranslate <= -(totalItems * 2 * itemWidth)) {
                    currentTranslate = -totalItems * itemWidth;
                }

                wrapper.style.transform = `translateX(${currentTranslate}px)`;
            }

            animationId = requestAnimationFrame(smoothMarquee);
        }

        // 애니메이션 시작
        smoothMarquee();

        // 버튼 이벤트
        const prevBtn = document.querySelector('.menu-nav-prev');
        const nextBtn = document.querySelector('.menu-nav-next');

        if (prevBtn && nextBtn) {
            // 이전 버튼
            prevBtn.addEventListener('click', () => {
                if (isAnimating) return;

                isAnimating = true;

                // 목표 위치 계산
                const targetTranslate = currentTranslate + itemWidth;
                const startTranslate = currentTranslate;
                const duration = 500; // 0.5초
                const startTime = performance.now();

                function animateSlide(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // easeOut 함수로 부드러운 감속
                    const easeOut = 1 - Math.pow(1 - progress, 3);

                    currentTranslate = startTranslate + (targetTranslate - startTranslate) * easeOut;
                    wrapper.style.transform = `translateX(${currentTranslate}px)`;

                    if (progress < 1) {
                        requestAnimationFrame(animateSlide);
                    } else {
                        // 경계 체크
                        if (currentTranslate > 0) {
                            currentTranslate = -(totalItems * 2 * itemWidth);
                            wrapper.style.transform = `translateX(${currentTranslate}px)`;
                        }

                        isAnimating = false;
                    }
                }

                requestAnimationFrame(animateSlide);
            });

            // 다음 버튼
            nextBtn.addEventListener('click', () => {
                if (isAnimating) return;

                isAnimating = true;

                // 목표 위치 계산
                const targetTranslate = currentTranslate - itemWidth;
                const startTranslate = currentTranslate;
                const duration = 500; // 0.5초
                const startTime = performance.now();

                function animateSlide(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // easeOut 함수로 부드러운 감속
                    const easeOut = 1 - Math.pow(1 - progress, 3);

                    currentTranslate = startTranslate + (targetTranslate - startTranslate) * easeOut;
                    wrapper.style.transform = `translateX(${currentTranslate}px)`;

                    if (progress < 1) {
                        requestAnimationFrame(animateSlide);
                    } else {
                        // 경계 체크
                        if (currentTranslate <= -(totalItems * 2 * itemWidth)) {
                            currentTranslate = -totalItems * itemWidth;
                            wrapper.style.transform = `translateX(${currentTranslate}px)`;
                        }

                        isAnimating = false;
                    }
                }

                requestAnimationFrame(animateSlide);
            });
        }

        // 호버 이벤트
        const menuItems = wrapper.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                isAnimating = true; // 마퀴 멈춤
            });

            item.addEventListener('mouseleave', () => {
                isAnimating = false; // 마퀴 재시작
            });
        });

        // 페이지 언로드 시 애니메이션 정리
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }

    createInfiniteMarquee();
});