import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Card from "/components/Card/Card.js";
import CardHeader from "/components/Card/CardHeader.js";
import CardBody from "/components/Card/CardBody.js";
import Button from "/components/CustomButtons/Button.js";

import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/loginStyle.js";
import { signIn, signOut, useSession } from 'next-auth/react';
``
const useStyles = makeStyles(styles);

// 고용인 소셜 로그인
export default function employeeLogin() {
  const { data: session, status } = useSession();
  const classes = useStyles();
  
  return (
    <div className={classes.section}>
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
                      <Button
                        fullWidth
                        onClick={() => signIn('google')}
                        className={classes.button}
                      >
                        <img 
                          src="/img/google.png"
                          alt="Sign in with Google"
                          style={{ width: '220px', height: '45px' }}
                          className={classes.buttonImage}
                        />
                      </Button>
                      <Button
                        fullWidth
                        onClick={() => signIn('naver')}
                        className={classes.button}
                      >
                        <img 
                          src="/img/naver.png"
                          alt="Sign in with Naver"
                          style={{ width: '220px', height: '45px' }}
                        />
                      </Button>
                      <Button
                        fullWidth
                        onClick={() => signIn('kakao')}
                        className={classes.button}
                      >
                        <img 
                          src="/img/kakao.png"
                          alt="Sign in with Kakao"
                          style={{ width: '220px', height: '45px' }}
                        />
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
