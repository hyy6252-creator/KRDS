; (function () { // version 2.6

  // ══════════════════════════════════════
  // 설정

  // 루트 컨테이너 선택자
  const CONTAINER = '.util-trans';

  // [한국어명] 표시 여부
  const SHOW_NAME = false;

  // 번역 상태가 아닐 때 reset 버튼 활성화 여부
  const RESET_BTN_STATE = true;

  // 번역 후 실행할 함수
  const ON_REFRESH = () => {
    window.dispatchEvent(new Event('resize'));
    if (typeof ScrollTrigger === 'function') ScrollTrigger.refresh();
    // if (typeof lenis === 'object' && lenis) lenis.resize();
    document.querySelectorAll('.swiper').forEach(el => { if (el.swiper) el.swiper.update(); });
  };

  // 언어 데이터
  const LANG_DATA = {
    "ko": {
      "name": "한국어",
      "nativeName": "한국어"
    },
    "en": {
      "name": "영어",
      "nativeName": "English"
    },
    "zh-CN": {
      "name": "중국어(간체)",
      "nativeName": "中文(简体)"
    },
    "zh-TW": {
      "name": "중국어(번체)",
      "nativeName": "中文(繁體)"
    },
    "ja": {
      "name": "일본어",
      "nativeName": "日本語"
    },
    "af": {
      "name": "아프리칸스어",
      "nativeName": "Afrikaans"
    },
    "sq": {
      "name": "알바니아어",
      "nativeName": "Shqip"
    },
    "am": {
      "name": "암하라어",
      "nativeName": "አማርኛ"
    },
    "ar": {
      "name": "아랍어",
      "nativeName": "العربية"
    },
    "hy": {
      "name": "아르메니아어",
      "nativeName": "Հայերեն"
    },
    "az": {
      "name": "아제르바이잔어",
      "nativeName": "Azərbaycanca"
    },
    "eu": {
      "name": "바스크어",
      "nativeName": "Euskara"
    },
    "be": {
      "name": "벨라루스어",
      "nativeName": "Беларуская"
    },
    "bn": {
      "name": "벵골어",
      "nativeName": "বাংলা"
    },
    "bs": {
      "name": "보스니아어",
      "nativeName": "Bosanski"
    },
    "bg": {
      "name": "불가리아어",
      "nativeName": "Български"
    },
    "ca": {
      "name": "카탈로니아어",
      "nativeName": "Català"
    },
    "ceb": {
      "name": "세부아노어",
      "nativeName": "Sinugboanon"
    },
    "ny": {
      "name": "체와어",
      "nativeName": "Chichewa"
    },
    "co": {
      "name": "코르시카어",
      "nativeName": "Corsu"
    },
    "hr": {
      "name": "크로아티아어",
      "nativeName": "Hrvatski"
    },
    "cs": {
      "name": "체코어",
      "nativeName": "Čeština"
    },
    "da": {
      "name": "덴마크어",
      "nativeName": "Dansk"
    },
    "nl": {
      "name": "네덜란드어",
      "nativeName": "Nederlands"
    },
    "eo": {
      "name": "에스페란토어",
      "nativeName": "Esperanto"
    },
    "et": {
      "name": "에스토니아어",
      "nativeName": "Eesti"
    },
    "tl": {
      "name": "필리핀어",
      "nativeName": "Wikang Tagalog"
    },
    "fi": {
      "name": "핀란드어",
      "nativeName": "Suomi"
    },
    "fr": {
      "name": "프랑스어",
      "nativeName": "Français"
    },
    "fy": {
      "name": "프리지아어",
      "nativeName": "Frysk"
    },
    "gl": {
      "name": "갈리시아어",
      "nativeName": "Galego"
    },
    "ka": {
      "name": "조지아어",
      "nativeName": "ქართული"
    },
    "de": {
      "name": "독일어",
      "nativeName": "Deutsch"
    },
    "el": {
      "name": "그리스어",
      "nativeName": "ελληνικά"
    },
    "gu": {
      "name": "구자라트어",
      "nativeName": "ગુજરાતી"
    },
    "ht": {
      "name": "아이티 크리올어",
      "nativeName": "Kreyòl ayisyen"
    },
    "ha": {
      "name": "하우사어",
      "nativeName": "Hausa"
    },
    "haw": {
      "name": "하와이어",
      "nativeName": "ʻŌlelo Hawaiʻi"
    },
    "iw": {
      "name": "히브리어",
      "nativeName": "עברית"
    },
    "hi": {
      "name": "힌디어",
      "nativeName": "हिन्दी"
    },
    "hmn": {
      "name": "몽어",
      "nativeName": "苗語"
    },
    "hu": {
      "name": "헝가리어",
      "nativeName": "Magyar"
    },
    "is": {
      "name": "아이슬란드어",
      "nativeName": "Íslenska"
    },
    "ig": {
      "name": "이그보어",
      "nativeName": "Asụsụ Igbo"
    },
    "id": {
      "name": "인도네시아어",
      "nativeName": "Bahasa Indonesia"
    },
    "ga": {
      "name": "아일랜드어",
      "nativeName": "Gaeilge"
    },
    "it": {
      "name": "이탈리아어",
      "nativeName": "Italiano"
    },
    "jw": {
      "name": "자바어",
      "nativeName": "ꦧꦱꦗꦮ"
    },
    "kn": {
      "name": "칸나다어",
      "nativeName": "ಕನ್ನಡ"
    },
    "kk": {
      "name": "카자흐어",
      "nativeName": "Қазақша"
    },
    "km": {
      "name": "크메르어",
      "nativeName": "ខ្មែរ"
    },
    "ku": {
      "name": "쿠르드어(쿠르만지)",
      "nativeName": "Kurdî"
    },
    "ky": {
      "name": "키르기스어",
      "nativeName": "Кыргызча"
    },
    "lo": {
      "name": "라오어",
      "nativeName": "ພາສາລາວ"
    },
    "la": {
      "name": "라틴어",
      "nativeName": "Latina"
    },
    "lv": {
      "name": "라트비아어",
      "nativeName": "Latviešu"
    },
    "lt": {
      "name": "리투아니아어",
      "nativeName": "Lietuvių"
    },
    "lb": {
      "name": "룩셈부르크어",
      "nativeName": "Lëtzebuergesch"
    },
    "mk": {
      "name": "마케도니아어",
      "nativeName": "Македонски"
    },
    "mg": {
      "name": "말라가시어",
      "nativeName": "Malagasy"
    },
    "ms": {
      "name": "말레이어",
      "nativeName": "Bahasa Melayu"
    },
    "ml": {
      "name": "말라얄람어",
      "nativeName": "മലയാളം"
    },
    "mt": {
      "name": "몰타어",
      "nativeName": "Malti"
    },
    "mi": {
      "name": "마오리어",
      "nativeName": "te reo Māori"
    },
    "mr": {
      "name": "마라티어",
      "nativeName": "मराठी"
    },
    "mn": {
      "name": "몽골어",
      "nativeName": "Монгол"
    },
    "my": {
      "name": "미얀마어(버마어)",
      "nativeName": "ဗမာစာ"
    },
    "ne": {
      "name": "네팔어",
      "nativeName": "नेपाली"
    },
    "no": {
      "name": "노르웨이어",
      "nativeName": "Norsk"
    },
    "ps": {
      "name": "파슈토어",
      "nativeName": "پښتو"
    },
    "fa": {
      "name": "페르시아어",
      "nativeName": "فارسی"
    },
    "pl": {
      "name": "폴란드어",
      "nativeName": "Polski"
    },
    "pt": {
      "name": "포르투갈어(브라질)",
      "nativeName": "Português"
    },
    "pa": {
      "name": "펀자브어(구르무키)",
      "nativeName": "ਪੰਜਾਬੀ"
    },
    "ro": {
      "name": "루마니아어",
      "nativeName": "Română"
    },
    "ru": {
      "name": "러시아어",
      "nativeName": "Русский"
    },
    "sm": {
      "name": "사모아어",
      "nativeName": "gagana fa'a Samoa"
    },
    "gd": {
      "name": "스코틀랜드 게일어",
      "nativeName": "Gàidhlig"
    },
    "sr": {
      "name": "세르비아어",
      "nativeName": "Српски"
    },
    "st": {
      "name": "세소토어",
      "nativeName": "Sesotho"
    },
    "sn": {
      "name": "쇼나어",
      "nativeName": "chiShona"
    },
    "sd": {
      "name": "신디어",
      "nativeName": "سنڌي"
    },
    "si": {
      "name": "싱할라어",
      "nativeName": "සිංහල"
    },
    "sk": {
      "name": "슬로바키아어",
      "nativeName": "Slovenčina"
    },
    "sl": {
      "name": "슬로베니아어",
      "nativeName": "Slovenščina"
    },
    "so": {
      "name": "소말리아어",
      "nativeName": "Soomaaliga"
    },
    "es": {
      "name": "스페인어",
      "nativeName": "Español"
    },
    "su": {
      "name": "순다어",
      "nativeName": "Basa Sunda"
    },
    "sw": {
      "name": "스와힐리어",
      "nativeName": "Kiswahili"
    },
    "sv": {
      "name": "스웨덴어",
      "nativeName": "Svenska"
    },
    "tg": {
      "name": "타지크어",
      "nativeName": "Тоҷикӣ"
    },
    "ta": {
      "name": "타밀어",
      "nativeName": "தமிழ்"
    },
    "te": {
      "name": "텔루구어",
      "nativeName": "తెలుగు"
    },
    "th": {
      "name": "태국어",
      "nativeName": "ไทย"
    },
    "tr": {
      "name": "튀르키예어",
      "nativeName": "Türkçe"
    },
    "uk": {
      "name": "우크라이나어",
      "nativeName": "Українська"
    },
    "ur": {
      "name": "우르두어",
      "nativeName": "اردو"
    },
    "uz": {
      "name": "우즈베크어",
      "nativeName": "Oʻzbek"
    },
    "vi": {
      "name": "베트남어",
      "nativeName": "Tiếng Việt"
    },
    "cy": {
      "name": "웨일즈어",
      "nativeName": "Cymraeg"
    },
    "xh": {
      "name": "코사어",
      "nativeName": "isiXhosa"
    },
    "yi": {
      "name": "이디시어",
      "nativeName": "ייִדיש"
    },
    "yo": {
      "name": "요루바어",
      "nativeName": "Yorùbá"
    },
    "zu": {
      "name": "줄루어",
      "nativeName": "isiZulu"
    }
  };


  // ══════════════════════════════════════
  // 유틸
  
  function setCookie(name, value, days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(0, 0, 0, 0);
    document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + date.toUTCString();
  }
  function removeCookie(name) {
    const expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = `${name}=; path=/; ${expires}`;
    const parts = location.hostname.split('.');
    for (let i = 0; i < parts.length - 1; i++) {
      const domain = '.' + parts.slice(i).join('.');
      document.cookie = `${name}=; path=/; domain=${domain}; ${expires}`;
    }
  }


  // ══════════════════════════════════════
  // 번역 기능

  function translateTo(lang) {
    const select = document.querySelector('.goog-te-combo');
    if (!select) return;
    select.value = lang;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    watchTranslation();
  }

  function translateReset() {
    removeCookie('googtrans');
    setCookie('show_original', 'true', 365);
    location.reload();
  }

  const currentEls = new Map();

  function initCurrentDisplay() {
    document.querySelectorAll(`${CONTAINER} [data-trans-current]`).forEach(el => {
      currentEls.set(el, el.textContent.trim());
      el.setAttribute('translate', 'no');
    });
  }

  function updateCurrentDisplay(lang, hasActive) {
    currentEls.forEach((originalText, el) => {
      if (hasActive) {
        const data = LANG_DATA[lang];
        if (data) el.textContent = data.nativeName;
      } else {
        el.textContent = el.dataset.transCurrent || originalText;
      }
    });
  }

  function updateState(lang) {
    const current = lang || document.documentElement.lang;
    let hasActive = false;

    document.querySelectorAll(`${CONTAINER} [data-trans]`).forEach(btn => {
      if (btn.dataset.trans === 'reset' || btn.dataset.trans === 'link') return;
      const isActive = btn.dataset.trans === current;
      if (isActive) hasActive = true;
      btn.classList.toggle('active', isActive);
      if (isActive) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });

    if (RESET_BTN_STATE) {
      document.querySelectorAll(`${CONTAINER} [data-trans="reset"]`).forEach(btn => {
        btn.classList.toggle('active', !hasActive);
        if (!hasActive) btn.setAttribute('aria-current', 'true');
        else btn.removeAttribute('aria-current');
      });
    }

    updateCurrentDisplay(current, hasActive);
  }

  const watchTranslation = (() => {
    let observer = null;
    let timer = null;

    const cleanup = () => {
      if (observer) { observer.disconnect(); observer = null; }
      clearTimeout(timer);
    };

    return () => {
      cleanup();
      observer = new MutationObserver(mutations => {
        const hasFont = mutations.some(({ addedNodes }) =>
          [...addedNodes].some(node => node.nodeName === 'FONT')
        );
        if (!hasFont) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          cleanup();
          translateRefresh();
        }, 300);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };
  })();

  function translateRefresh() {
    updateState();
    ON_REFRESH();
  }


  // ══════════════════════════════════════
  // 초기화

  function setStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .skiptranslate,
      #google_translate_element { display: none; }
      body { top: 0 !important; }
      font { font: inherit; overflow-wrap: anywhere; }
      html:not([lang=ko]) { overflow-wrap: anywhere; }
      #goog-gt-tt ~ div[class^=V] { opacity: 0; pointer-events: none; }
    `;
    document.head.appendChild(style);
  }

  function setButtons() {
    const fragment = document.createDocumentFragment();

    for (const [lang, { name, nativeName }] of Object.entries(LANG_DATA)) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      const span = document.createElement('span');
      const em = document.createElement('em');

      if (nativeName) {
        em.textContent = nativeName;
        em.setAttribute('translate', 'no');
      }
      span.appendChild(em);
      if (SHOW_NAME && name) {
        const b = document.createElement('b');
        b.textContent = `[${name}]`;
        span.appendChild(b);
      }
      btn.appendChild(span);
      btn.dataset.trans = lang;
      btn.classList.add('trans-btn');
      btn.type = 'button';
      li.appendChild(btn);
      fragment.appendChild(li);
    }

    document.querySelectorAll(`${CONTAINER} .drop-menu ul`).forEach(ul => {
      ul.appendChild(fragment.cloneNode(true));
    });
  }

  function translateInit() {
    new google.translate.TranslateElement(
      { autoDisplay: false },
      'google_translate_element'
    );

    const observer = new MutationObserver(() => {
      if (!document.querySelector('.goog-te-combo')) return;
      observer.disconnect();
      updateState();
      watchTranslation();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function setEvents() {
    document.addEventListener('click', e => {
      const transBtn = e.target.closest(`${CONTAINER} [data-trans]`);
      if (transBtn) {
        const lang = transBtn.dataset.trans;

        if (lang === 'reset') {
          translateReset();
          return;
        }

        if (lang === 'link') {
          removeCookie('googtrans');
          return;
        }

        removeCookie('show_original');
        translateTo(lang);
        updateState(lang);
        return;
      }

      const dropBtn = e.target.closest(`${CONTAINER} .drop-btn`);
      if (dropBtn) {
        updateState();
        const menu = dropBtn.nextElementSibling;
        if (!menu) return;
        const ul = menu.querySelector('ul');
        const active = menu.querySelector('[data-trans].active');
        if (active && ul) {
          ul.scrollTop = active.offsetTop - active.offsetHeight * 2;
          active.focus();
        }
      }
    });
  }

  function setWidget() {
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    document.body.appendChild(container);

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=__gTranslateInit';
    document.body.appendChild(script);
  }


  // ══════════════════════════════════════
  // 전역 노출 외부 함수

  window.__gTranslateInit = translateInit;

  window.gTranslate = {
    to(lang) {
      removeCookie('show_original');
      translateTo(lang);
      updateState(lang);
    },
    reset: translateReset,
    refresh: translateRefresh,
  };


  // ══════════════════════════════════════
  // 실행

  setStyles();
  setButtons();
  initCurrentDisplay();
  setEvents();
  setWidget();

})();
