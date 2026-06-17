////////////////////////////////////////
//  프로젝트 모든 사업소 레이아웃 공통
////////////////////////////////////////

////////////////////////////////////////
////// 스크롤매니저 ver1.2
const scrollManager = {
  _scrollY: 0,
  _lastScrollY: 0,

	setBodyWidth() {
		document.documentElement.style.setProperty('--body-width', document.body.offsetWidth + 'px');
	},

	updateBodyWidth: throttle(function() {
		this.setBodyWidth.call(this);
	}, 50),

  updateValues() {
    this._scrollY = window.scrollY;
  },

  updateDirection() {
    const $wrap = document.querySelector("html");
		const $header = document.querySelector("#top_layout");
    if ($wrap && $header) {
      const _headerHeight = $header.scrollHeight;
      const _scrollY = window.scrollY;
      const _scrollDown = _scrollY > this._lastScrollY;
      const _scrollUp = _scrollY < this._lastScrollY;

      if (_scrollY > _headerHeight + 50 && _scrollDown) {
        $wrap.classList.add("scroll-down");
        $wrap.classList.remove("scroll-up");
      } else if (_scrollY > _headerHeight + 50 && _scrollUp) {
        $wrap.classList.add("scroll-up");
        $wrap.classList.remove("scroll-down");
      } else {
        $wrap.classList.remove("scroll-down", "scroll-up");
      }

      this._lastScrollY = _scrollY;
    }
  },
	
  updateIsFixed() {
    const $header = document.querySelector("#top_layout");
		const $body = document.querySelector("body");
    if (!$header) return;
    if (this._scrollY > 50) {
      $header.classList.add("is-fixed");
			$body.classList.add("is-header-fixed");
    } else {
      $header.classList.remove("is-fixed");
			$body.classList.remove("is-header-fixed");
    }
  },

  getScrollY() {
    return this._scrollY;
  },

	update: throttle(function() {
		this.updateDirection.call(this);
		this.updateValues.call(this);
    this.updateIsFixed.call(this);
	}, 50),

};

////////////////////////////////////////
////// GNB 위치 조정
if ($(".header-wrap").attr("data-header-type") == "header-2")	$("#gnb").insertAfter(".header-wrap .util-wrap");


////////////////////////////////////////
////// GNB 타입-1
;(function(){
	var $body = $("body");
	var $topLayout = $("#top_layout");
	var $headerWrap = $topLayout.find(".header-wrap");
	var	$gnb = $("#gnb");
	var gnbType = $gnb.attr("data-gnb-type") || "gnb-1";
	if (gnbType != "gnb-1") return;
	$body.append('<div class="gnb-backdrop"></div>');
	$headerWrap.append('<div class="gnb-bg"><div class="layout"></div></div>');
	var $gnbBg = $headerWrap.find(".gnb-bg");
	var $depth1Ul = $gnb.find(".depth1-ul");
	var $depth1Li = $gnb.find(".depth1-ul > li");
	var $depth1Content = $gnb.find(".depth1-content");
	var $depth2Li = $gnb.find(".depth2-ul > li");
	var $depth2Btn = $gnb.find(".depth2-btn");

	///// GNB 열기
	$depth1Li.on("mouseenter focusin", function () {
		$body.addClass("is-gnb-hover");
		$gnb.addClass("is-hover");
		$depth1Li.removeClass("is-hover");
		$(this).addClass("is-hover");
		var contentHeight = $(this).find(".depth1-content > .layout").outerHeight();
		$depth1Content.css("height",contentHeight);
		$gnbBg.css("height",contentHeight);
	});
	
	///// GNB 닫기
	function gnbClose() {
		$gnb.removeClass("is-hover");
		$gnbBg.css("height", "0");
		$depth1Li.removeClass("is-hover");
		$depth1Content.css("height", "0");
		$body.removeClass("is-gnb-hover");
	}
	$("#gnb, #top_layout .gnb-bg").on("mouseleave", gnbClose);

	///// DEPTH2 호버, 포커스인
	$depth2Li.on("mouseenter focusin", function () {
		$depth2Btn.removeClass("active");
		$(this).find(".depth2-btn").addClass("active");
	});
	$depth2Li.on("mouseleave focusout", function () {
		$depth2Btn.removeClass("active");
	});
	

	///// GNB 포커스아웃 처리
	var firstFocusable = $depth1Ul.find('a:first');
	var lastFocusable = $depth1Ul.find('a:last');
	firstFocusable.on('keydown', function(e) {
		if (e.keyCode === 9 && e.shiftKey) gnbClose();
	});
	lastFocusable.on('keydown', function(e) {
		if (e.keyCode === 9 && !e.shiftKey) gnbClose();
	});

})();


