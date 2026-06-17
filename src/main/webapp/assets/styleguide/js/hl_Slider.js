
(function () {
	var _id = "#slide_slide";//시작 아이디
	var _view = 1;//슬라이더 컨텐츠 수
	var _auto = true;//오토플레이 아닐시 false
	var _slide = true;//슬라이더 아닐시 false(fade in/out)
	var _speed = 150;//슬라이더 속도 기본150
	touchSlider(_id, _view, _auto, _slide, _speed);
}());

//슬라이드 시작
function touchSlider(id, num, autoplay, slide, speed) {
	var $touchSlider = $(id);
	var $autoplay = autoplay;
	var $slidNum = num;
	var $slide = slide;
	var $speed = speed;
	if ($slidNum == null || $slidNum == "auto" || $slidNum == 0) {
		var boxWidth = $touchSlider.find(".sliderBox").width();
		var conWidth = $touchSlider.find(".sliderBox > ul > li").width();
		$slidNum = Number(boxWidth / conWidth).toFixed();
		//console.log("$slidNum:"+$slidNum);
	}
	if ($autoplay == null || $autoplay == true) {
		$touchSlider.find(".btn_play").hide();
		$touchSlider.find(".btn_stop").show();
	} else {
		$touchSlider.find(".btn_play").show();
		$touchSlider.find(".btn_stop").hide();
	}
	if ($touchSlider.find('.sliderBox > ul > li').length > 1) {
		$touchSlider.find("> .sliderBox").touchSlider({
			view: $slidNum,
			speed: $speed,
			transition: false,
			autoplay: {
				enable: $autoplay,
				pauseHover: false,
				addHoverTarget: "", // 다른 오버영역 추가 ex) ".someBtn, .someContainer"
				interval: 7500,
			},
			initComplete: function (e) {
				var _this = this;
				var $this = $(this);
				var paging = $touchSlider.find(".paging");

				this._btn_play = null;
				this._btn_stop = null;

				paging.html("");
				$this.find(" > ul > li").each(function (i, el) {
					var num = (i + 1) / _this._view;
					if ((i + 1) % _this._view == 0) {
						paging.append('<button type="button" class="btn_page">page' + num + '</button>');
					}
				});
				paging.find(".btn_page").bind("click", function (e) {
					_this.go_page($(this).index());
					$touchSlider.find(".btn_play").show();
					$touchSlider.find(".btn_stop").hide();
					_this.autoStop();
				});

				$touchSlider.find(".btn_play").bind("click", function () {
					$touchSlider.find(".btn_play").hide();
					$touchSlider.find(".btn_stop").show();
					_this.autoPlay();
				});
				$touchSlider.find(".btn_stop").bind("click", function () {
					$touchSlider.find(".btn_play").show();
					$touchSlider.find(".btn_stop").hide();
					_this.autoStop();
				});
				$this.find(" > ul > li a").on("focus", function (e) {
					e.preventDefault();
					if (Number($slidNum) > 1) {
						var _thisNumb = Math.floor(Number($(this).parents("li").index() / $slidNum));
					} else {
						var _thisNumb = $(this).parents("li").index();
					}
					$touchSlider.find(".btn_play").show();
					$touchSlider.find(".btn_stop").hide();
					_this.autoStop();
					_this.go_page(_thisNumb);

					$touchSlider.find("> .sliderBox > ul").css({ "position": "fixed" });
					setTimeout(function () {
						$touchSlider.find("> .sliderBox > ul").css({ "position": "" });
					}, 50);

				});
				$this.find(" > ul > li a").on("focusout", function () {
					$touchSlider.find(".btn_play").hide();
					$touchSlider.find(".btn_stop").show();
					_this.autoPlay();
				});
			},
			counter: function (e) {
				$touchSlider.find(".paging .btn_page").removeClass("on").eq(e.current - 1).addClass("on");
				$touchSlider.find(".pageCount").html("<span class='num'>" + e.current + "</span>/<span class='totalNum'>" + e.total + "</sapn>");
				if ($slide == false) {
					$touchSlider.find(".sliderBox > ul > li").stop();
					$touchSlider.find(".sliderBox > ul > li").css({ "opacity": "0", "z-index": "1", "left": "0" });
					$touchSlider.find(".sliderBox > ul > li.on").removeClass("on").css({ "z-index": "2", "opacity": "1", "left": "0" });
					$touchSlider.find(".sliderBox > ul > li").eq(e.current - 1).addClass("on").css({ "z-index": "3", "opacity": "0", "left": "0" }).animate({ "opacity": "1" }, 1000);
				}
			},
			btn_prev: $touchSlider.find(".btn_prev"),
			btn_next: $touchSlider.find(".btn_next")
		});
	}
}
//슬라이드 끝