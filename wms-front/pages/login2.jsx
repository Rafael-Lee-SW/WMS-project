// import React from "react";
// // @material-ui/core components
// import { makeStyles } from "@material-ui/core/styles";

// // core components
// import GridContainer from "/components/Grid/GridContainer.js";
// import GridItem from "/components/Grid/GridItem.js";
// import Card from "/components/Card/Card.js";
// import CardHeader from "/components/Card/CardHeader.js";
// import CardBody from "/components/Card/CardBody.js";
// import Button from "/components/CustomButtons/Button.js";

// import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/loginStyle.js";
// import { signIn, signOut, useSession } from 'next-auth/react';

// const useStyles = makeStyles(styles);

// export default function SectionLogin() {
//   const { data: session, status } = useSession();
//   const classes = useStyles();
  
//   return (
//     <div className={classes.section}>
//       <div className={classes.container}>
//         <GridContainer justify="center">
//           <GridItem xs={12} sm={6} md={4}>
//             <Card>
//               <form className={classes.form}>
//                 <CardHeader color="primary" className={classes.cardHeader}>
//                   <h4>로그인</h4>
//                 </CardHeader>
                
//                 <CardBody>
//                   {status === 'loading' ? (
//                     <p>Loading...</p>
//                   ) : !session ? (
//                     <>
//                       <Button
//                         fullWidth
//                         color="default"
//                         onClick={() => signIn('google')}
//                         className={classes.googleButton}
//                       >
//                         <img 
//                           src="img/google-login.png"
//                           alt="Sign in with Google"
//                           style={{ width: '180px', height: '45px' }}
//                           className={classes.googleButtonImage}
//                         />
//                       </Button>
//                       <Button
//                         fullWidth
//                         color="default"
//                         onClick={() => signIn('naver')}
//                         className={classes.naverButton}
//                       >
//                         <img 
//                           src="img/naver-login.png"
//                           alt="Sign in with Naver"
//                           style={{ width: '180px', height: '45px' }}
//                           className={classes.naverButtonImage}
//                         />
//                       </Button>
//                       <Button
//                         fullWidth
//                         color="default"
//                         onClick={() => signIn('kakao')}
//                         className={classes.kakaoButton}
//                       >
//                         <img 
//                           src="img/kakao-login.png"
//                           alt="Sign in with Kakao"
//                           style={{ width: '200px', height: '45px' }}
//                           className={classes.kakaoButtonImage}
//                         />
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <p>Logged in as {session.user.email}</p>
//                       <Button
//                         fullWidth
//                         color="default"
//                         onClick={() => signOut()}
//                         className={classes.signOutButton}
//                       >
//                         Sign out
//                       </Button>
//                     </>
//                   )}
//                 </CardBody>
//               </form>
//             </Card>
//           </GridItem>
//         </GridContainer>
//       </div>
//     </div>
//   );
// }
