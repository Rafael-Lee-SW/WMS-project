import { Button, Input, makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/manageBusinessStyle.js";
import { createBusiness, deleteBusiness, editBusiness } from "../../pages/api";
import { useRouter } from "next/router";

const useStyles = makeStyles(styles);

// 사업자 관리 Component
export default function ManageBusiness({ id, userId, name, businessNumber, statusEnum, onUpdateBusiness }) {
  const classes = useStyles();
  const router = useRouter();

  const initialBusinessInfo = statusEnum !== 'DELETE' ? {
    name: name || '',
    businessNumber: businessNumber || '',
  } : {
    name: '',
    businessNumber: '',
  };

  const [businessInfo, setBusinessInfo] = useState(initialBusinessInfo);
  const [isRegistered, setIsRegistered] = useState(statusEnum !== 'DELETED' && !!businessNumber);

  useEffect(() => {
    if (statusEnum !== 'DELETED') {
      setBusinessInfo({
        name: name || '',
        businessNumber: businessNumber || '',
      });
    } else {
      setBusinessInfo({
        name: '',
        businessNumber: ''
      });
    }
    setIsRegistered(statusEnum !== 'DELETED' && !!businessNumber);
  }, [name, businessNumber, statusEnum]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: businessInfo.name,
        businessNumber: businessInfo.businessNumber
      };
      if (isRegistered) {
        await editBusiness(id, data);
      } else {
        await createBusiness(userId, data);
      }
      onUpdateBusiness(isRegistered ? '수정' : '등록');
    } catch (error) {
      router.push('/404');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBusiness(id);
      setBusinessInfo({ name: '', businessNumber: '' });
      setIsRegistered(false);
    } catch (error) {
      router.push('/404');
    }
  };

  return (
    <div className={classes.container}>
      <h2>사업자 {isRegistered ? '수정' : '등록'}</h2>
      <form onSubmit={handleSubmit}>
        <div className={classes.div}>
          <Input
            type="text"
            name="name"
            value={businessInfo.name || ''}
            onChange={handleChange}
            placeholder="사업자 이름"
            required
          />
        </div>
        <div className={classes.div}>
          <Input
            type="text"
            name="businessNumber"
            value={businessInfo.businessNumber || ''}
            onChange={handleChange}
            placeholder="사업자 번호"
            required
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
