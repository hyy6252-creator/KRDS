////////////////////////////////////////
// defer 없는 공통 유틸
////////////////////////////////////////


//#region 디바운스, 쓰로틀링
/**
 * 연속 호출 시 마지막 호출만 실행 (검색 입력, 리사이즈 등에 사용)
 * @param {Function} func - 실행할 함수
 * @param {number} delay - 대기 시간 (ms)
 * @returns {Function}
 * @example
 * window.addEventListener('resize', debounce(() => { console.log('리사이즈 끝') }, 300));
 * @example
 * window.addEventListener('resize', debounce(myFunction,100));
 */
function debounce(func, delay) {
	let timer;
	return function(...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	}
}
/**
 * 연속 호출 시 일정 간격으로만 실행 (스크롤 이벤트 등에 사용)
 * @param {Function} func - 실행할 함수
 * @param {number} delay - 간격 시간 (ms)
 * @param {boolean} [trailing=true] - true: 마지막 호출도 실행 / false: 첫 호출만 실행
 * @returns {Function}
 * @example
 * window.addEventListener('scroll', throttle(() => { console.log('스크롤 중') }, 200));
 */
function throttle(func, delay, trailing = true) {
	let isThrottled = false;
	let timer;
	return function(...args) {
		if (trailing) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
				isThrottled = false;
			}, delay);
		}
		if (isThrottled) return;
		func.apply(this, args);
		isThrottled = true;
		if (!trailing) {
			setTimeout(() => {
				isThrottled = false;
			}, delay);
		}
	}
}
//#endregion


//#region 쿠키 관리

/**
 * 쿠키 저장 (만료일 자정 기준)
 * @param {string} name - 쿠키 이름
 * @param {string} value - 쿠키 값
 * @param {number} days - 유지 일수
 * @example setCookie('popup_01', 'done', 1);  // 오늘 하루 닫기
 */
function setCookie(name, value, days) {
	const date = new Date();
	date.setDate(date.getDate() + days);
	date.setHours(0, 0, 0, 0);
	document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + date.toUTCString();
}

/**
 * 쿠키 값 가져오기
 * @param {string} name - 쿠키 이름
 * @returns {string|null} 쿠키 값 (없으면 null)
 * @example
 * if (getCookie('popup_01') === 'done') { /* 팝업 숨김 *\/ }
 */
function getCookie(name) {
	const nameEQ = name + '=';
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		const c = ca[i].trim();
		if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
	}
	return null;
}

/** 쿠키 삭제 @param {string} name - 쿠키 이름 */
function removeCookie(name) {
	document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
}

//#endregion


//#region 포커스트랩
/**
 * 모달·팝업 내부에서 Tab 키 순환 (포커스가 밖으로 빠지지 않도록 제어)
 * @param {HTMLElement} trap - 포커스를 가둘 컨테이너 요소
 * @example
 * const modal = document.querySelector('.modal');
 * focusTrap(modal);
 */
function focusTrap(trap) {
  const focusableElements = trap.querySelectorAll(`a, button, [tabindex="0"], input, textarea, select`);

  if (!focusableElements.length) return;

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  trap.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      } else if (event.key === "Tab" && event.shiftKey && document.activeElement === trap) {
        event.preventDefault();
        lastFocusableElement.focus();
      }
    }
  });
}
//#endregion


//#region SwiperCustom
class SwiperCustom {

  // 기능 옵션 기본값
  static defaults = {
    autoBtn:        null,
    timer:          false,
    edgeClass:      false,
    slideFocus:     true,
    bulletsAria:    true,
  };
  static config = {
    timerVar:       'auto-progress',
  };

  /**
   * @version 2.3.11
   * @param {Swiper} swiper - Swiper 인스턴스
   * @param {SwiperCustomOption} [option] - 옵션
   *
   * @example
   * new SwiperCustom(mySwiper, {
   *   autoBtn: null,
   *   timer: false,
   *   timerVar: 'auto-progress',
   *   edgeClass: false,
   *   slideFocus: true,
   *   bulletsAria: true,
   * });
   */
  constructor(swiper, option = {}) {
    if (Array.isArray(swiper)) {
      swiper.forEach(sw => new SwiperCustom(sw, option));
      return;
    }

    if (!swiper || !swiper.el) {
      const target = swiper?.originalParams?.el || swiper?.params?.el || swiper;
      console.warn(`SwiperCustom: 유효한 Swiper가 아닙니다. (${target})`);
      return;
    }

    this.swiper = swiper;
    this.autoBtnEls = null;
    this.timerEls = null;
    this._listeners = [];
    this._timerSrc = null;
    this._wasRunning = null;

    this.option = { ...SwiperCustom.defaults, ...SwiperCustom.config, ...option };

    this.setup();

    this.swiper.on('beforeDestroy', () => {
      this._listeners.forEach(fn => fn());
      this._listeners = [];
      this._timerSrc = null;
      this.autoBtnEls = null;
      this.timerEls = null;
    });
  }


