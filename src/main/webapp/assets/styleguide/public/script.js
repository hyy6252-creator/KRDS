
console.log("1111111")
// 스타일 선택영역
function select_style() {
	console.log("22222222")
	var url = $("#findPage option:selected").val();
	location.href = url;
}
// 스타일 선택영역 End

// 스타일미러
$('.ui_btnCodeCopy').on('click', function () {
	var el = $(this);
	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		el.data("text-original", el.text());
		el.text($(this).data("text-swap"));
		el.addClass('active');

		$(this).parent().next().css({
			'position': 'absolute',
			'opacity': 0,
			'display': 'block'
		})
		el.parent().next().focus();
		el.parent().next().select();
		document.execCommand('copy');

		setTimeout(function () {
			if (el.text() == "Copy!") {
				el.text("Copy to clipboard");
				el.removeClass('active');
			}
		}, 1000);
	} catch (err) {
		console.log('Oops, unable to copy');
	}

	window.getSelection().removeAllRanges();
})

$('.ui_code_content').each(function (index, elem) {
	var $this = $(this);
	if ($(this).hasClass('css') === true) {
		var editor = CodeMirror.fromTextArea(elem, {
			mode: 'text/css',
			tabMode: 'indent'
		});
	} else if ($(this).hasClass('html') === true) {
		var delay;
		var editor = CodeMirror.fromTextArea(elem, {
			mode: 'text/html',
			tabMode: 'indent'
			// onChange: function() {
			// 	clearTimeout(delay);
			// 	delay = setTimeout(updatePreview, 300);
			// }
		});

		editor.setOption("theme", 'twilight');
		editor.setOption("lineWrapping", 'true');
		editor.on("change", function () {
			clearTimeout(delay);
			delay = setTimeout(updatePreview, 300);
		});
		function updatePreview() {
			var preview = $this.prev().prev();
			preview.html(editor.getValue());
		}
		setTimeout(updatePreview, 300);
	}
	//   if($this.prev().prev().hasClass('code_preview') === true){

	//    }
});
// 스타일미러 End

// 스타일 네비게이션
var styleNav = $(".style_nav .nav_list>ul>li>a");
var styleNavdept = $(".nav_list_2th li a");

styleNav.each(function () {
	if ($(this).next().hasClass("nav_list_2th")) {
		$(this).parent().addClass('depth_2th')
	} else {
		$(this).parent().removeClass('depth_2th')
	}
})

styleNav.click(function (e) {
	var t = $(this);

	styleNav.parent().removeClass("on");
	t.parent().addClass("on");

	$("html, body").animate({ scrollTop: $(this.hash).offset().top }, 500);

	if (t.next().hasClass("nav_list_2th")) {
		t.parent().addClass("on")
		styleNavdept.parent().removeClass('on');
		styleNavdept.parent("li:first-child").addClass('on');
	} else {
		styleNavdept.parent().removeClass('on');
	}

	e.preventDefault();

});

styleNavdept.click(function (e) {
	var t = $(this);

	styleNavdept.parent().removeClass("on");
	t.parent().addClass("on");

	$("html, body").animate({ scrollTop: $(this.hash).offset().top }, 500);

	e.preventDefault();
});
// 스타일 네비게이션 End


$('a[href="#"]').on('click', function(e) {
	e.preventDefault();
})