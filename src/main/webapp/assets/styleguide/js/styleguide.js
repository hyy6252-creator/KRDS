document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector(".style_wrapper")) {
    setTimeout(function () {
      startStyleGuide();
    }, 5000)
  } else {
    startStyleGuide();
  }
})

function startStyleGuide() { 
  initAosPage(); //aos
  new TextLineBreaker(); //줄바꿈
  initTableSystem(); //테이블
  horizPrcsScroll(); // 가로절차도
  responsListSlide(); // 리스트 슬라이드
  responseabSelect(); //4차탭
  responseabSlide(); //5차탭
  
  updateProcedureLayout(document);
    initTabEvents();

  initSearchFilter();
  initFileUploadInput();
  initGallerySlider();
  pe_tooltip.init();
}

// AOS
function initAosPage() {
  var aosPage = document.querySelector(".aos_wrap");
  if (aosPage) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', '/assets/styleguide/js/aos/aos.css');
    document.getElementsByTagName('head')[0].appendChild(link);
    var script = document.createElement('script');
    script.setAttribute('src', '/assets/styleguide/js/aos/aos.js');

    script.onload = function () {
      if (typeof AOS !== "undefined" && AOS.init) {
        AOS.init();
      }
    };

    // IE8~IE9에서도 onload 호환 처리 (필요시)
    script.onreadystatechange = function () {
      if (this.readyState === 'complete' || this.readyState === 'loaded') {
        if (typeof AOS !== "undefined" && AOS.init) {
          AOS.init();
        }
      }
    };

    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
// 줄바꿈 반응형
function TextLineBreaker() {
  this.createBr();
  var self = this;
  window.addEventListener("resize", function() {
    self.lineBreak();
  });
}
TextLineBreaker.prototype.createBr = function() {
  var ps = document.querySelectorAll("[data-role='text-line-break']");
  for (var i = 0; i < ps.length; i++) {
    var p = ps[i];
    var spans = p.getElementsByTagName("span");
    for (var k = 0; k < spans.length; k++) {
      if (k !== spans.length - 1) {
        var span = spans[k];
        var br = document.createElement("br");
        if (span.nextSibling) {
          span.parentNode.insertBefore(br, span.nextSibling);
        } else {
          span.parentNode.appendChild(br);
        }
      }
    }
  }
  this.lineBreak();
};
TextLineBreaker.prototype.lineBreak = function() {
  var ps = document.querySelectorAll("[data-role='text-line-break']");
  for (var i = 0; i < ps.length; i++) {
    var p = ps[i];
    var spans = p.getElementsByTagName("span");
    for (var k = 0; k < spans.length; k++) {
      var span = spans[k];
      var next = span.nextSibling;

      // br 태그만 처리
      while (next && next.nodeType !== 1) { // skip text nodes
        next = next.nextSibling;
      }

      if (next && next.tagName === "BR") {
        if (span.getClientRects().length > 1) {
          next.style.display = "none";
        } else {
          next.style.display = "block";
        }
      }
    }
  }
};

// 테이블 반응형
/**
 * 반응형 테이블 시스템 초기화 함수
 * @param {HTMLElement} container - 아작스로 불러온 영역 (생략 시 document)
 */
function initTableSystem(container) {
    // 대상 영역 설정 (Ajax 호출 시 해당 모달 컨테이너를 인자로 전달 가능)
    var target = container || document;
    var tables = target.querySelectorAll('.table');

    tables.forEach(function (table) {
        // 1. 중복 초기화 방지: 이미 초기화된 테이블은 스킵
        if (table.getAttribute('data-table-init') === 'true') return;

        var tableType = table.getAttribute('data-responsive');
        var breakpoint = parseInt(table.getAttribute('data-breakpoint') || 1024, 10);
        
        // 초기화 상태 기록
        table.setAttribute('data-table-init', 'true');
        // 현재 모바일 상태인지 저장하기 위한 변수 (객체 프로퍼티로 할당)
        table.isMobileState = false; 

        // 2. 타입별 초기화 분기
        if (tableType === 'scroll') {
            setupScrollTable(table, breakpoint);
        } else if (tableType === 'drop') {
            setupDropTable(table, breakpoint);
        } else if (tableType === 'layout') {
            setupLayoutTable(table, breakpoint);
        }
    });

    /**
     * [Scroll 타입] 가로 스크롤 및 스와이프 아이콘 처리
     */
    function setupScrollTable(table, breakpoint) {
        var wrapElement = document.createElement('div');
        wrapElement.className = 'table-responsive';

        var updateScroll = function () {
            if (window.innerWidth > breakpoint) {
                if (!table.isMobileState) return;
                table.isMobileState = false;

                // 원상복구
                if (wrapElement.parentNode) {
                    wrapElement.parentNode.insertBefore(table, wrapElement);
                    wrapElement.parentNode.removeChild(wrapElement);
                }
                table.classList.remove("mobile");
                table.style.width = "100%";
                
                var icon = wrapElement.querySelector(".swipe-icon");
                if (icon) icon.parentNode.removeChild(icon);
            } else {
                if (table.isMobileState) {
                    var icon = wrapElement.querySelector(".swipe-icon");
                    if (icon) icon.style.visibility = "visible";
                    return;
                }
                table.isMobileState = true;

                // 래퍼 적용
                table.parentNode.insertBefore(wrapElement, table);
                wrapElement.appendChild(table);
                table.classList.add("mobile");
                table.style.width = breakpoint + "px";

                // 스와이프 아이콘 생성
                var swipeIcon = document.createElement('div');
                swipeIcon.className = "swipe-icon";
                wrapElement.appendChild(swipeIcon);
            }
        };

        window.addEventListener('resize', updateScroll);
        updateScroll(); // 초기 실행

        wrapElement.addEventListener('click', function () {
            var icon = this.querySelector(".swipe-icon");
            if (icon) icon.style.visibility = "hidden";
        });
    }

    /**
     * [Drop 타입] 항목별 제목 생성 및 세로 배치
     */
    function setupDropTable(table, breakpoint) {
        var label = table.querySelectorAll("thead th");
        var ratio = table.getAttribute('data-ratio');

        var updateDrop = function () {
            if (window.innerWidth > breakpoint) {
                if (!table.isMobileState) return;
                table.isMobileState = false;
                table.classList.remove("mobile");
            } else {
                if (table.isMobileState) return;
                table.isMobileState = true;
                table.classList.add("mobile");

                // DOM 구조 변경 (th/td 내부를 wrapper로 감싸고 제목 삽입)
                var tr = table.querySelectorAll("tbody tr, tfoot tr");
                for (var j = 0; j < tr.length; j++) {
                    var td = tr[j].querySelectorAll('th, td');
                    for (var k = 0; k < td.length; k++) {
                        if (!td[k].querySelector('div.td-wrapper')) {
                            var title = document.createElement('strong');
                            title.className = 'td-title';
                            title.textContent = label[k] ? label[k].textContent : '';

                            var originalContent = td[k].innerHTML;
                            var wrapper = document.createElement('div');
                            wrapper.className = 'td-wrapper';
                            wrapper.innerHTML = originalContent;

                            td[k].innerHTML = '';
                            td[k].appendChild(title);
                            td[k].appendChild(wrapper);

                            if (ratio) {
                                title.style.width = ratio + '%';
                            }
                        }
                    }
                }
            }
        };

        window.addEventListener('resize', updateDrop);
        updateDrop(); // 초기 실행
    }

    /**
     * [Layout 타입] 단순히 모바일 클래스만 제어
     */
    function setupLayoutTable(table, breakpoint) {
        var updateLayout = function () {
            if (window.innerWidth > breakpoint) {
                if (!table.isMobileState) return;
                table.isMobileState = false;
                table.classList.remove("mobile");
            } else {
                if (table.isMobileState) return;
                table.isMobileState = true;
                table.classList.add("mobile");
            }
        };

        window.addEventListener('resize', updateLayout);
        updateLayout(); // 초기 실행
    }
}

// 최초 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    initTableSystem();
});

