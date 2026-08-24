# 비전툴 - 공구 재고정리 홈페이지

HTML/CSS/JS로 만든 사이트이며, GitHub Pages로 무료 배포합니다. 상품 데이터는 무료 DB 서비스인
[Supabase](https://supabase.com)에 저장되고, 관리자 페이지에서 로그인 후 웹 화면만으로 상품을
등록/수정/삭제할 수 있습니다. 코드나 git을 몰라도 됩니다.

직접 결제/주문 기능은 없고, 상품마다 있는 "카카오톡으로 문의하기" 버튼을 누르면 카카오톡 ID가 안내됩니다.

## 1. Supabase 설정하기 (최초 1회만 하면 됨)

1. [supabase.com](https://supabase.com) 에서 무료 회원가입 후 새 프로젝트를 만듭니다. (신용카드 등록 불필요)
2. 프로젝트 대시보드 왼쪽 메뉴에서 **SQL Editor** 로 이동 → New query 클릭.
3. 이 저장소의 [supabase/schema.sql](supabase/schema.sql) 파일 내용을 전부 복사해서 붙여넣고 **Run** 실행.
   - 상품 테이블, 보안 정책, 사진 저장용 스토리지 버킷이 한 번에 만들어집니다.
   - 테스트 삼아 예시 상품을 넣어보고 싶다면 [supabase/seed.sql](supabase/seed.sql) 내용도 이어서 실행하세요.
4. 왼쪽 메뉴 **Authentication → Users** 로 이동 → **Add user** 클릭 → 관리자(아버지)가 로그인할
   이메일과 비밀번호를 직접 입력해서 계정을 만듭니다. (이메일 인증 없이 바로 로그인 가능하도록 "Auto Confirm User" 체크)
5. **매우 중요 (보안)**: 왼쪽 메뉴 **Authentication → Providers → Email** 에서
   **"Allow new users to sign up"** 옵션을 꺼주세요. 이걸 꺼야 다른 사람이 임의로 회원가입해서
   관리자 페이지에 들어오는 것을 막을 수 있습니다. 관리자 계정은 4번에서 만든 것 하나만 쓰면 됩니다.
6. **Project Settings → API** 로 이동해서 **Project URL** 과 **anon public key** 두 값을 복사합니다.
7. 이 저장소의 [js/supabase-client.js](js/supabase-client.js) 파일을 열어서
   `SUPABASE_URL` 과 `SUPABASE_ANON_KEY` 값을 방금 복사한 실제 값으로 바꿔주세요.
   (이 키는 공개되어도 안전하도록 설계된 값입니다. 실제 데이터 보호는 3번에서 설정한 보안 정책이 담당합니다.)

이제 설정 끝입니다. 아래처럼 사용하면 됩니다.

## 2. 상품 등록/수정/삭제하기 (관리자 페이지)

1. 사이트 하단 "관리자 로그인" 링크 또는 `admin-login.html` 페이지로 접속.
2. 4번에서 만든 이메일/비밀번호로 로그인.
3. 상품명, 카테고리, 가격, 상태 설명, 사진 등을 입력하고 "저장하기"를 누르면 바로 홈페이지에 반영됩니다.
4. 이미 등록된 상품은 목록에서 "수정" / "삭제" 버튼으로 관리할 수 있습니다.
5. 다 쓰셨으면 "로그아웃" 버튼을 눌러주세요.

> 관리자 페이지 주소와 비밀번호는 가족 외 다른 사람에게 알려주지 마세요.

## 3. 사이트 이름 / 카카오톡 ID 수정하기

- [js/config.js](js/config.js) 에서 사이트 이름, 카카오톡 ID, 영업시간, 안내 문구를 수정하세요.
  - `kakaoId` 를 실제 카카오톡 ID로 꼭 바꿔주세요. (현재는 예시값 `visiontool_kakao` 입니다)
- 코드를 몰라도 이 파일의 텍스트만 바꾸면 됩니다. 따옴표(`"`)는 지우지 않도록 주의하세요.

## 4. 로컬에서 미리보기

VSCode를 쓴다면 "Live Server" 확장을 설치해 index.html에서 우클릭 → Open with Live Server.

또는 터미널에서:
```
cd visiontool
python -m http.server 8000
```
그 다음 브라우저에서 http://localhost:8000 접속.

## 5. GitHub Pages로 무료 배포하기

1. github.com 에서 새 저장소(Repository)를 만듭니다. (예: `visiontool`, Public으로 설정)
2. 이 폴더에서 아래 명령어 실행 (README와 함께 이미 git 저장소로 초기화되어 있습니다):
   ```
   git remote add origin https://github.com/내계정/visiontool.git
   git branch -M main
   git push -u origin main
   ```
3. GitHub 저장소 페이지 → Settings → Pages 로 이동
4. Source를 "Deploy from a branch"로, Branch를 `main` / `/(root)` 로 설정 후 저장
5. 몇 분 후 `https://내계정.github.io/visiontool/` 주소로 접속 가능합니다.

배포 후에는 상품을 추가/수정할 때 git을 쓸 필요가 없습니다. 관리자 페이지에서 바로 등록하면 됩니다.
(사이트 이름, 카카오톡 ID처럼 [js/config.js](js/config.js) 파일 자체를 고친 경우에만 `git add`, `git commit`, `git push` 가 필요합니다.)