////////////////////////////////////////
////// GNB 타입-2
;(function() { // GNB 타입-2
	var $body = $("body");
	var $topLayout = $("#top_layout");
	var $headerWrap = $topLayout.find(".header-wrap");
	var	$gnb = $("#gnb");
	var gnbType = $gnb.attr("data-gnb-type");
	if (gnbType != "gnb-2") return;
	
	$body.append('<div class="gnb-backdrop"></div>');
	$headerWrap.append('<div class="gnb-bg"><div class="layout"></div></div>');
	var $gnbBg = $headerWrap.find(".gnb-bg");
	var $depth1Ul = $gnb.find(".depth1-ul");
	var $depth1Li = $gnb.find(".depth1-ul > li");
	var $depth1Content = $gnb.find(".depth1-content");
	var $depth2Li = $gnb.find(".depth2-ul > li");
	var $depth2Btn = $gnb.find(".depth2-btn");
	var gnbHeight;
	var activeDepth1LiSize;
	$depth1Ul.css("--depth1-length", $depth1Li.length);

	///// DEPTH1-콘텐츠 크기 설정
	;(setDepth1Size = function() {
		activeDepth1LiSize = $depth1Ul.outerWidth() / $gnb.find(".depth1-ul > li").length;
		$depth1Content.css("width", activeDepth1LiSize);
	})();

	///// 가장 높은 DEPTH1-콘텐츠 높이 구하기
	;(getGnbHeight = function() {
		var heightList = [];
		$('.depth1-content').each(function(){
			heightList.push($(this)[0].scrollHeight);
		});
		gnbHeight = Math.max.apply(null, heightList);
	})();

	///// GNB 열기
	$depth1Li.on("mouseenter focusin", function () {
		$body.addClass("is-gnb-hover");
		$gnb.addClass("is-hover");
		$depth1Li.removeClass("is-hover");
		$(this).addClass("is-hover");
		$depth1Content.css("height",gnbHeight);
		$gnbBg.css("height",gnbHeight);
	});
	
	///// GNB 닫기
	function gnbClose() {
		$gnb.removeClass("is-hover");
		$gnbBg.css("height", "0");
		$depth1Li.removeClass("is-hover").css("min-width", "");
		$depth1Content.css("height", "0");
		$body.removeClass("is-gnb-hover");
	}
	$("#gnb, #top_layout .gnb-bg").on("mouseleave", gnbClose);

	///// 윈도우 리사이즈 처리 (+ 디바운스)
	var timer;
	$(window).on("resize load", function() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			setDepth1Size();
			getGnbHeight();
		}, 100);
	});

	///// DEPTH2 호버, 포커스인
	$depth2Li.on("mouseenter focusin", function () {
		$depth2Btn.removeClass("active");
		$(this).find(".depth2-btn").addClass("active");
	});
	$depth2Li.on("mouseleave focusout", function () {
		$depth2Btn.removeClass("active");
	});
	

	///// GNB 포커스아웃 처리
	var firstFocusable = $depth1Ul.find('a:first');
	var lastFocusable = $depth1Ul.find('a:last');
	firstFocusable.on('keydown', function(e) {
		if (e.keyCode === 9 && e.shiftKey) gnbClose();
	});
	lastFocusable.on('keydown', function(e) {
		if (e.keyCode === 9 && !e.shiftKey) gnbClose();
	});
})();