  // ─── 내부 유틸리티 ──────────────────────────────────────

  setup() {
    for (const key in SwiperCustom.defaults) {
      if (!this.option[key]) continue;
      const method = `init${key[0].toUpperCase()}${key.slice(1)}`;
      if (typeof this[method] === 'function') this[method]();
    }

    this.timerEls = [];
    if (this._timerSrc?.length) {
      this.timerEls.push(...this._timerSrc);
    } else {
      if (this.option.timer === true) this.timerEls.push(this.swiper.el);
      if (this.autoBtnEls?.length) this.timerEls.push(...this.autoBtnEls);
    }

    
    if (this.timerEls.length) {
      this.on('autoplayTimeLeft', (s, t, p) => {
        const value = (1 - p).toFixed(4);
        this.timerEls.forEach(el => el.style.setProperty('--' + this.option.timerVar, value));
      });
    }
    this.on('autoplayStart', () => {
      if (this.swiper.isLocked) {
        this.swiper.autoplay?.stop();
        return;
      }
      this.updateAutoState();
    });
    this.on('autoplayStop', () => {
      this.resetTimerVar();
      this.updateAutoState();
    });
    this.on('lock', () => {
      this.stopForLock();
    });
    this.on('unlock', () => {
      this.updateLockClass();
      if (this._wasRunning) {
        this.swiper.autoplay?.start();
      }
    });

    this.on('breakpoint', () => {
      if (!this.swiper.isLocked && this.swiper.params.autoplay?.enabled && this._wasRunning !== false) {
        this.swiper.autoplay?.start();
      } else {
        this.swiper.autoplay?.stop();
      }
    });
    if (this.swiper.isLocked) this.stopForLock();

    this.updateAutoState();
  }

  /**
   * CSS 선택자 또는 DOM 요소를 받아 배열로 반환
   * swiper.el → 상위 3단계 → document 순서로 탐색
   */
  getEl(target) {
    const list = Array.isArray(target) ? target : [target];
    return list.map(t => {
      if (t instanceof Element) return t;
      if (typeof t !== 'string') return null;

      let el = this.swiper.el;
      for (let i = 0; i < 3; i++) {
        const found = el?.querySelector(t);
        if (found) return found;
        el = el?.parentElement;
      }
      return document.querySelector(t);
    }).filter(Boolean);
  }

  /** swiper 이벤트 등록 + destroy 시 자동 해제 */
  on(event, handler) {
    this.swiper.on(event, handler);
    this._listeners.push(() => this.swiper.off(event, handler));
  }

  /** 외부 DOM 이벤트 등록 + destroy 시 자동 해제 */
  listen(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    this._listeners.push(() => target.removeEventListener(event, handler, options));
  }

  /** 자동재생 버튼·타이머 상태 UI 동기화, wrapperEl에 aria-live 세팅 보완 */
  updateAutoState() {
    const running = !!this.swiper.autoplay?.running;
    this.autoBtnEls?.forEach(btn => {
      btn.setAttribute('aria-pressed', running);
      btn.classList.toggle('paused', !running);
    });
    this._timerSrc?.forEach(el => el.classList.toggle('paused', !running));
    this.swiper.wrapperEl.setAttribute('aria-live', running ? 'off' : 'polite');
  }

  /** timer 초기화 */
  resetTimerVar() {
    this.timerEls?.forEach(el => el.style.setProperty('--' + this.option.timerVar, '0'));
  }

  /** lock 시 autoplay 정지 + 상태 저장 */
  stopForLock() {
    this._wasRunning = !!this.swiper.autoplay?.running;
    this.swiper.autoplay.stop();
    this.resetTimerVar();
    this.updateAutoState();
    this.updateLockClass();
  }

  /** lock 상태에 따라 autoBtnEls에 lockClass 토글 */
  updateLockClass() {
    this.autoBtnEls?.forEach(btn => {
      btn.classList.toggle('swiper-button-lock', this.swiper.isLocked);
    });
  }