$(document).ajaxComplete(function(event, xhr, settings) {
    // 아작스로 어떤 페이지든 로드가 완료되면 실행
    initTableSystem(); 
});

// 가로형 절차도 스크롤트리거
function horizPrcsScroll() {
  var horizPrcsItems = document.querySelectorAll(".process_wrap.type02 .prc .item");

  var itemsArray = [];
  for (var i = 0; i < horizPrcsItems.length; i++) {
    itemsArray.push(false);
  }

  var itemIndex = -1;
  var scrollTarget = window;

  function getElementPageTop(el) {
    var top = 0;
    while (el) {
      top += el.offsetTop;
      el = el.offsetParent;
    }
    return top;
  }

  scrollTarget.addEventListener("scroll", function () {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    for (var i = 0; i < horizPrcsItems.length; i++) {
      var viewportCenter = scrollY + viewportHeight / 2;
      var elTop = getElementPageTop(horizPrcsItems[i]);
      var elBottom = elTop + horizPrcsItems[i].offsetHeight;

      if (itemIndex !== i && viewportCenter >= elTop && viewportCenter <= elBottom) {
        for (var j = 0; j < horizPrcsItems.length; j++) {
          horizPrcsItems[j].className = horizPrcsItems[j].className.replace(/\bactive\b/, '');
        }

        if (horizPrcsItems[i].className.indexOf("active") === -1) {
          horizPrcsItems[i].className += " active";
        }

        itemIndex = i;
      }
    }
  });
}

