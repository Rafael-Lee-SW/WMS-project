import React from "react";
import App from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import "/styles/scss/nextjs-material-kit.scss?v=1.2.0";
import '../styles/globals.css';
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
          <title>ADN project Template finding</title>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin = "true"/>
          <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR&family=Nanum+Brush+Script&family=Nanum+Gothic+Coding&display=swap" rel="stylesheet"/>
        </Head>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </React.Fragment>
    );
  }
}