////////////////////////////////////////
////// GNB 타입-3, 타입-4 (KRDS 버전)
;(function() { // GNB 타입-3, 타입-4
	var $body = $("body");
	var $gnb = $("#gnb");
	var gnbType = $gnb.attr("data-gnb-type");
	if (gnbType != "gnb-3" && gnbType != "gnb-4") return;

	
	$gnb.insertAfter(".header-wrap .util-wrap");
	$body.append('<div class="gnb-backdrop"></div>');
	var $depth1Li = $gnb.find(".depth1-ul > li");
	var $depth2Li = $gnb.find(".depth2-ul > li");
	var $depth1Btn = $gnb.find(".depth1-btn");
	var $depth2Btn = $gnb.find(".depth2-btn");
	var $depth1Content = $gnb.find(".depth1-content");
	var $depth2Content = $gnb.find(".depth2-content");
	
	///// 하위메뉴 있을 때 has-depth 클래스, ARIA 속성 추가
	$depth1Li.each(function(){
		var $thisBtn = $(this).children(".depth1-btn");
		if ($(this).find(".depth2-ul").length > 0) {
			var uniqueId = 'gnb-depth1-' + Math.random().toString(36).substring(2, 9);
			$thisBtn.addClass("has-depth");
			$thisBtn.attr({
				"role": "button",
				"aria-controls": uniqueId,
				"aria-expanded": "false",
				"aria-haspopup": "true",
			});
			$(this).children(".depth1-content").attr("id", uniqueId);
		}
	});

	///// GNB 닫기
	function gnbClose() {
		$body.removeClass("is-gnb-open");
		$depth1Btn.removeClass("active").attr("aria-expanded", "false");
		$depth1Content.removeClass("active");
		$depth2Btn.removeClass("active");
		$depth2Content.removeClass("active");
	}
	$body.on("click", function(e) {
		if (!$(e.target).closest(".gnb").length) gnbClose();
	});
	$body.on("keyup", function(e) {
		if (e.key === "Escape" || e.key === "Esc" || !e.target.closest(".gnb")) { 
			gnbClose(); 
		}
	});

	///// GNB 오픈
	var $depth1Toggle = $gnb.find(".depth1-btn.has-depth");
	$depth1Toggle.on("click", function(e) {
		e.preventDefault();
		if (!$(this).hasClass("active")) {
			gnbClose();
			$body.addClass("is-gnb-open");
			$(this).addClass("active").attr("aria-expanded", "true");
			$(this).next(".depth1-content").addClass("active");
		} else {
			gnbClose();
		}
	});
	
	///// 타입-1 (대표 메인)
	if (gnbType == "gnb-3") {
		$depth2Li.each(function(){
			if ($(this).find(".depth3-ul").length > 0) {
				$(this).children(".depth2-btn").addClass("has-depth");
			}
		});
		var $depth2Toggle = $gnb.find(".depth2-btn.has-depth");

		///// 하위메뉴 있을 때 ARIA 속성 추가
		$depth2Toggle.each(function() {
			var $this = $(this);
			var uniqueId = 'gnb-depth2-' + Math.random().toString(36).substring(2, 9);
			$this.attr({
				"role": "button",
				"aria-controls": uniqueId,
				"aria-expanded": "false",
				"aria-haspopup": "true",
			});
			$this.next(".depth2-content").attr("id", uniqueId);
		});

		//// 첫번째 DEPTH2 콘텐츠 열기
		var $firstDepth2Btn = $gnb.find(".depth2-ul > li:first-child .depth2-btn");
		var $firstDepth2Toggle = $firstDepth2Btn.filter(".has-depth");
		$firstDepth2Btn.addClass("active");
		$firstDepth2Btn.next(".depth2-content").addClass("active");
		$firstDepth2Toggle.attr("aria-expanded", "true");

		//// DEPTH1 토글 클릭 - 첫번째 DEPTH2 콘텐츠 열기
		$depth1Toggle.on("click", function(e) {
			$(this).closest("li").find(".depth1-content > .layout").scrollTop(0);
			$firstDepth2Btn.addClass("active");
			$firstDepth2Btn.closest("li").find(".depth2-content").addClass("active");
			$firstDepth2Toggle.attr("aria-expanded", "true");
		});

		//// DEPTH2 토글 클릭 - 선택한 DEPTH2 콘텐츠 열기
		$depth2Toggle.on("click", function(e) {
			e.preventDefault();

			var $thisContent = $(this).closest("li").find(".depth2-content");

			if (!$(this).hasClass("active")) {
				$depth2Btn.removeClass("active").attr("aria-expanded", "false");
				$depth2Content.removeClass("active");
				$(this).addClass("active").attr("aria-expanded", "true");
				$thisContent.addClass("active");

				/// 선택한 DEPTH2 콘텐츠 위치가 너무 아래일 때 스크롤 조정
				var thisUl = $(this).closest(".depth2-ul").get(0);
				var thisUlOffset = thisUl ? thisUl.offsetTop : 0;
				var thisContentOffset = $thisContent.get(0).offsetTop;
				$($thisContent.closest(".layout")).stop().animate({
					scrollTop: thisUlOffset
					+ thisContentOffset 
					- $thisContent.closest(".depth1-content").outerHeight() / 2
				}, 400);

			}
		});
	}

})();