// 리스트 컴포넌트 이미지 슬라이드
function responsListSlide() {
  var listSwiper = new Swiper('.listSlide', {
    loop: true,
    navigation: {
    nextEl: '.listSlide .next',
    prevEl: '.listSlide .prev',
    },
    slidesPerView: 1
  });
}

// 4차 탭메뉴 반응형 셀렉트창 (type2 전용)
function responseabSelect() {
  var tabSelects = document.querySelectorAll(".tab-select");
  if (!tabSelects.length) return;

  for (var i = 0; i < tabSelects.length; i++) {
    var tab = tabSelects[i];
    var tabUl = tab.querySelector(".tab-ul.type2");
    if (!tabUl) return; // type2 없으면 패스

    var responsive = parseInt(tab.getAttribute('data-responsive'), 10) || 769;

    function checkResize(tabEl, responsiveVal) {
      if (window.innerWidth < responsiveVal) {
        tabEl.classList.add("mobile-select");
      } else {
        tabEl.classList.remove("mobile-select");
      }
    }

    // 즉시 실행 및 이벤트 등록 시, 인자로 전달 (클로저 문제 방지)
    checkResize(tab, responsive);

    // IE는 클로저 안에서 i 값 유지가 안 되므로, 인자로 넘기기
    (function(tabEl, responsiveVal) {
      window.addEventListener("load", function () {
        checkResize(tabEl, responsiveVal);
      });
      window.addEventListener("resize", function () {
        checkResize(tabEl, responsiveVal);
      });
    })(tab, responsive);

    if (!tab.querySelector(".tab-select-title")) {
      var activeLi = tabUl.querySelector("li.active");
      var sel_text;
      if (activeLi) {
        sel_text = activeLi.innerText || activeLi.textContent || "선택";
      } else {
        sel_text = "선택";
      }

      // 템플릿 리터럴 → 문자열 연결
      tab.insertAdjacentHTML("afterbegin",
        '<button type="button" class="tab-select-title" title="리스트 선택 열림"><span>' + sel_text + '</span></button>'
      );

      var titleBtn = tab.querySelector(".tab-select-title");
      titleBtn.addEventListener("click", function () {
        // classList.toggle()은 IE11에서 대부분 동작하지만, 확실히 하려면 아래처럼 수동 처리도 가능
        if (this.classList.contains("active")) {
          this.classList.remove("active");
        } else {
          this.classList.add("active");
        }
      });
    }

  }
}

// 5차 탭메뉴 반응형 슬라이드 (type3 전용)
function responseabSlide() {
  var tabSelects = document.querySelectorAll(".tab-select");
  if (!tabSelects.length) return;

  function initSlide(slideTabSelect) {
    var tabUl = slideTabSelect.querySelector(".tab-ul.type3");
    if (!tabUl) return; // type3 없으면 건너뛰기

    var tabLis = tabUl.querySelectorAll("li");
    var isInited = slideTabSelect.getAttribute("data-swiper-init") === "true";

    // for(var i=0; i<tabSelects.length; i++){
    //   tabSelects[i].classList.add("hastype3");
    // }

    if (window.innerWidth < 769) {
      var totalWidth = 0;
      for (var i = 0; i < tabLis.length; i++) {
        totalWidth += tabLis[i].offsetWidth;
      }

      if (totalWidth > slideTabSelect.offsetWidth) {
        if (!isInited) {
          // swiper용 클래스 붙이기
          for (var i = 0; i < tabLis.length; i++) {
            tabLis[i].classList.add("swiper-slide");
          }
          slideTabSelect.classList.add("swiper");
          slideTabSelect.classList.add("tabSlide");
          slideTabSelect.classList.add("hastype3");
          tabUl.classList.add("swiper-wrapper");

          // 버튼 없으면 생성
          if (!slideTabSelect.querySelector(".btn.prev")) {
            var prev = document.createElement("button");
            prev.className = "btn prev";
            prev.textContent = "이전";
            slideTabSelect.appendChild(prev);
          }
          if (!slideTabSelect.querySelector(".btn.next")) {
            var next = document.createElement("button");
            next.className = "btn next";
            next.textContent = "다음";
            slideTabSelect.appendChild(next);
          }

          // Swiper 초기화
          slideTabSelect._swiper = new Swiper(slideTabSelect, {
            slidesPerView: "auto",
            freeMode: true,
            navigation: {
              nextEl: slideTabSelect.querySelector(".btn.next"),
              prevEl: slideTabSelect.querySelector(".btn.prev"),
            },
            watchOverflow: true
          });

          slideTabSelect.setAttribute("data-swiper-init", "true");
        }
      } else {
        if (isInited) destroySwiper(slideTabSelect, tabUl, tabLis);
      }
    } else {
      if (isInited) destroySwiper(slideTabSelect, tabUl, tabLis);
    }
  }

  function destroySwiper(slideTabSelect, tabUl, tabLis) {
    for (var i = 0; i < tabLis.length; i++) {
      tabLis[i].classList.remove("swiper-slide", "swiper-slide-active", "swiper-slide-next");
    }
    slideTabSelect.classList.remove("swiper");
    slideTabSelect.classList.remove("tabSlide");
    slideTabSelect.classList.remove("hastype3");
    tabUl.classList.remove("swiper-wrapper");

    if (slideTabSelect._swiper) {
      slideTabSelect._swiper.destroy(true, true);
      delete slideTabSelect._swiper;
    }

    var prev = slideTabSelect.querySelector(".btn.prev");
    var next = slideTabSelect.querySelector(".btn.next");
    if (prev && prev.parentNode) {
      prev.parentNode.removeChild(prev);
    }
    if (next && next.parentNode) {
      next.parentNode.removeChild(next);
    }
    slideTabSelect.setAttribute("data-swiper-init", "false");
  }

  function handleAll() {
    for (var i = 0; i < tabSelects.length; i++) {
      initSlide(tabSelects[i]);
    }
  }

  window.addEventListener("load", handleAll);
  window.addEventListener("resize", handleAll);
}


