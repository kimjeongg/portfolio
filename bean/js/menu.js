$(function () {
    // 메뉴 목데이터 (9개)
    const menuData = [
        {
            img: "img/menu-1.jpg",
            title: "카라멜 블렌딘드(ICE)",
            description: "카라멜 블렌딘드 커피만 바닐라 블렌딩, 달콤하고 자극적인 캐러멜로 자기만 우유와 블렌딩",
            badges: [
                { text: "BEST", type: "best" }
            ]
        },
        {
            img: "img/menu-2.jpg",
            title: "헤이즐넛 아메리카노(ICE)",
            description: "카라멜 블렌딘드 커피만 바닐라 블렌딩, 달콤하고 자극적인 캐러멜로 자기만 우유와 블렌딩",
            badges: [
                { text: "BEST", type: "best" },
                { text: "HOT", type: "hot" }
            ]
        },
        {
            img: "img/menu-3.jpg",
            title: "카페라떼(HOT)",
            description: "에스프레소와 스팀밀크 그리고 거품, 카페라떼의 황금 비율로 부드러운 커피 맛",
            badges: [
                { text: "HOT", type: "hot" }
            ]
        },
        {
            img: "img/menu-4.jpg",
            title: "카페모카(HOT)",
            description: "에스프레소와 스팀밀크 그리고 거품, 달콤한 초콜릿이 어우러진 진한 맛",
            badges: [
                { text: "HOT", type: "hot" }
            ]
        },
        {
            img: "img/menu-5.jpg",
            title: "아이스 바닐라 라떼",
            description: "부드러운 바닐라 시럽과 에스프레소, 차가운 우유가 만나 달콤하고 시원한 맛",
            badges: [
                { text: "BEST", type: "best" }
            ]
        },
        {
            img: "img/menu-6.jpg",
            title: "그린티 프라푸치노",
            description: "진한 녹차와 휘핑크림이 어우러진 시원하고 달콤한 블렌디드 음료",
            badges: [
                { text: "NEW", type: "new" }
            ]
        },
        {
            img: "img/menu-7.jpg",
            title: "딸기 크림 프라푸치노",
            description: "상큼한 딸기와 부드러운 크림이 만나 달콤함이 가득한 시즌 메뉴",
            badges: [
                { text: "NEW", type: "new" }
            ]
        },
        {
            img: "img/menu-8.jpg",
            title: "콜드브루 아메리카노",
            description: "12시간 저온 추출로 깔끔한 맛, 깊고 진한 콜드브루만의 풍미",
            badges: [
                { text: "HOT", type: "hot" }
            ]
        },
        {
            img: "img/menu-9.jpg",
            title: "화이트 초콜릿 모카",
            description: "부드러운 화이트 초콜릿과 에스프레소의 조화, 달콤하고 진한 맛",
            badges: [
                { text: "BEST", type: "best" }
            ]
        }
    ];

    // 배지 HTML 생성 함수
    function createBadges(badges) {
        return badges.map(badge =>
            `<div class="badge ${badge.type}">${badge.text}</div>`
        ).join('');
    }

    // 완전히 멈추지 않는 CSS 애니메이션 방식
    function createMenuSwiper() {
        const wrapper = document.getElementById('menu-wrapper');

        // 데이터를 2번 복사해서 끊김 없는 루프 만들기
        const duplicatedData = [...menuData, ...menuData];

        duplicatedData.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
            <div class="menu-item">
                <img src="${item.img}" alt="${item.title}">
                <div class="badges-container">
                    ${createBadges(item.badges)}
                </div>
                <div class="info">
                    <div class="title">${item.title}</div>
                    <div class="description">${item.description}</div>
                </div>
            </div>
        `;
            wrapper.appendChild(slide);
        });

        // 스와이퍼 초기화 - 무한 스크롤
        const menuSwiper = new Swiper('.menu-swiper', {
            slidesPerView: 3,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 0, // 지연 없음
                disableOnInteraction: false,
            },
            speed: 8000, // 매우 느린 속도
            allowTouchMove: false,
            simulateTouch: false,
            freeMode: {
                enabled: true,
                momentum: false,
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });

        // 호버 시 잠시 멈춤
        const menuContainer = document.querySelector('.menu-swiper-container');

        menuContainer.addEventListener('mouseenter', () => {
            menuSwiper.autoplay.stop();
        });

        menuContainer.addEventListener('mouseleave', () => {
            menuSwiper.autoplay.start();
        });
    }

    // 초기화
    createMenuSwiper();
});