////////////////////////////////////////
////// 모바일 전체메뉴
;(function() { // 모바일 전체메뉴

	var $body = $("body");
	var $allmenu = $("#allmenu");
	var $allmenuBtn = $(".allmenu-btn");
	var $depth1Li = $allmenu.find(".depth1-ul > li");
	var $depth1Btn = $allmenu.find(".depth1-btn");
	var $depth2Ul = $allmenu.find(".depth2-ul");
	var $depth2Li = $allmenu.find(".depth2-ul > li");
	var $current = $allmenu.find(".current");
	var allmenuType = $allmenu.attr("data-allmenu-type") || "allmenu-1";


	///// 전체메뉴 닫기
	function allmenuClose() {
		$body.removeClass("is-allmenu-open");
		$allmenu.removeClass("is-open");
	}
	$allmenu.on("click", function (e) {
		if (e.target === this) allmenuClose();
	});
	$(".allmenu-close").on("click", allmenuClose);
	$(window).on("resize", allmenuClose);

	///// 전체메뉴 오픈
	$allmenuBtn.on("click", function() {
		$body.addClass("is-allmenu-open");
		$allmenu.addClass("is-open");
	});

	///// 전체메뉴 포커스트랩
	$allmenuBtn.one("click", function() {
		focusTrap($allmenu[0]);
	});

	///// DEPTH3 있을 때 has-depth 클래스 추가
	$depth2Li.each(function() {
		if ($(this).find(".depth3-ul").length > 0) {
			$(this).children(".depth2-btn").addClass("has-depth");
		}
	});


	////////////////////////////
	///// 타입-1
	if (allmenuType == "allmenu-1") {

		///// 
		$depth1Li.each(function() {
			var $thisBtn = $(this).children(".depth1-btn");
			var $thisDepth2Ul = $(this).find(".depth2-ul");
			if ($thisDepth2Ul.length > 0) {
				var uniqueId = 'allmenu-depth1-' + Math.random().toString(36).substring(2, 9);
				$thisBtn.addClass("has-depth");
				$thisBtn.attr({
					"role": "button",
					"aria-controls": uniqueId,
					"aria-expanded": "false",
					"aria-haspopup": "true",
				});
				$thisDepth2Ul.attr("id", uniqueId);
			}
		});

		//// DEPTH1 토글 클릭
		var $depth1Toggle = $allmenu.find(".depth1-btn.has-depth");
		$depth1Toggle.on("click", function(e) {
			e.preventDefault();
			var $this = $(this);
			var $thisDepth2Ul = $this.next(".depth2-ul");
			if (!$this.hasClass("active")) {
				$thisDepth2Ul.addClass("active").stop().slideDown();
				$this.addClass("active").attr("aria-expanded", "true");
			} else {
				$thisDepth2Ul.removeClass("active").stop().slideUp();
				$this.removeClass("active").attr("aria-expanded", "false");
			}
		});

		var $depth2Toggle = $allmenu.find(".depth2-btn.has-depth");
		$depth2Toggle.each(function() {
			var $this = $(this);
			var uniqueId = 'allmenu-depth2-' + Math.random().toString(36).substring(2, 9);
			$this.attr({
				"role": "button",
				"aria-controls": uniqueId,
				"aria-expanded": "false",
				"aria-haspopup": "true",
			});
			$this.next(".depth3-ul").attr("id", uniqueId);
		});

		$depth2Toggle.on("click", function(e) {
			e.preventDefault();
			var $this = $(this);
			var $thisDepth3Ul = $this.next(".depth3-ul");
			if (!$this.hasClass("active")) {
				$this.addClass("active").attr("aria-expanded", "true");
				$thisDepth3Ul.addClass("active").stop().slideDown();
			} else {
				$this.removeClass("active").attr("aria-expanded", "false");
				$thisDepth3Ul.removeClass("active").stop().slideUp();
			}
		});

		var $currentDepth1Btn = $allmenu.find(".depth1-btn.current");
		var $currentDepth2Ul = $currentDepth1Btn.next(".depth2-ul");
		var $currentDepth2Btn = $allmenu.find(".depth2-btn.current");
		var $currentDepth3Ul = $currentDepth2Btn.next(".depth3-ul");
		var $currentDepth3Btn = $allmenu.find(".depth3-btn.current");
		if ($currentDepth2Ul.length) {
			$currentDepth1Btn.addClass("active").attr("aria-expanded", "true");
			$currentDepth2Ul.addClass("active").show();
			if ($currentDepth3Btn.length) {
				$currentDepth2Btn.addClass("active").attr("aria-expanded", "true");
				$currentDepth3Ul.addClass("active").show();
			}
		}
	}

	////////////////////////////
	///// 타입-2 (대표 메인)
	else if (allmenuType == "allmenu-2") {

		///// 하위메뉴 있을 때 has-depth 클래스, ARIA 속성 추가
		$depth1Li.each(function() {
			var $thisBtn = $(this).children(".depth1-btn");
			var $thisDepth2Ul = $(this).find(".depth2-ul");
			if ($thisDepth2Ul.length > 0) {
				var uniqueId = 'gnb-depth1-' + Math.random().toString(36).substring(2, 9);
				$thisBtn.addClass("has-depth");
				$thisBtn.attr({
					"role": "button",
					"aria-controls": uniqueId,
					"aria-expanded": "false",
					"aria-haspopup": "true",
				});
				$thisDepth2Ul.attr("id", uniqueId);
			}
		});

		//// 서브페이지일 경우 현재 페이지 표시, 스크롤 처리
		if ($current.length) {
			$allmenuBtn.one("click", function() {
				var $currentDepth1Btn = $(".depth1-btn.current");
				var $currentDepth2Ul = $currentDepth1Btn.next(".depth2-ul");
				$currentDepth1Btn.addClass("active").attr("aria-expanded", "true");
				$currentDepth2Ul.addClass("active");
				$currentDepth2Ul.find(".depth2-btn.current").addClass("active").closest("li").find(".depth3-ul").addClass("active").show();
				$currentDepth2Ul.animate({
					scrollTop: $(".depth2-btn.current").closest("li").get(0).offsetTop
				}, 700);
			});
		} else {
			// 메인페이지일 경우 첫번째 메뉴 표시
			var $firstMenuBtn = $allmenu.find(".depth1-ul > li:first-child .depth1-btn");
			var $firstMenuUl = $allmenu.find(".depth1-ul > li:first-child .depth2-ul");
			$firstMenuBtn.addClass("active").attr("aria-expanded", "true");
			$firstMenuUl.addClass("active");
		}

		//// DEPTH1 토글 클릭
		var $depth1Toggle = $allmenu.find(".depth1-btn.has-depth");
		$depth1Toggle.on("click", function(e) {
			e.preventDefault();
			$depth2Ul.removeClass("active");
			$depth1Btn.removeClass("active").attr("aria-expanded", "false");
			$(this).next(".depth2-ul").addClass("active");
			$(this).addClass("active").attr("aria-expanded", "true");
		});

	} 

	////////////////////////////
	///// 타입-3 (2차 메뉴 적을 때, 와이드)
	else if (allmenuType == "allmenu-3") {
		var $depth2Toggle = $allmenu.find(".depth2-btn.has-depth");
		$depth2Toggle.each(function() {
			var $this = $(this);
			var uniqueId = 'allmenu-depth2-' + Math.random().toString(36).substring(2, 9);
			$this.attr({
				"role": "button",
				"aria-controls": uniqueId,
				"aria-expanded": "false",
				"aria-haspopup": "true",
			});
			$this.next(".depth3-ul").attr("id", uniqueId);
		});
		var $currentDepth1Btn = $allmenu.find(".depth1-btn.current");
		var $currentDepth2Btn = $allmenu.find(".depth2-btn.current");
		var $currentDepth3Ul = $currentDepth2Btn.next(".depth3-ul");
		var $currentDepth3Btn = $allmenu.find(".depth3-btn.current");
		$currentDepth2Btn.addClass("active").attr("aria-expanded", "true");
		$currentDepth3Ul.addClass("active").show();
		if($current.length) {
			var currentOffset;
			if ($currentDepth3Ul.length && $currentDepth3Btn.length) {
				currentOffset = $currentDepth3Btn.get(0).offsetTop - 100
			} else if ($currentDepth2Btn.length){
				currentOffset = $currentDepth2Btn.closest("li").get(0).offsetTop;
			} else {
				currentOffset = $currentDepth1Btn.closest("li").get(0).offsetTop;
			}
			$allmenuBtn.one("click", function() { 
				$allmenu.find(".allmenu-body").animate({
					scrollTop: currentOffset - 100
				}, 700);
			});
		}
		$depth2Toggle.on("click", function(e) {
			e.preventDefault();
			var $this = $(this);
			var $thisDepth3Ul = $this.next(".depth3-ul");
			if (!$this.hasClass("active")) {
				$this.addClass("active").attr("aria-expanded", "true");
				$thisDepth3Ul.addClass("active").stop().slideDown();
			} else {
				$this.removeClass("active").attr("aria-expanded", "false");
				$thisDepth3Ul.removeClass("active").stop().slideUp();
			}
		});
	}

})();


