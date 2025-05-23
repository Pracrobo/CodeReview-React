## 🧐 어떤 PR인가요? (What's in this PR?)

- GitHub OAuth 및 JWT를 활용한 사용자 인증 시스템의 프론트엔드 부분을 구현/개선합니다.
- 주요 작업은 로그인 UI, 클라이언트 측 인증 처리, 로그아웃 및 계정 연동 해제 UI/로직입니다.

### 🖥️ Frontend 작업 내용

-   [ ] **GitHub 로그인 버튼 및 관련 UI 구현/수정**
    -   [ ] 로그인 페이지/컴포넌트 UI 개발
    -   [ ] 백엔드 GitHub OAuth 인증 시작점으로 연결하는 로직 구현
-   [ ] **인증 콜백 처리 및 JWT 저장 로직 구현/수정**
    -   [ ] GitHub 인증 후 프론트엔드 콜백 경로 처리 (해당하는 경우, 또는 서버로부터 리다이렉션 후 처리)
    -   [ ] 서버로부터 전달받은 JWT (Access Token, Refresh Token 등)를 안전하게 저장 (예: HttpOnly 쿠키 설정을 위한 백엔드 통신, 또는 localStorage/sessionStorage - 보안 리스크 인지)
    -   [ ] 로그인 상태 관리 로직 구현 (예: Context API, Redux, Zustand 등 활용하여 UI 업데이트)
-   [ ] **API 요청 시 인증 헤더 (JWT) 추가 로직 구현/수정**
    -   [ ] 모든 또는 특정 API 요청 시 저장된 JWT를 `Authorization` 헤더에 첨부 (Axios interceptors, fetch wrapper 등 활용)
-   [ ] **로그아웃 기능 UI 및 로직 구현/수정**
    -   [ ] 클라이언트 측에 저장된 토큰 제거
    -   [ ] 백엔드 로그아웃 API 호출
    -   [ ] 로그아웃 후 로그인 페이지로 리다이렉션 또는 UI 상태 변경
-   [ ] **계정 연동 해제 기능 UI 및 로직 구현/수정**
    -   [ ] 계정 연동 해제 버튼/옵션 UI 개발
    -   [ ] 백엔드 계정 연동 해제 API 호출
    -   [ ] 연동 해제 성공 시 상태 업데이트 (페이지 리다이렉션)

## ✅ PR Checklist

- [ ] 커밋 메시지 컨벤션을 따랐습니다. (feat: Enable user login and logout)
- [ ] 관련 없는 변경 사항은 포함하지 않았습니다.