  // ─── 기능 초기화 (옵션별) ───────────────────────────────
  /**
   * @typedef {Object} SwiperCustomOption
   *
   * @property {string|Element|Array} [autoBtn=null]
   * 자동재생 버튼 지정 (aria-pressed 상태 전달)
   * - `null`: 자동재생 버튼 미적용 **(기본값)**
   * - `'선택자'`: CSS 선택자 문자열
   * - `DOM`: document.querySelector() 등으로 가져온 요소
   * - `['선택자', DOM, ...]`: 여러 개일 때 배열로 전달
   * 
   * **※`aria-label` 미설정 시 `aria-label="Autoplay"` 자동 부여**
   * 
   * @property {boolean|string|Element|Array} [timer=false]
   * 자동재생 타이머 요소 지정
   * - `false`: autoBtn 있으면 autoBtn에만 적용, 없으면 미적용 **(기본값)**
   * - `true`: swiper.el + autoBtn에 적용
   * - `'선택자'`: CSS 선택자 문자열
   * - `DOM`: document.querySelector() 등으로 가져온 요소
   * - `['선택자', DOM, ...]`: 여러 개일 때 배열로 전달
   * 
   * @property {string} [timerVar='--auto-progress']
   * 자동재생 타이머 CSS변수 이름 지정
   * - **기본값**: `'auto-progress'`
   * - 예시: `'swiper-autoplay-timer'`
   *
   * @property {boolean|string|Element} [edgeClass=false]
   * Swiper 진행도에 따라 클래스 업데이트
   * - `false`: 미적용 **(기본값)**
   * - `true`: swiper.el에 적용
   * - `'선택자'`: CSS 선택자 문자열
   * - `DOM`: document.querySelector() 등으로 가져온 요소
   * 
   * **※`loop` 설정 시 미적용**
   * 
   * @property {boolean} [slideFocus=true]
   * - `true`: 보이는 슬라이드만 포커싱 **(기본값)**
   * - `false`: 모든 슬라이드 포커싱
   */

  initAutoBtn() {
    this.autoBtnEls = this.getEl(this.option.autoBtn);
    if (!this.autoBtnEls.length) {
      console.warn('SwiperCustom: autoBtn 요소를 찾을 수 없습니다.');
      return;
    }

    this.autoBtnEls.forEach(btn => {
      if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', 'Autoplay');
      const wrapperId = this.swiper.wrapperEl.id;
      if (wrapperId) btn.setAttribute('aria-controls', wrapperId);
      this.listen(btn, 'click', () => {
        if (this.swiper.isLocked) return;
        this.swiper.autoplay?.running
          ? this.swiper.autoplay?.stop()
          : this.swiper.autoplay?.start();
      });
    });
  }

  initTimer() {
    if (this.option.timer === true) return;
    this._timerSrc = this.getEl(this.option.timer);
    if (!this._timerSrc.length) {
      console.warn('SwiperCustom: timer 요소를 찾을 수 없습니다.');
    }
  }

  initEdgeClass() {
    const sw = this.swiper;
    const target = this.option.edgeClass === true
      ? sw.el
      : this.getEl(this.option.edgeClass)[0];

    if (!target) return;

    const update = () => {
      if (!sw.params.loop) {
        target.classList.toggle('is-begin', sw.progress === 0);
        target.classList.toggle('is-end', sw.progress === 1);
      }
      target.classList.toggle('is-overflow', !sw.isLocked);
    };

    update();
    this.on('progress', update);
  }

  initSlideFocus() {
    const sw = this.swiper;
    sw.params.watchSlidesProgress = true;
    sw.update();

    const focusableSelector = 'a, button, input, select, textarea, [tabindex], iframe, video, audio';

    const update = () => {
      if (!sw.slides?.length) return;
      sw.slides.forEach(slide => {
        const hidden = !slide.classList.contains('swiper-slide-visible');
        slide.setAttribute('aria-hidden', String(hidden));
        if (hidden) {
          slide.setAttribute('tabindex', '-1');
          slide.querySelectorAll(focusableSelector).forEach(el => el.setAttribute('tabindex', '-1'));
        } else {
          slide.removeAttribute('tabindex');
          slide.querySelectorAll(focusableSelector).forEach(el => el.removeAttribute('tabindex'));
        }
      });
    };

    update();
    this.on('slideChangeTransitionStart', update);
    this.on('observerUpdate', update);
    this.on('resize', update);
    this.listen(window, 'load', update);
  }

  initBulletsAria() {
    if (!this.swiper.pagination.bullets?.length) return;
    const update = () => {
      const bullets = this.swiper.pagination.bullets;
      if (!bullets?.length) return;
      bullets.forEach(bullet => bullet.removeAttribute('title'));
      const active = [...bullets].find(b => b.classList.contains('swiper-pagination-bullet-active'));
      active?.setAttribute('title', '선택됨');
    };
    update();
    this.on('slideChange', update);
  }
}
//#endregion