////////////////////////////////////////
////// 드롭다운
;(function() { // 드롭다운
	var $dropBtn = $(".drop-btn");
	if (!$dropBtn.length) return;

	//// 드롭다운 닫기
	function closeDrop() {
		$dropBtn.removeClass("active");
		$dropBtn.attr("aria-expanded", "false");
		$dropBtn.next(".drop-menu").removeClass("active");
	}

	//// 드롭다운 버튼 설정
	$dropBtn.each(function() {
		var $this = $(this);
		var menu = this.nextElementSibling;
		if (!menu) return;

		//// Aria 설정
		$this.attr({
			"aria-expanded": "false",
			"aria-haspopup": "true"
		});

		//// 드롭다운 열기
		$this.on("click", function() {
			if ($(this).attr("aria-expanded") == "false") {
				closeDrop();
				$(this).addClass("active");
				$(this).attr("aria-expanded", "true");
				$(this).next(".drop-menu").addClass("active");
			} else {
				closeDrop();
			}
		});

		//// 드롭다운 포커스 아웃 처리
		$this.on("focusout", function(e) {
			if (!e.relatedTarget) return;
			var isFocusInside = menu.contains(e.relatedTarget) || $this.get(0).contains(e.relatedTarget);
			if (!isFocusInside) closeDrop();
		});
		menu.addEventListener("focusout", function(e) {
			if (!e.relatedTarget) return;
			var isFocusInside = menu.contains(e.relatedTarget) || $this.get(0).contains(e.relatedTarget);
			if (!isFocusInside) closeDrop();
		});
		menu.addEventListener("click", function() {
			closeDrop();
			$this[0].focus();
		});

	});

	///// 드롭다운 외부 클릭 시 닫기
	$(document).on("click", function(e) {
		if (!$(e.target).closest(".drop-btn").length) {
			closeDrop();
		}
	});
	$(document).on("keydown", function(e) {
		if (e.key === "Escape" || e.key === "Esc") {
			var $dropBtn = $(e.target).closest(".drop-menu").prev(".drop-btn");
			if ($dropBtn.length) $dropBtn[0].focus();
			closeDrop();
		}
	});
})();


