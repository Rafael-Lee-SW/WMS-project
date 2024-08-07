export const ResponseCode = {
  SUCCESS: "SU",
  VALIDATION_FAIL: "VF",
  DUPLICATE: "DE",
  SIGN_IN_FAIL: "SF",
  CERTIFICATION_FAIL: "CF",
  MAIL_FAIL: "MF",
  DATABASE_ERROR: "DBE",
};

// 응답 코드에 따른 메시지를 정의합니다.
export const ResponseMessage = {
  [ResponseCode.SUCCESS]: "성공했습니다.",
  [ResponseCode.VALIDATION_FAIL]: "유효성 검사 실패.",
  [ResponseCode.DUPLICATE]: "이메일 중복 입니다.",
  [ResponseCode.SIGN_IN_FAIL]: "로그인 정보 불일치.",
  [ResponseCode.CERTIFICATION_FAIL]: "인증 실패.",
  [ResponseCode.MAIL_FAIL]: "메일 전송 실패.",
  [ResponseCode.DATABASE_ERROR]: "데이터베이스 오류.",
};

// 응답을 처리하는 함수 정의
export function handleResponse(response) {
  const { code, message } = response.data;

  if (ResponseMessage[code]) {
    return ResponseMessage[code];
  } else {
    return "알 수 없는 오류가 발생했습니다.";
  }
}