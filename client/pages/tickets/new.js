import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);

  const { errors, doRequest } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => Router.push("/"),
  });

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      setPrice(0);
    }

    setPrice(value.toFixed(2));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
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
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