////////////////////////////////////////
////// 화면크기 설정
;(function() {
	var $body = $("body");
	var $screenSize = $(".screen-size");
	if (!$screenSize.length) return;
	var $sizeBtn = $screenSize.find(".screen-size-btn");
	var $sizeReset = $screenSize.find(".screen-size-reset");

	///// 화면크기 리스트
	var sizeList = {
		sm: 0.9,
		md: 1.0,
		lg: 1.1,
		xlg: 1.3,
		xxlg: 1.5
	};
	///// 저장된 화면크기 호출
	var currentSize = localStorage.getItem("screenSize") || "md";

	///// 화면크기 설정 함수
	function setSize(size) {
		if (!sizeList[size]) return;
		localStorage.setItem("screenSize", size);
		$body.css("zoom", sizeList[size]);
		$sizeBtn.removeClass("active").removeAttr("title");
		$sizeBtn.filter("[data-size='" + size + "']").addClass("active").attr("title", "선택된 상태");
	}

	///// 로딩 시 저장된 화면크기 설정
	setSize(currentSize);

	///// 버튼 클릭 시 화면크기 설정
	$sizeBtn.on("click", function(){
		setSize($(this).attr("data-size"));
	});
	$sizeReset.on("click", function(){
		setSize($(this).attr("data-size"));
	});

})();