// 절차도 s
function updateProcedureLayout(container) {
    var containers = container === document ? [document] : [container];
    
    for (var c = 0; c < containers.length; c++) {
        // [1] 대상이 되는 리스트(ul)들을 찾음
        var prcLists = containers[c].querySelectorAll('[data-role*="procedure-height"]');
        
        for (var i = 0; i < prcLists.length; i++) {
            var ul = prcLists[i];
            if (ul.offsetWidth <= 0) continue; 

            // [핵심 수정] ul의 직계 자식이든, 중첩된 구조든 '해당 ul 소속' li만 정확히 필터링
            var allChildLis = ul.getElementsByTagName('li');
            var lis = [];
            for (var j = 0; j < allChildLis.length; j++) {
                // closest를 사용하여 가장 가까운 부모 ul이 현재 ul인 경우만 담음
                // IE11 대응을 위해 closest가 없다면 parentNode 체크 방식 사용
                var parentUl = allChildLis[j].parentElement;
                while(parentUl && parentUl.tagName !== 'UL') {
                    parentUl = parentUl.parentElement;
                }
                if (parentUl === ul) {
                    lis.push(allChildLis[j]);
                }
            }

            // li를 아예 못 잡는 경우를 대비한 체크
            if (lis.length === 0) {
                console.warn("li 요소를 찾지 못했습니다. 구조를 확인하세요.");
                continue;
            }

            var titles = ul.querySelectorAll('.prc__title');
            var breakPoint = 200; 

            // [2] 초기화 및 원본 컬럼 확인
            for (var j = 0; j < lis.length; j++) { lis[j].style.height = ''; }
            for (var k = 0; k < titles.length; k++) { titles[k].style.height = ''; }
            
            if (!ul.getAttribute('data-origin-col')) {
                var match = ul.className.match(/col(\d+)/);
                if (match) ul.setAttribute('data-origin-col', match[1]);
            }
            
            var originColNum = parseInt(ul.getAttribute('data-origin-col')) || 1;
            var possibleCols = Math.max(1, Math.min(Math.floor(ul.offsetWidth / breakPoint), originColNum));

            // [3] 컬럼 클래스 교체 (필요 시)
            var currentMatch = ul.className.match(/col(\d+)/);
            var currentColNum = currentMatch ? parseInt(currentMatch[1]) : originColNum;

            if (currentColNum !== possibleCols) {
                ul.className = ul.className.replace(/col\d+/, 'col' + possibleCols);
                setTimeout(function() { updateProcedureLayout(container); }, 50);
                return;
            }

            // [4] 타이틀 높이 동기화
            var maxTitleH = 0;
            for (var t = 0; t < titles.length; t++) {
                if (titles[t].offsetHeight > maxTitleH) maxTitleH = titles[t].offsetHeight;
            }
            for (var t = 0; t < titles.length; t++) { titles[t].style.height = maxTitleH + 'px'; }

            // [5] 행(Row)별 높이 동기화 (강제 인덱스 방식)
            for (var l = 0; l < lis.length; l += possibleCols) {
                var rowItems = [];
                var maxH = 0;

                for (var m = 0; m < possibleCols; m++) {
                    var targetLi = lis[l + m];
                    if (targetLi) {
                        rowItems.push(targetLi);
                        var h = targetLi.offsetHeight;
                        if (h > maxH) maxH = h;
                    }
                }

                // 스타일 직접 주입 (important 포함)
                for (var n = 0; n < rowItems.length; n++) {
                    rowItems[n].style.setProperty('height', maxH + 'px', 'important');
                }
            }
        }
    }
}
// 탭 클릭 이벤트
function initTabEvents() {
    var tabs = document.querySelectorAll('.ui-tabs_link');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var target = document.querySelector(this.getAttribute('href'));
            setTimeout(function() {
                if (target) updateProcedureLayout(target);
            }, 200); // 탭 전환 대기
        });
    });
}

