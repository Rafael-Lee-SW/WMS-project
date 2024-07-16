import styled from "styled-components";
import Button from "/components/CustomButtons/Button.js";
// import MailIcon from "../public/svg/mail.svg";
// import PersonIcon from "../public/svg/person.svg";
// import PasswordIcon from "../public/svg/password.svg";

const Container = styled.form`

    width: 568px;
    padding: 32px;
    background-color: white;

    .input-wrapper {
    position: relative;
    margin-bottom: 16px;
    input {
        position: relative;
        width: 100%;
        height: 46px;
        padding: 0 44px 0 11px;
        border: 1px solid;
        border-radius: 4px;
        font-size: 16px;
        outline: none;
        ::placeholder {
            color: gray;
        }
      }
    svg {
        position: absolute;
        right: 11px;
        top: 16px;
      }
    }
    `;

// 회원가입 폼
const SignUp = () => {
    return (
        <Container>
            <div>
                <h2>회원가입</h2>
            </div>
            <div className="input-wrapper">
                <input type="email" name="email" placeholder="이메일 주소" />
                {/* <MailIcon /> */}
            </div>
            <div className="input-wrapper">
                <input placeholder="이름(예:홍길동)" />
                {/* <PersonIcon /> */}
            </div>
            <div className="input-wrapper">
                <input type="password" placeholder="비밀번호 설정하기" />
                {/* <PasswordIcon /> */}
            </div>
            <Button color="primary">회원가입</Button>
        </Container>
    )
}

export default SignUp;