////////////////////////////////////////
////// 통합검색 팝업
;(function() { // 통합검색 팝업

	const wrap = document.querySelector('.header-search');
	if (!wrap) return;
	const toggleBtns = document.querySelectorAll('#top_layout .search-toggle');
	const closeBtn = wrap.querySelector('.search-close');
	
	let lastFocus = null;
	let focusableEls = wrap.querySelectorAll('a, button, [tabindex="0"], input, textarea, select');
	let firstFocusable = null;
	let lastFocusable = null;
	if (focusableEls.length) {
		firstFocusable = focusableEls[0];
		lastFocusable = focusableEls[focusableEls.length - 1];
	}

	function searchOpen() {
		wrap.classList.add("is-open");
		toggleBtns.forEach(toggle => toggle.setAttribute("aria-expanded", "true"));
		setTimeout(() => firstFocusable?.focus(), 50);
	}
	function searchClose(restoreFocus = false) {
		wrap.classList.remove("is-open");
		toggleBtns.forEach(toggle => toggle.setAttribute("aria-expanded", "false"));
		if (restoreFocus) lastFocus?.focus();
	}

	toggleBtns.forEach(function(btn) {
		btn.setAttribute("aria-expanded", "false");
		btn.setAttribute("aria-haspopup", "true");
		btn.addEventListener("click", function(e) {
			lastFocus = this;
			if (wrap.classList.contains("is-open")) {
				searchClose(true);
			} else {
				searchOpen();
			}
		})
	});

	closeBtn?.addEventListener("click", searchClose);
	wrap.addEventListener("keydown", function(e) {
		if (e.key === 'Tab') {
			if ((e.shiftKey && document.activeElement === firstFocusable) ||
				(!e.shiftKey && document.activeElement === lastFocusable)) {
				searchClose(true);
			}
		}
		if (e.keyCode === 27) searchClose(true);
	});
	document.addEventListener("keydown", function(e) {
		if (e.key === "Escape") searchClose();
	});
	document.addEventListener("click", function(e) {
		if (!e.target.closest(".header-search") && !e.target.closest(".search-toggle")) searchClose();
	});
})();


////////////////////////////////////////
////// 이벤트리스너

///// 로딩
document.addEventListener("DOMContentLoaded", () => {
	scrollManager.update();
	scrollManager.setBodyWidth();
});

///// 리사이즈
window.addEventListener("resize", () => {
	scrollManager.updateBodyWidth();
});

///// 스크롤
window.addEventListener("scroll", () => {
	scrollManager.update();
});