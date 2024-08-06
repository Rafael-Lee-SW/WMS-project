import React from "react";
import App from "next/app";
import Head from "next/head";
import Header from "/components/Header/HomeHeader.js";
import HeaderLinks from "/components/Header/HomeHeaderLinks.js";
import "/styles/scss/nextjs-material-kit.scss?v=1.2.0";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
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
    const { Component, pageProps, router } = this.props;

    // Define the routes where the header should not be displayed
    const noHeaderRoutes = ["/user/[id]"];

    // Check if the current route matches any of the routes in noHeaderRoutes
    const shouldDisplayHeader = !noHeaderRoutes.includes(router.pathname);

    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>ADN project Template finding</title>
        </Head>
        <SessionProvider session={pageProps.session}>
          {shouldDisplayHeader && (
            <Header
              brand="FIT-BOX"
              rightLinks={<HeaderLinks />}
              fixed
              color="transparent"
              changeColorOnScroll={{ height: 400, color: "white" }}
            />
          )}
          <Component {...pageProps} />
        </SessionProvider>
      </React.Fragment>
    );
  }
}
