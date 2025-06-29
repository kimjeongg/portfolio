// product.js 수정
$(function () {
  // 목데이터
  const mainProducts = [
    {
      img: "img/home_s_1.jpg",
      title: "BEST 홈카페 스타터 세트",
      subtitle: "입문자를 위한 커피빈 홈카페 풀구성",
      price: "89,000원",
      originalPrice: "129,000원",
      discount: "31%"
    },
    {
      img: "img/home_s_3.jpg",
      title: "핸드드립 브루잉 스타터 키트",
      subtitle: "홈카페 무드를 완성해줄 핸드드립 입문용 추천 세트",
      price: "23,800원",
      originalPrice: "32,000원",
      discount: "15%"
    },
    {
      img: "img/home_s_2.jpg",
      title: "티앤무드 티백 컬렉션 세트",
      subtitle: "다채로운 향과 블렌딩으로 품격을 높여줄 프리미엄 티 세트",
      price: "21,000원",
      originalPrice: "29,000원",
      discount: "27%"
    }
  ];

  const gridProducts = [
    {
      img: "img/home_4_1.jpg",
      title: "드립백 콜롬비아",
      subtitle: "다채로운 향과 블렌딩으로 품격을 높여줄 프리미엄 티 세트",
      price: "3,900원",
      originalPrice: "29,000원",
      button: "img/grid-1.jpg",
    },
    {
      img: "img/home_4_2.jpg",
      title: "드립백 콜롬비아",
      subtitle: "다채로운 향과 블렌딩으로 품격을 높여줄 프리미엄 티 세트",
      price: "3,900원",
      originalPrice: "29,000원",
      button: "img/grid-1.jpg",
    },
    {
      img: "img/home_4_3.jpg",
      title: "드립백 콜롬비아",
      subtitle: "다채로운 향과 블렌딩으로 품격을 높여줄 프리미엄 티 세트",
      price: "3,900원",
      originalPrice: "29,000원",
      button: "img/grid-1.jpg",
    },
    {
      img: "img/home_4_4.jpg",
      title: "드립백 콜롬비아",
      subtitle: "다채로운 향과 블렌딩으로 품격을 높여줄 프리미엄 티 세트",
      price: "3,900원",
      originalPrice: "29,000원",
      button: "img/grid-1.jpg",
    }
  ];

  // 메인 스와이퍼 생성
  function createMainSwiper() {
    const wrapper = document.getElementById('main-product-wrapper');

    mainProducts.forEach(product => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
                <img src="${product.img}" alt="${product.title}">
                <div class="product-info">
                    <div class="product-subtitle">${product.subtitle}</div>
                    <div class="product-title">${product.title}</div>
                    <div class="product-price">
                      <span class="original-price">${product.originalPrice}</span>
                      <div class="price-bottom">
                        <span class="discount">${product.discount}</span>
                        <span class="price">${product.price}</span>
                      </div>
                    </div>
                </div>
            `;
      wrapper.appendChild(slide);
    });

    // 스와이퍼 초기화
    new Swiper('.main-product-swiper', {
      slidesPerView: 1,
      spaceBetween: 0,
      /*  autoplay: {
           delay: 4000,
           disableOnInteraction: false,
       }, */
      pagination: {
        el: '.main-product-swiper .swiper-pagination',
        clickable: true,
      },
      loop: true,
    });
  }

  // 오른쪽 그리드 생성
  function createGrid() {
    gridProducts.forEach((product, index) => {
      const gridItem = document.getElementById(`grid-${index + 1}`);
      gridItem.innerHTML = `
                <img src="${product.img}" alt="${product.title}">
                <div class="item-info">
                    <div class="item-top">
                     <div class="item-subtitle">${product.subtitle}</div>
                    <div class="item-title">${product.title}</div>
                    </div>
                    <div class="item-bottom">
                    <div class="item-left">
                     <div class="item-price">${product.price}</div>
                      <div class="item-original-price">${product.originalPrice}</div>
                      </div>
                      <a class="item-button">
                        <img src="${product.button}" alt="자세히보기">
                        </a>
                    </div>
                    
                </div>
            `;
    });
  }

  // 초기화
  createMainSwiper();
  createGrid();
});