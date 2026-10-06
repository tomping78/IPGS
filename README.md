
## 📁 프로젝트 구조

```
ipgs/
├── public/
│   ├── IP.jpg              # "IP" 형상을 구성하는 픽셀 마스크 이미지
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