// 리사이즈 이벤트 (Throttle 적용)
var resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        updateProcedureLayout(document);
    }, 150);
});
// 절차도 e

/* 검색 필터 */
function initSearchFilter() {
  // 옵션 열고 닫기
  var html = document.querySelector('html');
  var openButton = document.querySelector('.search-list-top .sch-sort .btn.ico-filter');
  var filterBox = document.querySelector('.search-top-box');
  var closeButton = document.querySelector('.sch-filter-box .search-top-close');
  var filterChip = document.querySelector('.sch-filter-box .filter-chip');
  
  if (filterChip) {
    filterBox.className += ' is-filter-chip'; // classList 대신 className 사용
  }
  
  if (openButton) {
    openButton.addEventListener('click', function () {
      filterBox.className += ' active'; // classList 대신 className 사용
      html.className += ' content-modal-opened-m'; // classList 대신 className 사용
    });
  }
  
  if (closeButton) {
    closeButton.addEventListener('click', function () {
      filterBox.className = filterBox.className.replace(' active', ''); // classList 대신 className 사용
      html.className = html.className.replace(' content-modal-opened-m', ''); // classList 대신 className 사용
    });
  }

  // 디테일
  var detailContainer = document.querySelector('.search-top-box.detail-type');
  var openDetailButton = document.querySelector('.search-top-box .sch-filter-btn.open-detail');
  var closeDetailButton = document.querySelector('.search-top-box .sch-filter-btn.close-detail');
  
  if (openDetailButton) {
    openDetailButton.addEventListener('click', function (e) {
      var target = e.target.closest('.sch-filter-btn'); // IE11에서 closest()가 지원되지 않으므로 polyfill 필요
      if (!target) return;
      detailContainer.className += ' detail-open'; // classList 대신 className 사용
      target.className = target.className.replace(' show', ''); // classList 대신 className 사용
      closeDetailButton.className += ' show'; // classList 대신 className 사용
    });
  }
  
  if (closeDetailButton) {
    closeDetailButton.addEventListener('click', function (e) {
      var target = e.target.closest('.sch-filter-btn'); // IE11에서 closest()가 지원되지 않으므로 polyfill 필요
      if (!target) return;
      detailContainer.className = detailContainer.className.replace(' detail-open', ''); // classList 대신 className 사용
      target.className = target.className.replace(' show', ''); // classList 대신 className 사용
      openDetailButton.className += ' show'; // classList 대신 className 사용
    });
  }

  // 모바일 아코디언
  var toggles = document.querySelectorAll(".search-top-box .item-toggle");
  if (toggles.length > 0) {
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener("click", function () {
        var box = this.closest(".filter-form-box"); // IE11에서 closest()가 지원되지 않으므로 polyfill 필요
        box.className = box.className.indexOf("not-open") === -1 ? box.className + " not-open" : box.className.replace(" not-open", ""); // classList 대신 className 사용
      });
    }
  }

  // 고급검색
  var advancedToggle = document.querySelector('.top-search-input .advanced-toggle');
  var advancedSearchBox = document.querySelector('.advanced-search-box');
  if (advancedToggle) {
    advancedToggle.addEventListener('click', function () {
      if (advancedSearchBox.className.indexOf('active') !== -1) {
        advancedSearchBox.className = advancedSearchBox.className.replace(' active', ''); // classList 대신 className 사용
        advancedToggle.setAttribute('title', '고급검색 열기');
      } else {
        advancedSearchBox.className += ' active'; // classList 대신 className 사용
        advancedToggle.setAttribute('title', '고급검색 닫기');
      }
    });
  }
}

/* 파일 업로드 세팅 */
function initFileUploadInput() {
  var fileUploadInputs = document.querySelectorAll('.file-upload-box .file-input');
  if (fileUploadInputs.length > 0) {
    for (var i = 0; i < fileUploadInputs.length; i++) {
      fileUploadInputs[i].addEventListener('change', function (e) {
        var input = e.target;
        if (!input) return;
        var formBox = e.target.closest('.file-upload-box'); // closest() polyfill 필요
        if (!formBox) return;
        
        // 파일 이름 추출
        var fileName = input.value.split('/').pop().split('\\').pop();
        
        var nameInput = formBox.querySelector('.name-input');
        if (nameInput) {
          nameInput.value = fileName;
        }
      });
    }
  }
}


