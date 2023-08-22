import { useEffect } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";
const SignOut = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/auth/signin"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <h1>Signing out ...</h1>;
};

export default SignOut;
