////////////////////////////////////////
//  프로젝트 모든 서브페이지 공통
////////////////////////////////////////


////////////////////////////////////////
////// 프린트
$("[data-print=print]").on("click", function () {
	var printFocus = $(this);
	$("#txt").print({
		globalStyles: true,
		mediaPrint: false,
		iframe: true,
		noPrintSelector: ".avoid-this",
		deferred: $.Deferred().done(function () { printFocus.focus() })
	});
});

////////////////////////////////////////
////// SNB (left.jsp)
;(function(){
	var $snb = $(".snb");
	var $depth2Toggle = $snb.find(".depth2-btn.has-depth");
	var $currentDepth3Btn = $snb.find(".depth3-btn.current");
	var $currentDepth2Li = $currentDepth3Btn.closest(".depth2-ul > li");

	//// DEPTH3 있는 DEPTH2 클릭 이벤트
	$depth2Toggle.each(function() {
		var $this = $(this);
		var uniqueId = 'snb-depth2-' + Math.random().toString(36).substring(2, 9);
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
		var $thisLi = $this.parent("li");
		var $thisDepth3Ul = $this.next(".depth3-ul");
		if (!$thisLi.hasClass("active")) {
			$thisLi.addClass("active");
			$this.attr("aria-expanded", "true");
			$thisDepth3Ul.addClass("active").stop().slideDown();
		} else {
			$thisLi.removeClass("active");
			$this.attr("aria-expanded", "false");
			$thisDepth3Ul.removeClass("active").stop().slideUp();
		}
	});

	//// 방문중인 DEPTH3 표시
	if ($currentDepth3Btn.length > 0) {
		$currentDepth2Li.addClass("active");
		$currentDepth2Li.find(".depth2-btn").attr("aria-expanded", "true");
		$currentDepth3Btn.closest(".depth3-ul").show();
	}
	
})();