/* 갤러리 슬라이더 */
function initGallerySlider() {
  var containers = document.querySelectorAll('.pe-gallery');

  for (var i = 0; i < containers.length; i++) {
    (function(idx) {
      var container = containers[idx];
      var mainSliderEl = container.querySelector('.slider');
      var thumbSliderEl = container.querySelector('.thumb');
      var isType2 = container.classList.contains('type2');

      if (!mainSliderEl) return;

      var galleryThumbs = null;
      var gallerySlider = null;

      // 1. 썸네일 슬라이더
      if (thumbSliderEl) {
        var thumbOptions = {
          slidesPerView: 3,
          spaceBetween: 15,
          loop: true,
          loopedSlides: 6,
          direction: 'horizontal',
          slideToClickedSlide: false,
          watchSlidesProgress: true,
          breakpoints: {
            0: { direction: "horizontal", slidesPerView: 2, centeredSlides: false, },
            500: { direction: "horizontal", slidesPerView: 3, centeredSlides: true },
            769: { direction: 'vertical' }
          },
          on: {
            init: function() { handleA11y(this); },
            transitionEnd: function() { handleA11y(this); },
            click: function() {
              if (this.clickedIndex === undefined) return;
              var clickedSlide = this.slides[this.clickedIndex];
              var realIdx = clickedSlide.getAttribute('data-swiper-slide-index');
              if (realIdx !== null && gallerySlider) {
                gallerySlider.slideToLoop(parseInt(realIdx));
              }
            }
          }
        };

        if (isType2) {
          // .type2 (하단 가로 썸네일) 버전용 옵션으로 수정/대체합니다.
          // 기존 로직(수동 동기화)을 그대로 사용하기 위해 loop 관련 설정은 유지합니다.
          thumbOptions.direction = 'horizontal';
          thumbOptions.freeMode = true;
          thumbOptions.slidesPerView = 2; // 기본값 (1280px 이상)
          thumbOptions.spaceBetween = 16;
          thumbOptions.breakpoints = {
            769: { slidesPerView: 4, spaceBetween: 10 },
            541: { slidesPerView: 3 },
          };
        }

        galleryThumbs = new Swiper(thumbSliderEl, thumbOptions);

        // 네비게이션 포커스 시 이동
        thumbSliderEl.addEventListener('focusin', function(e) {
          var slide = e.target.closest('.swiper-slide');
          if (slide && !slide.classList.contains('swiper-slide-duplicate') && galleryThumbs) {
            var slideIndex = Array.from(galleryThumbs.slides).indexOf(slide);
            galleryThumbs.slideTo(slideIndex);
          }
        });
      }

      // 2. 메인 슬라이더
      gallerySlider = new Swiper(mainSliderEl, {
        slidesPerView: 1,
        loop: true,
        loopedSlides: 6,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: container.querySelector('.swiper-btn-next'),
          prevEl: container.querySelector('.swiper-btn-prev'),
        },
        on: {
          init: function() { updateCustomPagination(this, container); },
          slideChange: function() {
            updateCustomPagination(this, container);
            if (galleryThumbs) galleryThumbs.slideToLoop(this.realIndex);
          }
        }
      });

      // 3. [수정] 재생/정지 토글 버튼 기능
      var toggleBtn = container.querySelector('.swiper-btn-toggle');
      if (toggleBtn) {
        // 초기 상태 설정: 자동 재생 중이므로 playing 클래스 추가 및 텍스트 '정지'
        toggleBtn.classList.add('playing');
        toggleBtn.textContent = '정지'; 

        toggleBtn.addEventListener('click', function() {
          if (gallerySlider.autoplay.running) {
            // 재생 중일 때 클릭 -> 정지 시킴
            gallerySlider.autoplay.stop();
            this.textContent = '재생';
            this.classList.remove('playing'); // [요청사항] playing 클래스 제거
          } else {
            // 정지 중일 때 클릭 -> 다시 재생
            gallerySlider.autoplay.start();
            this.textContent = '정지';
            this.classList.add('playing');    // [요청사항] playing 클래스 추가
          }
        });
      }

      // 키보드 엔터 대응
      if (thumbSliderEl) {
        thumbSliderEl.addEventListener('keydown', function(e) {
          if (e.keyCode === 13) {
            var slide = e.target.closest('.swiper-slide');
            if (slide && gallerySlider) {
              var realIdx = slide.getAttribute('data-swiper-slide-index');
              gallerySlider.slideToLoop(parseInt(realIdx));
            }
          }
        });
      }
    })(i);
  }
}

