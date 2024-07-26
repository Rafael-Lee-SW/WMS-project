

#  Web WMS(Warehouse Management System) Project README

![readme_mockup2](/uploads/468f9ee1011ccdc80943d8778d7e5eee/image.png )

- 배포 URL :
- Test ID :
- Test PW :

<br>

## 프로젝트 소개

- Web WMS는 개인 혹은 중소규모 사업장에서도 재고관리 시스템을 사용할 수 있도록 하는 Web 서비스 입니다.
- Web WMS는 다음과 같은 기능에 집중하여 물류비 감소를 도와주는 재고 관리 시스템입니다. 
- 적정 재고 수준 유지
- 재고 비용 감소
- 재고 공간 최적화
- 작업자 동선 최소화 



<br>

## 팀원 구성

<div align="center">

| **김유석** | **이한솔** | **이수완** | 
| :------: |  :------: | :------: | 
| [<img src="/uploads/93d59f2acb4947bdd1e3e63679aa02f0/3489BB53-1715-4F13-A0A5-E165584953DD.jpg" height=150 width=100> <br/> @유석](https://it-whale.tistory.com/) | [<img src="/uploads/ce687618dd49a792be2d1dfc927e08a1/61B0F576-9A0A-4B70-A275-F8A1A565076F.jpg" height=150 width=100> <br/> @한솔](https://github.com/solmysoul1) | [<img src="/uploads/8d327a35818c9edcc06482cd052fe9bf/rn_image_picker_lib_temp_e3630312-496e-4fcd-ab13-a41959f33e73__1_.jpg" height=150 width=100> <br/> @수완](https://github.com/heejiyang) | 

| **이동열** | **김준혁** |  **신권일** |
| :------: | :------: | :------: |
| [<img src="/uploads/426e016e72e6efe7c5b338daee8134e1/이동열님_반명함_제출용_용량작게_크기작게.jpg" height=150 width=100> <br/> @동열](https://it-whale.tistory.com/) | [<img src="/uploads/9b797e71c23b6c1296618bf8a1db29e8/image.png" height=150 width=100> <br/> @준혁](https://github.com/Cheorizzang) | [<img src="/uploads/fae8579604bac9c9db0e6d7774301393/신권일_사진.jpg" height=150 width=100> <br/> @권일](https://github.com/heejiyang) | 




</div>

<br>

## 1. 개발 환경



- Front : HTML, React, Next.js, Node.js 20.15.0
- Back-end : SpringBoot :3.3.1 , JDK : 17 , mySql , MicroServiceArchitecture
- 버전 및 이슈관리 : Gitlab, Gitlab Issues, Gitlab Project
- 협업 툴 : Jira ,Discord, Notion, 
- 서비스 배포 환경 : Docker
- 보안 : OAuth 2.0, spring Security
- 컨벤션 : https://google.github.io/styleguide/javaguide.html
<br>

## 2. 채택한 개발 기술과 브랜치 전략

### React, styled-component, Next.js

##### React.js 사용 이유 
1. 우리의 프로젝트에서 핵심 기능을 담당하는 재고관리의 시각화(2D 시각화 - 실시간 연동) 기술에 대한 Library 및 예시가 React.js에 풍부하게 존재하는 점
2. React를 통해 최소한의 DOM 수정으로 효율적이고 Interactive한 기능을 제공하기 위함

##### Next.js 사용 이유
1. React.js 만을 사용하여 client-side-rendering으로는 한꺼번에 오가는 수많은 데이터를 처리하는데 성능 및 속도 저하가 예상되어 이를 Server-side-rendering으로 처리할 수 있으며, React.js Library를 사용할 수 있는 Next.js를 사용하기로 결정
2. Backend와 잦은 데이터 교환 및 API 통신에 따라 그에 유리한 FrontEnd Framework로 선택됨.
    
##### FrontEnd Library 사용 현황
0. React Library : 반응형 웹을 만들기위해 React 도입
1. Konva library : Canvas에서 자유롭게 그림을 그리고 도형을 추가할 수 있는 라이브러리
2. SheetJs : Excel 불러오고, 다운로드 받고, 이를 JSON화 시키는 데에 활용
3. HandsonTable : SheetJs로 불러온 데이터를 실제 Excel처럼 가공하는데에 특화
4. Material-ui : 아이콘, 디자인적 요소에 도움
5. mui-datatables : 수정이 어렵지만 Ui적으로 깔끔하게 Excel을 제시하는 라이브러리
6. lodash.debounce : Function 최적화를 위해서 도입한 라이브러리(현재는 사용 X)

### Jpa

### Mysql

### 브랜치 전략
<img src="/uploads/ab407df174ce97be5002af51cbb2db93/image.png">

## Commit Message
#태그 : 제목의 형태이며 :뒤에만 space가 있음에 유의한다.
- `feat` : 새로운 기능 추가
- `fix` : 버그 수정
- `docs` : 문서 수정
- `style` : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- `refactor` : 코드 리펙토링
- `test` : 테스트 코드, 리펙토링 테스트 코드 추가
- `chore` : 빌드 업무 수정, 패키지 매니저 수정



<br>

## 3. 프로젝트 구조

<br>

## 4. 역할 분담

### 김유석

- **기획**
    
- **BE**

- **FE보조**
    

<br>
    
### 이동열

- **UI**

- **기능**
 

<br>

### 김준혁

- **UI**

- **기능**
  

<br>

### 신권일

- **UI**
 
- **기능**

    
<br>

### 이한솔

- **UI**
 
- **기능**

<br>

### 이수완

- **UI**
 
- **기능**

<br>

## 5. 개발 기간 및 작업 관리

### 개발 기간

- 전체 개발 기간 : 2024-07-08 ~ 2024-08-16
- BE 구현 : 
- FE 구현 :
- 배포  :

<br>

### 작업 관리





<br>

## 7. 페이지별 기능

### 로그인
- 로그인
- 로그아웃
- 회원정보수정
- 권한 부여

### 상품등록

### 로케이션 등록

### 입고 등록 (로케이션 이동)

### 창고별 재고 조회

### 로케이션별 재고 조회

### 상품별 조회

### 출고 등록 
- 송장번호 상품 수량 Excel 업로드

### 알람 기능 
- 발주 알림
- 재고 보충 알림 -> 확인 시 재고 이동
- 재고 미전시 알림 -> 확인 시 재고 이동 

### 경로 압축 
 - 재고 배치 비효율 알림 -> 확인버튼 -> TO로케이션 FROM 로케이션 WHAT상품 수량 출력(알림)
  -> 재고 이동(압축)










<br>

## 8. 트러블 슈팅



<br>

## 9. 개선 목표

- **24-07-30 성능 개선 내용**
    
    ![성능개선 후](https://user-images.githubusercontent.com/106502312/212872369-7ceeb2cf-d551-41d2-bfb0-01e35e9903fe.png)
    
    - 이미지 최적화
        - `<img>` 요소에 `width` , `height` 속성값을 명시해 불필요한 Reflow를 방지했습니다.
        - browser-image-compression 라이브러리를 사용해 유저가 업로드하는 이미지를 압축했습니다.
        - Intersection Observer API를 사용해 Lazy Loading 기법을 적용하여 홈 피드의 게시글 이미지가 viewport 내에 들어오는 순간 로딩되도록 변경했습니다.
    - 웹폰트 최적화
        - WOFF2 포맷을 추가하고 가장 우선적으로 적용되도록 선언했습니다.
        - 서브셋 폰트로 교체해 용량을 줄였습니다.
    
<br>

## 10. 프로젝트 후기

### 김유석

    

<br>
    
### 이동열


 

<br>

### 김준혁



<br>

### 신권일



    
<br>

### 이한솔


<br>

### 이수완

