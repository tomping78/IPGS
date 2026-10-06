# Fish & Richardson - "IP" Generative Circuit Sketch

미국 최고의 특허/지식재산권 로펌 **Fish & Richardson (https://www.fr.com/)** 메인 히어로 캔버스의 제너레이티브 전자 회로 스케치를 순수하게 구현한 프로젝트입니다.

---

## 🌟 핵심 특징

- **완벽한 알고리즘 복원**:
  - `public/IP.jpg` 픽셀 마스크를 기반으로 알파벳 **"IP"** 형태를 이루는 입자 매트릭스 생성
  - 12개의 회로 트리(`Tree`)가 쿼드트리(QuadTree) 공간 분할을 통해 최단 경로를 탐색하며 뻗어나가는 절차적 분기(Procedural Circuit Growth)
  - 톱니 패턴 트랙(Saw Tracks), 크로스헤어(Crosshairs), 트랙을 따라 흐르는 신호 파티클 구현
  - 회로 끝점에서 방사형으로 퍼져나가는 동심원/사각형 펄스 파동(Radar Pulse)
  - 15초 주기 자동 재생성 및 마우스 클릭 / 스페이스바 즉시 리셋 인터랙션
- **사각형/원형 파동 선택 가능**:
  - `src/App.jsx` 상단 옵션의 `pulseShape: 'rect'` (사각형) 또는 `'circle'` (원형)으로 언제든 전환 가능
- **100% 폐쇄망(오프라인 / Air-gapped) 지원**:
  - 외부 CDN, 외부 폰트, 외부 API 의존성 0%
  - 모든 라이브러리(`p5.min.js`) 및 에셋(`IP.jpg`, `logo-fish.svg`) 로컬 내장

---

## 📁 프로젝트 구조

```
ipgs/
├── public/
│   ├── IP.jpg              # "IP" 형상을 구성하는 픽셀 마스크 이미지
│   ├── logo-fish.svg       # 파비콘 아이콘
│   └── p5.min.js           # 로컬 p5.js (v1.9.0) 라이브러리
├── src/
│   ├── App.jsx             # 제너레이티브 회로 캔버스 단독 React 컴포넌트
│   └── main.jsx            # React 18 루트 마운트
├── dist/                   # 폐쇄망 즉시 배포용 정적 빌드 산출물
├── index.html              # 메인 HTML 템플릿
├── test_sketch.html        # 리액트 없이 브라우저에서 바로 열 수 있는 단독 HTML 버전
├── package.json
└── vite.config.js          # 상대 경로(base: './') 빌드 설정
```

---

## 🚀 실행 및 빌드

### 1. 로컬 개발 서버 실행
```bash
npm run dev
# 브라우저에서 http://localhost:5173 접속
```

### 2. 프로덕션 빌드
```bash
npm run build
# dist/ 폴더에 모든 정적 파일 생성
```

---

## 🛡️ 폐쇄망(오프라인) 배포 가이드

1. **빌드 산출물 배포 (가장 권장)**:
   - 외부망에서 `npm run build` 후 생성된 `dist/` 폴더 전체를 폐쇄망으로 반입
   - 폐쇄망 내부 웹서버(Nginx, Apache, IIS, Tomcat 등)에 등록만 하면 Node.js 설치 없이 즉시 구동
2. **폐쇄망 내에서 개발/수정할 경우**:
   - `node_modules` 폴더를 포함하여 프로젝트 전체를 압축 후 폐쇄망으로 반입하여 사용
3. **단독 HTML 실행**:
   - `test_sketch.html`, `public/p5.min.js`, `public/IP.jpg` 3개 파일만 같은 폴더에 두고 로컬 웹서버로 접속
