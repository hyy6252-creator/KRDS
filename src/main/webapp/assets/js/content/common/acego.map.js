/**
 * 카카오 맵 구현 데이터 속성을 가진 HTML 컨테이너 생성:
 * <!-- 하나의 마커를 가진 지도 -->
 * <div data-map="map"
 * data-lat="37.5665" data-lng="126.9780" data-title="위치 이름" data-info="주소 또는 추가 정보"
 * data-level="3" data-draggable="true" data-zoomable="true" data-typecontrol="false" style="width:100%;height:400px;">
 * </div>
 * data-lat: 지도 중심 및 마커의 위도 (위치).
 * data-lng: 지도 중심 및 마커의 경도 (위치).
 * data-title: 마커 위에 표시될 제목 (옵션).
 * data-info: 마커 위에 표시될 추가 정보 (옵션).
 * <!-- 다중 마커를 가진 지도 -->
 * <div data-map="map" data-lat="37.5665" data-lng="126.9780"
 * data-level="3" data-draggable="true" data-zoomable="true" data-typecontrol="true"
 * data-mk1-lat="37.5665" data-mk1-lng="126.9780" data-mk1-title="Marker 1" data-mk1-info="marker 1 샘플"
 * data-mk2-lat="37.5650" data-mk2-lng="126.9775" data-mk2-title="Marker 2" data-mk2-info="marker 2 샘플"
 * style="width:100%;height:400px;">
 * </div>
 * data-mk1-lat, data-mk1-lng: 첫 번째 마커의 위도와 경도 값.
 * data-mk1-title, data-mk1-info: 첫 번째 마커에 표시될 제목과 정보.
 * data-mk2-lat, data-mk2-lng: 두 번째 마커의 위도와 경도 값.
 * data-mk2-title, data-mk2-info: 두 번째 마커에 표시될 제목과 정보.
 * data-mk3-lat, data-mk3-lng: 세 번째 마커의 위도와 경도 값.
 * data-mk3-title, data-mk3-info: 세 번째 마커에 표시될 제목과 정보.
 * 사용 가능한 데이터 속성:
 * - data-level: 줌 레벨 (기본값: 3)
 * - data-draggable: 맵 드래그 가능 여부 (기본값: true)
 * - data-zoomable: 줌 가능 여부 (기본값: true)
 * - data-typecontrol: 지도 유형 컨트롤 표시 여부 (기본값: false)
 */