/**
 * 접근성 및 에러 방지 순회 함수
 */
function handleA11y(swiper) {
  if (!swiper || !swiper.slides) return;
  var slides = Array.from(swiper.slides);
  slides.forEach(function(slide) {
    if (slide && slide.classList) {
      if (slide.classList.contains('swiper-slide-duplicate')) {
        slide.setAttribute('tabindex', '-1');
        slide.setAttribute('aria-hidden', 'true');
      } else {
        slide.setAttribute('tabindex', '0');
        slide.setAttribute('aria-hidden', 'false');
      }
    }
  });
}

/**
 * 페이지네이션 및 불렛 업데이트
 */
function updateCustomPagination(swiper, container) {
  var currentEl = container.querySelector('.swiper-pagination-current');
  var totalEl = container.querySelector('.swiper-pagination-total');
  var bulletsEl = container.querySelector('.swiper-bullets');

  if (!swiper || !swiper.slides) return;

  var realSlides = Array.from(swiper.slides).filter(function(slide) { 
    return slide && slide.classList && !slide.classList.contains('swiper-slide-duplicate');
  });
  var realCount = realSlides.length;

  if (currentEl) currentEl.textContent = swiper.realIndex + 1;
  if (totalEl) totalEl.textContent = realCount;

  if (bulletsEl) {
    if (bulletsEl.children.length !== realCount) {
      bulletsEl.innerHTML = '';
      for (var i = 0; i < realCount; i++) {
        var bullet = document.createElement('button');
        bullet.type = 'button';
        bullet.className = 'swiper-bullet';
        bullet.setAttribute('aria-label', (i + 1) + '번 슬라이드로 이동');
        bullet.innerHTML = '<span class="tit">' + (i + 1) + '</span>';
        (function(targetIdx) {
          bullet.addEventListener('click', function() { swiper.slideToLoop(targetIdx); });
        })(i);
        bulletsEl.appendChild(bullet);
      }
    }
    var dots = bulletsEl.querySelectorAll('.swiper-bullet');
    dots.forEach(function(btn, idx) {
      btn.classList.toggle('active', idx === swiper.realIndex);
    });
  }
}


// function initGallerySlider() {
//   var peGallery = document.querySelectorAll('.pe-gallery');
//   if (peGallery.length > 0) {
//     // 썸네일 슬라이더 설정
//     var galleryThumbs = new Swiper('.pe-gallery .thumb', {
//       slidesPerView: 3,
//       spaceBetween: 15,
//       centeredSlides: false,
//       centeredSlidesBounds: true,
//       loop: true,
//       loopedSlides: 6,
//       watchSlidesProgress: true,
//       slideToClickedSlide: true,
//       direction: 'horizontal',
//       breakpoints: {
//         0: {
//           direction: "horizontal",
//           slidesPerView: 2,
//           centeredSlides: false,
//         },
//         500: {
//           direction: "horizontal",
//           slidesPerView: 3,
//           centeredSlides: true,
//         },
//         768: {
//           direction: "vertical",
//         }
//       }
//     });

//     // 메인 슬라이더 설정
//     var gallerySlider = new Swiper('.pe-gallery .slider', {
//       slidesPerView: 1,
//       loop: true,
//       loopedSlides: 6,
//       effect: 'fade',
//       autoplay: {
//         delay: 4500,
//         disableOnInteraction: false,
//       },
//       navigation: {
//         nextEl: '.swiper-btn-next',
//         prevEl: '.swiper-btn-prev',
//       },
//       pagination: {
//         el: ".swiper-pagination",
//         type: "fraction",
//       },
//     });

//     gallerySlider.controller.control = galleryThumbs;
//     galleryThumbs.controller.control = gallerySlider;

//     // 재생/정지 버튼
//     var toggleBtn = document.querySelector('.swiper-btn-toggle');
//     if (toggleBtn) {
//       toggleBtn.addEventListener('click', function () {
//         if (toggleBtn.className.indexOf('playing') !== -1) {
//           gallerySlider.autoplay.stop();
//           toggleBtn.className = toggleBtn.className.replace(' playing', ''); // classList 대신 className 사용
//           toggleBtn.textContent = '재생';
//         } else {
//           gallerySlider.autoplay.start();
//           toggleBtn.className += ' playing'; // classList 대신 className 사용
//           toggleBtn.textContent = '정지';
//         }
//       });
//     }
//   }
// }



// tooltip
var windowSize = {
  winSize: null,
  breakPoint: 1024,
  setWinSize: function () {
    this.winSize = window.innerWidth >= this.breakPoint ? "pc" : "mob";
  },
  getWinSize: function () {
    return this.winSize;
  }
};

