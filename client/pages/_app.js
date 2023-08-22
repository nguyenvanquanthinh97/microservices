import "bootstrap/dist/css/bootstrap.css";

import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser, envs }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component envs={envs} currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const envs = {
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  };

  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return { pageProps, ...data, envs };
};

export default AppComponent;