if ($("[data-map='map']").length > 0) {
    window.kakao=window.kakao||{},window.kakao.maps=window.kakao.maps||{},window.daum&&window.daum.maps?window.kakao.maps=window.daum.maps:(window.daum=window.daum||{},window.daum.maps=window.kakao.maps),function(){function a(){if(o.length){n(s[o.shift()],a).start()}else e()}function n(a,n){var e=document.createElement("script");return e.onload=n,e.onreadystatechange=function(){/loaded|complete/.test(this.readyState)&&n()},{start:function(){e.src=a||"",
            document.getElementsByTagName("head")[0].appendChild(e),e=null}}}function e(){for(;i[0];)i.shift()();t.readyState=2}var t=kakao.maps=kakao.maps||{};if(void 0===t.readyState)t.onloadcallbacks=[],t.readyState=0;else if(2===t.readyState)return;t.URI_FUNC={ROADMAP:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD01/v17_9nwki/"+e+"/"+n+"/"+a+".png"},HYBRID:function(a,n,e){
            return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_SKYH01/v16_kyo0b/"+e+"/"+n+"/"+a+".png"},ROADVIEW:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_RV01/v09_qxjfl/"+e+"/"+n+"/"+a+".png"},BICYCLE:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_BIKE01/v07_od0v7/"+e+"/"+n+"/"+a+".png"},USE_DISTRICT:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_CAD01/v09_ie9ma/"+e+"/"+n+"/"+a+".png"},
        SR:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_SR01/v22_vnrcz/"+e+"/"+n+"/"+a+".png"},BBOUND:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_BBOUND01/v06_awocz/"+e+"/"+n+"/"+a+".png"},HBOUND:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_HBOUND01/v06_ieyas/"+e+"/"+n+"/"+a+".png"},TRAFFIC:function(a,n,e){return"r.maps.daum-img.net/mapserver/file/realtimeroad/L"+e+"/"+n+"/"+a+".png"},
        ROADMAP_HD:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG01/v23_izbfy/"+e+"/"+n+"/"+a+".png"},HYBRID_HD:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_SKYH01/v15_vjvpr/"+e+"/"+n+"/"+a+".png"},ROADVIEW_HD:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_RV01/v09_lq0s9/"+e+"/"+n+"/"+a+".png"},BICYCLE_HD:function(a,n,e){
            return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_BIKE01/v07_tkmex/"+e+"/"+n+"/"+a+".png"},USE_DISTRICT_HD:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_CAD01/v12_npeon/"+e+"/"+n+"/"+a+".png"},SR_HD:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_SR01/v22_vnrcz/"+e+"/"+n+"/"+a+".png"},BBOUND_HD:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_BBOUND01/v06_znmfq/"+e+"/"+n+"/"+a+".png"},
        HBOUND_HD:function(a,n,e){return"map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_HBOUND01/v06_hqcww/"+e+"/"+n+"/"+a+".png"},TRAFFIC_HD:function(a,n,e){return"r.maps.daum-img.net/mapserver/file/realtimeroad_hd/L"+e+"/"+n+"/"+a+".png"}},t.VERSION={ROADMAP_SUFFIX:"",SKYVIEW_VERSION:"160114",SKYVIEW_HD_VERSION:"160107"},t.RESOURCE_PATH={ROADVIEW_AJAX:"//t1.daumcdn.net/roadviewjscore/core/css3d/200204/standard/1580795088957/roadview.js",
        ROADVIEW_CSS:"//t1.daumcdn.net/roadviewjscore/core/openapi/standard/230727/roadview.js"};for(var r,p="https:"==location.protocol?"https:":"http:",m="",d=document.getElementsByTagName("script"),_=d.length;r=d[--_];)if(/\/(beta-)?dapi\.kakao\.com\/v2\/maps\/sdk\.js\b/.test(r.src)||/\/map_js_init\/open4\.test\.js\b/.test(r.src)||/\/map_js_init\/open4\.cbt\.js\b/.test(r.src)){m=r.src;break}d=null;var i=t.onloadcallbacks,o=["v3"],c="",s={v3:p+"//t1.daumcdn.net/mapjsapi/js/main/4.4.14/kakao.js",
        services:p+"//t1.daumcdn.net/mapjsapi/js/libs/services/1.0.2/services.js",drawing:p+"//t1.daumcdn.net/mapjsapi/js/libs/drawing/1.2.6/drawing.js",clusterer:p+"//t1.daumcdn.net/mapjsapi/js/libs/clusterer/1.0.9/clusterer.js"},u=function(a){var n={};return a.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(a,e,t){n[e]=t}),n}(m);c=u.appkey,c&&(t.apikey=c),t.version="4.4.14";var g=u.libraries;if(g&&(o=o.concat(g.split(","))),"false"!==u.autoload){for(var _=0,k=o.length;_<k;_++)!function(a){
        a&&document.write('<script charset="UTF-8" src="'+a+'"><\/script>')}(s[o[_]]);t.readyState=2}t.load=function(n){switch(i.push(n),t.readyState){case 0:t.readyState=1,a();break;case 2:e()}}}();
    $(function () {
        // CreateMap 생성자 함수
        var CreateMap = function (element, options) {
            this.init(element, options);
        };

        // 기본 옵션
        CreateMap.DEFAULTS = {
            level: 3,
            draggable: true,
            zoomable: true,
            typecontrol: false,
            markers: [] // 마커 정보를 담을 배열
        };

        // 초기화 함수
        CreateMap.prototype.init = function (element, options) {
            this.element = $(element);
            this.options = options;
            this.addMap();
        };

        // 지도 생성 및 마커 추가 함수
        CreateMap.prototype.addMap = function () {
            var $this = this.element;
            var mapContainer = this.element[0];

            // 지도 중심 설정
            var lat = parseFloat($this.data('lat'));
            var lng = parseFloat($this.data('lng'));

            // 지도 옵션
            var mapOption = {
                center: new kakao.maps.LatLng(lat, lng),
                level: this.options.level
            };

            var map = new kakao.maps.Map(mapContainer, mapOption);

            map.setDraggable(this.options.draggable);
            map.setZoomable(this.options.zoomable);

            if (this.options.typecontrol) {
                var mapTypeControl = new kakao.maps.MapTypeControl();
                map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

                var zoomControl = new kakao.maps.ZoomControl();
                map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
            }

            this.addMarkers(map, lat, lng);  // 마커 추가
        };

        // 마커 추가 함수
        CreateMap.prototype.addMarkers = function (map, centerLat, centerLng) {
            var $this = this.element;
            var markers = [];

            // 다중 마커일 경우
            if ($this.data('mk1-lat')) {
                var i = 1;
                // 다중 마커가 있을 경우, data-mk1-lat, data-mk1-lng 등으로 반복하면서 마커 추가
                while ($this.data('mk' + i + '-lat')) {
                    var lat = parseFloat($this.data('mk' + i + '-lat'));
                    var lng = parseFloat($this.data('mk' + i + '-lng'));
                    var title = $this.data('mk' + i + '-title');
                    var info = $this.data('mk' + i + '-info');

                    markers.push({ lat: lat, lng: lng, title: title, info: info });
                    i++;
                }
            }

            // 다중 마커가 아닌 경우
            else {
                // 하나의 마커일 경우, 기본 지도 속성 (lat, lng, title, info)
                markers.push({
                    lat: centerLat,
                    lng: centerLng,
                    title: $this.data('title'),
                    info: $this.data('info')
                });
            }

            // 마커들에 대해 반복문을 돌며 추가
            for (var j = 0; j < markers.length; j++) {
                var markerInfo = markers[j];
                var markerPosition = new kakao.maps.LatLng(markerInfo.lat, markerInfo.lng);

                var imageSrc = '/pcms/common/images/marker.png',
                    imageSize = new kakao.maps.Size(29, 42),
                    imageOption = { offset: new kakao.maps.Point(13, 42) };

                var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

                var marker = new kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage
                });

                marker.setMap(map);

                if (markerInfo.title || markerInfo.info) {
                    var customOverlay = new kakao.maps.CustomOverlay({
                        position: markerPosition
                    });

                    var content = document.createElement('div');
                    content.className = "ui-map-info";

                    if (markerInfo.title) {
                        var title = document.createElement('div');
                        title.className = "ui-map-info__title";
                        title.appendChild(document.createTextNode(markerInfo.title));
                        content.appendChild(title);
                    }

                    if (markerInfo.info) {
                        var info = document.createElement('div');
                        info.className = "ui-map-info__content";
                        info.appendChild(document.createTextNode(markerInfo.info));
                        content.appendChild(info);
                    }

                    customOverlay.setContent(content);
                    customOverlay.setMap(map);
                }
            }

            // 다중 마커일 경우, 지도 중심은 첫 번째 마커의 위치로 설정
            if (markers.length > 0) {
                var firstMarker = markers[0];
                var newCenter = new kakao.maps.LatLng(firstMarker.lat, firstMarker.lng);
                map.setCenter(newCenter);  // 지도 중심 이동
            }
        };

        // 플러그인 초기화 및 마커 추가 함수
        function checkMapPlugin(option) {
            var $this = $(this);
            var data = $this.data('map');
            var options = $.extend({}, CreateMap.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if ($this.is('[data-map="map"]')) {
                $this.data('map', (data = new CreateMap(this, options)));
                if (typeof option === 'string') data[option]();
            }
        }
        $.fn.checkMap = checkMapPlugin;
        $(window).on("load", function () {
            $("[data-map=\"map\"]").each(function () {
                var $this = $(this);
                var option = $this.data();
                checkMapPlugin.call($this, option);
            });
        });
    });


}