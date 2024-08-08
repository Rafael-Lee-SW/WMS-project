// 필요한 라이브러리 및 React, Axios, Next.js 라우터의 훅을 가져오기
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// Iamport 스크립트를 동적으로 로드하는 함수
const loadIamportScript = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.iamport.kr/v1/iamport.js';
        script.onload = resolve; // 스크립트가 성공적으로 로드되면 Promise를 해결
        script.onerror = reject; // 스크립트 로드에 오류가 발생하면 Promise를 거부
        document.head.appendChild(script); // 스크립트를 document head에 추가
        /**
         * Promise란 비동기 작업의 성공 또는 실패를 나타내는 객체로서 이를 통해 Script를 삽입하고 가맹점 코드를 초기화 시킴
         */
    });
};

// 결제 테스트를 위한 주요 함수형 컴포넌트
export default function PaymentTest() {

    const router = useRouter();

    // useEffect 훅을 사용 -> 페이지가 시작될 때 1번 실행해서 Script를 입력받는다.
    useEffect(() => {

        // useEffect에서 사용할 함수 정의
        const initializeIamport = async () => {
            try {
                await loadIamportScript(); // Iamport 스크립트를 로드
                console.log('Iamport 스크립트가 성공적으로 로드되었습니다.');
                const IMP = window.IMP;
                IMP.init('imp68513146'); // Iamport를 가맹점 코드로 초기화
            } catch (error) {
                console.error('Iamport 스크립트 로드에 실패했습니다:', error); // 스크립트 로드 실패 시 에러 로그
            }
        };

        initializeIamport(); // Iamport 초기화 함수를 호출

    }, []); // 빈 배열을 넣는 이유는 -> 이 효과가 컴포넌트가 마운트될 때 한 번 실행됨을 의미

    // 결제 요청을 처리하는 함수
    const requestPay = () => {
        const IMP = window.IMP; // window 객체에서 Iamport 인스턴스에 접근
        IMP.request_pay(
            {
                pg: 'html5_inicis', // 결제 대행사 시스템 ID
                pay_method: 'card', // 결제 수단
                merchant_uid: 'ORD20180131-0000015', // 주문 번호
                name: 'Test Payment Information', // 결제 설명
                amount: 200, // 결제 금액
                buyer_email: 'kkk@naver.com', // 구매자 이메일
                buyer_name: 'Kim Payment', // 구매자 이름
                buyer_tel: '010-8282-9292', // 구매자 전화번호
                buyer_addr: 'Gangnam-gu, Seoul', // 구매자 주소
                buyer_postcode: '01181', // 구매자 우편번호
            },
            (rsp) => {
                if (rsp.success) {
                    // 결제가 성공한 경우
                    axios({
                        url: '{서버에서 결제 정보를 받을 엔드포인트}', // 서버 엔드포인트로 변경
                        method: 'post', // HTTP 메소드
                        headers: { 'Content-Type': 'application/json' }, // 요청 헤더
                        data: {
                            imp_uid: rsp.imp_uid, // 결제 고유 번호
                            merchant_uid: rsp.merchant_uid, // 주문 번호
                        },
                    })
                        .then((data) => {
                            // 서버 결제 API가 성공했을 때의 처리 로직
                            console.log('결제가 성공적으로 처리되었습니다:', data);
                            router.push('/components'); // 결제 성공 후 홈으로 리다이렉트
                        })
                        .catch((error) => {
                            console.error('서버 결제 API 호출에 실패했습니다:', error); // 오류 로그
                        });
                } else {
                    // 결제가 실패한 경우
                    alert(`결제에 실패했습니다. 오류: ${rsp.error_msg}`); // 사용자에게 결제 실패 알림
                    router.push('/components'); // 결제 실패 후 홈으로 리다이렉트
                }
            }
        );
    };

    /**
     * Test 결제 흐름
     * -> 실제 결제 -> 돈 빠져나감 -> 매일 11시에 환불됨
     */

    return (
        <div>
            <div
                style={{
                    marginTop: "6rem",
                    justifyContent: "center", 
                    alignItems: "center", 
                    display: "flex", 
                }}
            >
                {/* 결제 테스트를 위한 제목 */}
                <h2>Payment Test</h2>
            </div>
            <hr />=
            <div
                style={{
                    justifyContent: "center", 
                    flexDirection: "column", 
                    alignItems: "center",
                    display: "flex", 
                }}
            >
                <h3>아래 버튼을 누르면 10원 결제를 위한 결제창이 뜹니다</h3>
                <br />
                <button onClick={requestPay}>10원 결제하기</button>
            </div>
            <hr /> 
        </div>
    );
}


/**
 * 참고 문서
 * 
 * https://portone.gitbook.io/docs/auth/guide/3.
 * 
 * 위 가이드를 순서대로 따라 코드를 작성함(React.js 코드 존재)
 */