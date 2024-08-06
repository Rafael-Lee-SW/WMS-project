import React from "react";
import App from "next/app";
import Head from "next/head";
import Header from "/components/Header/HomeHeader.js";
import HeaderLinks from "/components/Header/HomeHeaderLinks.js";
import "/styles/scss/nextjs-material-kit.scss?v=1.2.0";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from '../context/AuthContext';
// material-kit을 쓰기 위한 글로벌 css 선언

export default class MyApp extends App {
  componentDidMount() {
    // let comment = document.createComment(``);
    // document.insertBefore(comment, document.documentElement);
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>Fit-Box</title>
        </Head>
        <SessionProvider session={pageProps.session}>
          <AuthProvider>
          <Header
            brand="FIT-BOX"
            rightLinks={<HeaderLinks />}
            fixed
            color="transparent"
            changeColorOnScroll={{ height: 400, color: "white" }}
          />
          <Component {...pageProps} />
          </AuthProvider>
        </SessionProvider>
      </React.Fragment>
    );
  }
}
