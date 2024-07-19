

#  Web WMS(Warehouse Management System) Project README

![readme_mockup2](/READMEfile/main.png )

- 배포 URL :
- Test ID :
- Test PW :

<br>

## 프로젝트 소개

**Web WMS는 무인 매장이나 창고에서 여러 위치의 재고를 효율적으로 관리할 수 있는 재고 관리 시스템입니다.** <br><br>
**다음과 같은 기능으로 다중 로케이션의 재고를 효율적으로 관리합니다.**
- 적정 재고 수준 유지
- 매장 품절율 최소화
- 재고 공간 최적화
- 작업자 동선 최소화 
- 수요 예측



<br>

## 팀원 구성

<div align="center">

| **김유석** | **이한솔** | **이수완** | 
| :------: |  :------: | :------: | 
| [<img src="/READMEfile/yuseok.jpg" height=150 width=100> <br/> @유석](https://it-whale.tistory.com/) | [<img src="/READMEfile/hansol.jpg" height=150 width=100> <br/> @한솔](https://github.com/solmysoul1) | [<img src="/READMEfile/soowan.jpg" height=150 width=100> <br/> @수완](https://github.com/heejiyang) | 

| **이동열** | **김준혁** |  **신권일** |
| :------: | :------: | :------: |
| [<img src="/READMEfile/dongyeol.jpg" height=150 width=100> <br/> @동열](https://it-whale.tistory.com/) | [<img src="/READMEfile/junhyeok.png" height=150 width=100> <br/> @준혁](https://github.com/Cheorizzang) | [<img src="/READMEfile/kyunil.jpg" height=150 width=100> <br/> @권일](https://github.com/heejiyang) | 




</div>

<br>

## 1. 개발 환경



- Front : HTML, React
- Back-end : SpringBoot :3.3.1 , JDK : 17 , mySql , MicroServiceArchitecture
- 버전 및 이슈관리 : Gitlab, Gitlab Issues, Gitlab Project
- 협업 툴 : Jira ,Discord, Notion, 
- 서비스 배포 환경 : Docker
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
    

### Jpa

### Mysql

### 브랜치 전략
<img src="/READMEfile/Branch strategy.png">

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


<br>

### 김준혁

<br>

### 신권일

<br>

### 이한솔

<br>

### 이수완

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

### 상품등록

### 로케이션 등록

### 입고 등록 (로케이션 이동)

### 창고별 재고 조회

### 로케이션별 재고 조회

### 상품별 조회

### 출고 등록 

### 알람 기능 

### 경로 압축 








<br>

## 8. 트러블 슈팅

## 2024-07-18 문제 해결 내용
### Soft Delete 적용
- **문제 상황**: 프로젝트에서 JPA를 사용하여 소프트 딜리트(Soft Delete)를 일괄적으로 적용해야 하는 상황이 발생했습니다.
- **해결 방안**: `@SQLRestriction` 어노테이션을 통해 소프트 딜리트 기능을 구현하여 문제를 해결했습니다.

    ```java
    @Entity
    @Getter
    @NoArgsConstructor
    @SQLRestriction("status_enum = 'Active'")
    @Table(name = "product")
    public class Product extends BaseTimeEntity {
        // ...
    }
    ```
- **시도했던 방법**: 최초에는 `@Where` 어노테이션을 통해 문제를 해결하려고 했습니다.
    - 그러나 현재 Hibernate 버전에서는 해당 어노테이션이 Deprecated 상태입니다.
- **최종 해결 방법**: `@SQLRestriction` 어노테이션을 통해 소프트 딜리트를 구현했습니다.
    - 적용이 되지 않아야 하는 쿼리에 대해서는 JPA Repository에서 `@Query` 어노테이션을 사용하여 해결했습니다.

## 2024-07-19 문제 해결 내용
### Entity 순환참조 해결
- **문제 상황**: A엔티티 안에 B엔티티 정보가 있고, B엔티티 안에 A엔티티가 있어서 발생한 순환참조 문제
- **해결 방안**: 객체를 그대로 리턴하는 것이 아닌, Dto에 담아서 리턴.



<br>

## 9. 개선 목표

- **24-00-00 성능 개선 내용**
### indexing 
- 물류 데이터 속도 개선

### 정규화 반정규화
- 물류 데이터 속도 개선 
    
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

