import React, { Component } from "react";
import Router from "next/router";
import { useSession, signIn, signOut } from "next-auth/react"

export default class Index extends Component {
  componentDidMount = () => {
    Router.push("/components");
  };

  render() {
    return <div />;
  }
}

export default function Component() {
  const { data: session } = useSession()
  if(session) {
    return <>
      Signed in as {session.user.email} <br/>
      <button onClick={() => signOut()}>Sign out</button>
    </>
  }
  return <>
    Not signed in <br/>
    <button onClick={() => signIn()}>Sign in</button>
  </>
}