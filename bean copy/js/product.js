document.addEventListener("DOMContentLoaded", function () {
  const products = [
    { img: "img/drip.jpg", subtitle: "드립백", title: "커피빈 디카페인 드립백 5t", origin: "5,000원", sale: "29%", price: "4,000원" },
    { img: "img/powder.jpg", subtitle: "파우더 커피", title: "커피빈 바닐라 라떼 12T", origin: "5,000원", sale: "48%", price: "3,900원" },
    { img: "img/pack.jpg", subtitle: "커피 파우치", title: "디카페인 아메리카노 파우치 10t  ", origin: "5,000원", sale: "27%", price: "11,000원" },
    { img: "img/capsul.jpg", subtitle: "캡슐 커피", title: "[네스프레소]<br> 콜롬비아 다크 10t", origin: "5,000원", sale: "29%", price: "7,500원" },
    { img: "img/drip.jpg", subtitle: "드립백", title: "커피빈 디카페인 드립백 5t", origin: "5,000원", sale: "29%", price: "4,000원" },
    { img: "img/powder.jpg", subtitle: "파우더 커피", title: "커피빈 바닐라 라떼 12T", origin: "5,000원", sale: "48%", price: "3,900원" },
    { img: "img/pack.jpg", subtitle: "커피 파우치", title: "디카페인 아메리카노 파우치 10t  ", origin: "5,000원", sale: "27%", price: "11,000원" },
    { img: "img/capsul.jpg", subtitle: "캡슐 커피", title: "[네스프레소] 콜롬비아 다크 10t", origin: "5,000원", sale: "29%", price: "7,500원" },
  ];

  // 4개씩 묶어서 슬라이드 생성 (각 슬라이드에 2x2 그리드)
  const slides = [];
  for (let i = 0; i < products.length; i += 4) {
    const group = products.slice(i, i + 4);
    slides.push(`
      <div class="swiper-slide">
        <div class="product-grid">
          ${group.map(prod => `
            <div class="product-card">
              <img src="${prod.img}" alt="">
              <div class="prod-info">
            
                <div class="prod-top">
                 <div class="prod-subtitle">${prod.subtitle}</div>
                 <div class="prod-title">${prod.title}</div>
                </div>
                <div class="prod-price-wrap">
                  <span class="prod-origin">${prod.origin}</span>
                    <div class="prod-price-wrap-txt">
                     <span class="prod-sale">${prod.sale}</span>
                     <span class="prod-cost">${prod.price}</span>
                    </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `);
  }

  document.getElementById("product-swiper-wrapper").innerHTML = slides.join('');

  new Swiper('.product-swiper', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 0,
    pagination: {
      el: '.product-swiper .swiper-pagination',
      clickable: true,
      type: 'progressbar'
    },
    loop: true,
      autoplay: {
        delay: 1500,
        disableOnInteraction: false
      }
  });
});