import { useCallback, useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, data, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const handleEmailInput = useCallback((e) => setEmail(e.target.value), []);
  const handlePasswordInput = useCallback(
    (e) => setPassword(e.target.value),
    []
  );

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();

    await doRequest();
  });

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={handleEmailInput}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={handlePasswordInput}
          type="password"
          className="form-control"
        />
      </div>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <h4>Opps...</h4>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
};

export default SignIn;
