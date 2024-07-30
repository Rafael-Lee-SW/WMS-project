import { Button, Input, makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/manageBusinessStyle.js";
import { deleteBusiness, editBusiness } from "../../pages/api";

const useStyles = makeStyles(styles);

// 사업자 관리
export default function ManageBusiness({ id, name, businessNumber }) {
  const classes = useStyles();

  // name 에 값이 있으면 그 값을 사용, 없으면 빈 값 사용
  const [businessInfo, setBusinessInfo] = useState({
    name: name || '',
    businessNumber: businessNumber || '',
  });

  // businessNumber 가 존재하는 지를 boolean 값으로 변환
  const [isRegistered, setIsRegistered] = useState(!!businessNumber);

  useEffect(() => {
    setBusinessInfo({
      name: name || '',
      businessNumber: businessNumber || '',
    });
    setIsRegistered(!!businessNumber);
  }, [name, businessNumber]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setBusinessInfo((prevInfo) => ({
      ...prevInfo,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', businessInfo.name);
    formData.append('businessNumber', businessInfo.businessNumber);

    useEffect(() => {
      const changeBusiness = async () => {
        try {
          const data = {
            "name" : businessInfo.name,
            "businessNumber" : businessInfo.businessNumber
          }
          editBusiness(id, data)
        } catch (error) {
          console.log(error)
        }
      }
      changeBusiness();
  }, [])};

  const handleDelete = () => {
    useEffect(() => {
      const removeBusiness = async () => {
        try {
          deleteBusiness(id)
          setBusinessInfo({ name: '', businessNumber: ''});
          setIsRegistered(false);
        } catch (error) {
          console.log(error)
        }
      }
      removeBusiness();
  }, [])};

  return (
    <div className={classes.container}>
      <h2>사업자 {isRegistered ? '수정' : '등록'}</h2>
      <form onSubmit={handleSubmit}>
        <div className={classes.div}>
          <Input
            type="text"
            name="businessName"
            value={businessInfo.name}
            onChange={handleChange}
            placeholder="사업자 이름"
          />
        </div>
        <div className={classes.div}>
          <Input
            type="text"
            name="businessNumber"
            value={businessInfo.businessNumber}
            onChange={handleChange}
            placeholder="사업자 번호"
          />
        </div>
        <Button 
          type="submit"
          className={classes.button}
        >
          {isRegistered ? '수정' : '등록'}
        </Button>
        {isRegistered && (
        <Button onClick={handleDelete} className={classes.button}>
          삭제
        </Button>
      )}
      </form>
    </div>
  );
};

