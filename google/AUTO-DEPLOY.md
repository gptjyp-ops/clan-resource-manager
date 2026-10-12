# 구글 스크립트 자동 업데이트

현재 상태: 자동 배포 코드는 준비되어 있습니다. 최초 구글 계정 연결 전에는 배포를 건너뛰고 ‘계정 연결 대기’로 표시합니다. 준비 완료와 실제 연결 완료는 다릅니다.

## 최초 연결 — 한 번만

1. [구글 스크립트](https://script.google.com/home)에서 기존 프로젝트를 열고 왼쪽 **프로젝트 설정(톱니바퀴)** → **스크립트 ID**를 복사합니다. 웹 앱 URL의 AKfy… 배포 ID와 다른 값입니다.
2. Windows PC에 Node.js 22 이상과 GitHub CLI가 설치되어 있어야 합니다. 설치 링크: https://nodejs.org/ · https://cli.github.com/
3. 이 저장소의 `google/connect-auto-deploy.ps1` 파일을 내려받습니다. PowerShell에서 내려받은 폴더로 이동하고 아래 명령을 실행합니다. `스크립트ID`만 실제 값으로 바꿉니다.

```powershell
powershell -ExecutionPolicy Bypass -File .\connect-auto-deploy.ps1 -ScriptId "스크립트ID"
```

4. GitHub 로그인 창에서 이 저장소를 관리하는 계정으로 로그인합니다. 열린 [Apps Script 사용자 설정](https://script.google.com/home/usersettings)에서 **Google Apps Script API**를 켜고 PowerShell로 돌아와 Enter를 누릅니다.
5. 구글 로그인 창에서 현재 스크립트의 소유 계정으로 로그인·승인합니다. 인증은 clasp가 처리합니다. 연결 파일은 인증 정보를 GitHub Secrets에 등록하고 로컬 임시 파일을 삭제합니다.
6. [자동 배포 실행 결과](https://github.com/gptjyp-ops/clan-resource-manager/actions/workflows/google.yml)에서 **Update existing Google web app** 단계가 성공했는지 확인합니다. 최초 연결 대기 메시지만 있으면 아직 연결되지 않은 것입니다.

필요한 Secrets는 `GAS_SCRIPT_ID`, `GAS_DEPLOYMENT_ID`, `GAS_OAUTH_JSON`입니다. 이 값들은 공개 코드나 채팅에 붙여넣지 마세요. 연결 파일은 GitHub Secrets에 직접 전달합니다.

## 연결 이후

- main 브랜치의 `google/Code.gs` 또는 `google/Bridge.html`이 바뀌면 백엔드 테스트 후 자동 배포합니다.
- 기존 배포를 새 버전으로 업데이트하므로 클랜원이 사용하는 링크는 유지됩니다.
- 기존 manifest·다른 프로젝트 파일·시트·사진·스크립트 속성을 유지합니다. 초기화 함수를 실행하지 않습니다.
- 폰에서 다시 실행하려면 GitHub **Actions → Update Google Apps Script → Run workflow → main**을 선택합니다.
- 구글에서 인증을 취소하거나 연결이 만료되면 최초 연결 파일을 다시 실행해야 합니다.
- 편집창과 GitHub 양쪽에서 동시에 수정하지 마세요. GitHub의 Code.gs·Bridge.html이 이후 배포 기준입니다.

## 실패했을 때

- ‘계정 연결 대기’: 세 Secrets가 아직 없습니다. 최초 연결을 완료합니다.
- 인증 갱신 실패: 구글 계정 연결을 다시 합니다.
- HTTP 403: 사용자 설정의 Apps Script API 활성화와 로그인 계정의 프로젝트 권한을 확인합니다. 자체 OAuth 클라이언트를 쓸 경우 Google Cloud 프로젝트의 Apps Script API도 활성화해야 합니다.
- 배포 ID 오류: `GAS_SCRIPT_ID`는 프로젝트 설정에서, `GAS_DEPLOYMENT_ID`는 현재 배포 주소에서 확인합니다.
- ‘구글 편집 내용 변경’: 편집을 마치고 다시 실행합니다.

이 스크립트는 새 버전을 만든 뒤 현재 웹 앱 배포를 업데이트합니다. 업데이트가 실패하면 다른 편집이 없을 때만 편집창 내용을 복원합니다. 네트워크 오류로 마지막 요청의 처리 여부가 불분명하면 실행 결과와 배포 버전을 확인하세요.

## 공식 문서

- https://developers.google.com/apps-script/api/reference/rest/v1/projects/updateContent
- https://developers.google.com/apps-script/api/reference/rest/v1/projects.deployments/update
- https://github.com/google/clasp
