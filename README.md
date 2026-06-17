KRDS 프로젝트 파일 역할 정리
핵심 흐름

src/input.css  →  npm run build  →  assets/css/tailwind.css
    (설정)              (컴파일)            (결과물)
파일별 역할
Tailwind 관련 (스타일가이드 전용)
파일	역할
src/input.css	Tailwind v4 설정 파일. @theme {} 안에 KRDS 컬러 토큰 정의 (--color-primary, --color-gray-* 등). 색상 추가/변경은 여기서
src/main/webapp/assets/css/tailwind.css	빌드 결과물. npm run build가 생성하는 파일. 직접 수정 금지
스타일가이드 HTML (3개 파일)
파일	역할
public/basic.html	기본 요소 스타일가이드 (색상, 타이포, 아이콘 등)
public/b01.html	컴포넌트 스타일가이드 (아코디언, 팝오버 등)
public/pe.html	프로그램 스타일가이드. 버튼~버튼배치 25개 섹션 (방금 재작성)
세 파일 모두 ../../css/tailwind.css 하나만 링크. Tailwind 유틸리티 클래스로만 스타일링.

실제 사이트 SCSS (스타일가이드와 별도)

src/main/webapp/assets/scss/
├── layout/         ← 헤더, GNB, 푸터, 서브 레이아웃
├── content/        ← 콘텐츠 페이지
├── main/           ← 메인 페이지
└── program/        ← 프로그램 관련
이 SCSS들은 별도 컴파일 결과물(layout.css, program.css 등)을 가짐. Tailwind와 독립적.

스타일가이드 CSS (현재 미사용)

assets/styleguide/css/
├── basic.css / basic.scss    ← pcms2026 기존 컴포넌트 CSS
├── pe.css / pe.scss          ← pcms2026 프로그램 CSS
└── basic_b01.css, style_b01.css
pe.html을 Tailwind로 재작성했으므로 현재 pe.html에서는 링크 안 함.

수정 방법
1. 색상 토큰 추가/변경
→ src/input.css @theme {} 수정 → npm run build


@theme {
  --color-primary: #2257B4;  /* 여기서 변경 */
  --color-new-color: #XXXXXX; /* 새 토큰 추가 */
}
2. pe.html 컴포넌트 수정
→ public/pe.html 직접 편집

→ 클래스는 Tailwind 유틸리티만 (bg-[#2257B4], min-h-10 등)

→ npm run build (새 클래스 추가 시 필수, 기존 클래스 조합만 바꿀 때는 불필요)

3. 개발 중 실시간 반영

npm run watch   # 파일 저장 시 자동 빌드
4. 실제 사이트 레이아웃/CSS 수정
→ src/main/webapp/assets/scss/ 하위 SCSS 파일 수정
