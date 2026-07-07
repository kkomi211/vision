# 비전툴 - 공구 재고정리 홈페이지

순수 HTML/CSS/JS로 만든 정적 사이트입니다. 별도 서버나 DB 없이 GitHub Pages로 무료 배포할 수 있습니다.
직접 결제/주문 기능은 없고, 상품마다 있는 "카카오톡으로 문의하기" 버튼을 누르면 카카오톡 ID가 안내됩니다.

## 1. 내용 수정하기

- **사이트 이름, 카카오톡 ID, 안내문구** → [js/config.js](js/config.js)
  - `kakaoId` 를 실제 카카오톡 ID로 꼭 바꿔주세요. (현재는 예시값 `visiontool_kakao` 입니다)
- **상품 목록** → [js/products.js](js/products.js)
  - 배열 안의 항목을 복사해서 추가/삭제/수정하면 됩니다. 각 필드 설명은 파일 맨 위 주석 참고.
  - 사진이 있으면 `images/` 폴더에 넣고 `image: "images/파일명.jpg"` 로 지정하세요. 사진이 없으면 `image: ""` 로 두면 카테고리 아이콘이 대신 표시됩니다.

코드를 몰라도 이 두 파일의 텍스트/숫자만 바꾸면 됩니다. HTML 태그(`<`, `>`)는 건드리지 않도록 주의하세요.

## 2. 로컬에서 미리보기

VSCode를 쓴다면 "Live Server" 확장을 설치해 index.html에서 우클릭 → Open with Live Server.

또는 터미널에서:
```
cd visiontool
python -m http.server 8000
```
그 다음 브라우저에서 http://localhost:8000 접속.

## 3. GitHub Pages로 무료 배포하기

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

이후 상품을 추가/수정할 때마다:
```
git add .
git commit -m "상품 정보 업데이트"
git push
```
을 실행하면 사이트에 자동 반영됩니다 (1~2분 소요).
