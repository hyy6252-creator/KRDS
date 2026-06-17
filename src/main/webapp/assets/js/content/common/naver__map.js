$(function(){
	    var CreateMap = function(element, options) {
	        this.init(element, options)
	    };
	    CreateMap.DEFAULTS = {
	        zoom : 10
	    };

	     CreateMap.prototype.init = function(element, options){
	        this.element        = $(element);
	        this.options        = options;
	        this.addMarker();
	    };

	    CreateMap.prototype.addMarker = function(){
	        var mapContainer = this.element[0],
	            mapOption = {
	                center: new naver.maps.LatLng(this.options.lat, this.options.lng), // 지도의 중심좌표
	                zoom: this.options.zoom // 지도의 확대 레벨
	            };

	        var map = new naver.maps.Map(mapContainer, mapOption); // 지도를 생성합니다




	        var markerPosition = new naver.maps.LatLng(this.options.lat, this.options.lng);

	        var marker = new naver.maps.Marker({
	            position: markerPosition,
	            icon: {
			        url: '/pcms/common/images/marker.png',
			        size: new naver.maps.Size(55, 89),
			        origin: new naver.maps.Point(0, 0),
			        anchor: new naver.maps.Point(44, 72)
			    }
	        });
	       marker.setMap(map);

	        if(this.options.title || this.options.info ){
	        	 var title = this.options.title;
		         var info = this.options.info;
		         var contentString = '<div class="ui-map-info--multi ui-map--naver"><div class="ui-map-info__title">'+ this.options.title +'</div><div class="ui-map-info__content">'+ info +'</div></div>';
	        	var infowindow = new naver.maps.InfoWindow({
	                position: markerPosition,
	                borderWidth: 0,
	                content: contentString
	            });

	            infowindow.open(map, marker);

	        }



	    };


	    function checkMapPlugin(option){
	        var $this = $(this);
	        var data  = $this.data('map');
	        var options = $.extend({}, CreateMap.DEFAULTS, $this.data(), typeof option === 'object' && option);
	        $this.data('map', (data = new CreateMap(this, options)));
	        if (typeof option === 'string') data[option]()
	    }
	    $.fn.checkMap = checkMapPlugin;
	   
	        $("[data-map=\"map\"]").each(function () {
	            var $this = $(this);   //버튼
	            var option = $this.data();
	            checkMapPlugin.call($this, option);
	        });
	   

	});
