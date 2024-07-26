import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Card from "/components/Card/Card.js";
import CardHeader from "/components/Card/CardHeader.js";
import CardBody from "/components/Card/CardBody.js";
import Button from "/components/CustomButtons/Button.js";
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/loginStyle.js";
import { Input } from '@material-ui/core';

const useStyles = makeStyles(styles);

// 사장 로그인 기능
export default function PresidentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const classes = useStyles();
  const { data: session, status } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.status === 200) {
        router.push('/')
      }
    } catch (error) {
      alert('잘못된 사용자입니다.');
    }
  };

  return (
    <div className={classes.section} onSubmit={handleSubmit}>
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <form className={classes.form}>
                <CardHeader className={classes.cardHeader}>
                  <h4>로그인</h4>
                </CardHeader>
                
                <CardBody className={classes.cardBody}>
                  {status === 'loading' ? (
                    <p>Loading...</p>
                  ) : !session ? (
                    <>
                      <Input
                        fullWidth
                        className={classes.input}
                        type="text"
                        placeholder='아이디'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                      >
                      </Input>
                      <Input
                        fullWidth
                        className={classes.input}
                        type="password"
                        placeholder='비밀번호'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      >
                      </Input>
                      <Button
                        fullWidth
                        type="submit"
                      >
                        로그인
                      </Button>
                    </>
                  ) : (
                    <>
                      <p>Logged in as {session.user.email}</p>
                      <Button
                        fullWidth
                        color="default"
                        onClick={() => signOut()}
                        className={classes.signOutButton}
                      >
                        Sign out
                      </Button>
                    </>
                  )}
                </CardBody>
              </form>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  
  );
}