var pe_tooltip = {
  tooltip: null,
  isMobile: null,

  init: function () {
    this.tooltip = document.querySelectorAll(".pe-tooltip");
    this.isMobile = windowSize.getWinSize() === "mob";
    if (this.tooltip.length) {
      this.setupTooltips();
      this.setupGlobalEvents();
    }
  },

  setupTooltips: function () {
    for (var a = 0; a < this.tooltip.length; a++) {
      var t = this.tooltip[a];
      var s = t.getAttribute("data-tooltip");
      var i = t.hasAttribute("disabled");

      if (s && !i && !t.classList.contains("page-top-button")) {
        var id = "tooltip-popover-" + a + Math.random().toString(36).substring(2, 9);
        var label = t.innerText;

        t.setAttribute("aria-labelledby", id);

        var e = this.createTooltipPopover(id, label, s);
        t.parentNode.insertBefore(e, t.nextSibling);

        this.registerEvents(t, this.showTooltip.bind(this, t, e));

        document.addEventListener("keydown", function (e) {
          var key = e.key || e.keyCode;
          if (key === "Escape" || key === "Esc" || key === 27) {
            pe_tooltip.closeAllTooltips();
          }
        });
      }
    }
  },

  createTooltipPopover: function (id, label, content) {
    var s = document.createElement("div");
    s.className = "pe-tooltip-popover";
    s.setAttribute("id", id);
    s.setAttribute("aria-hidden", "true");

    s.innerHTML = '<span class="sr-only">' + label + '</span>' + content;
    return s;
  },

  registerEvents: function (el, handler) {
    el.addEventListener("mouseover", handler);
    el.addEventListener("mouseout", this.closeAllTooltips);
    el.addEventListener("focus", handler);
    el.addEventListener("focusout", this.closeAllTooltips);
  },

  showTooltip: function (el, tooltipEl) {
    if (el.className.indexOf("tooltip-box") !== -1) {
      tooltipEl.classList.add("tooltip-box");
    }
    if (el.className.indexOf("tooltip-vertical") !== -1) {
      tooltipEl.classList.add("tooltip-vertical");
    }
    tooltipEl.classList.add("active");

    var pos = this.calculateTooltipPosition(el, tooltipEl);
    var isSmallScreen = window.innerWidth <= 420;

    tooltipEl.style.top = pos.top + "px";
    tooltipEl.style.left = isSmallScreen ? "50%" : pos.left + "px";
  },

  closeAllTooltips: function () {
    var tooltips = document.querySelectorAll(".pe-tooltip-popover");
    for (var i = 0; i < tooltips.length; i++) {
      var el = tooltips[i];
      if (el.className.indexOf("active") !== -1) {
        el.removeAttribute("style");
        el.className = "pe-tooltip-popover";
      }
    }
  },

  calculateTooltipPosition: function (el, tooltipEl) {
    var a = tooltipEl.clientHeight;
    var s = tooltipEl.clientWidth;

    var rect = el.getBoundingClientRect();
    var i = rect.top;
    var r = rect.left;
    var l = rect.right;
    var n = rect.height;
    var o = rect.width;

    var d = window.innerWidth / 2;
    var c = window.innerHeight / 2;

    var p, u;

    var elClass = el.className;

    if (this.isMobile || elClass.indexOf("tooltip-box") !== -1 || elClass.indexOf("tooltip-vertical") !== -1) {
      if (c < i + n) {
        p = i - a - 12;
        tooltipEl.classList.add("top");
      } else {
        p = i + n + 12;
        tooltipEl.classList.add("bottom");
      }

      if (d < r + o) {
        u = l - s;
        tooltipEl.classList.add("right");

        if (window.innerWidth - (r + o) > s / 2) {
          u = r + (o - s) / 2;
          tooltipEl.classList.remove("right");
        }
      } else {
        u = r + (o - s) / 2;
        if (u < 0) {
          u = r;
          tooltipEl.classList.add("left");
        } else {
          tooltipEl.classList.remove("left");
        }
      }
    } else {
      p = i + (n - a) / 2;
      if (d < r + o) {
        u = r - s - 12;
        tooltipEl.classList.add("right");
      } else {
        u = l + 12;
        tooltipEl.classList.remove("right");
      }
    }

    return { top: p, left: u };
  },

  setupGlobalEvents: function () {
    var self = this;
    window.addEventListener("scroll", function () {
      self.closeAllTooltips();
    });

    window.addEventListener("resize", function () {
      self.isMobile = windowSize.getWinSize() === "mob";
      self.closeAllTooltips();
    });
  }
};
