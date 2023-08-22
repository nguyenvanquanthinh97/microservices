import { useState, useEffect } from "react";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";

import useRequest from "../../hooks/use-request";

const ShowOrder = ({ order, currentUser, envs }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msTimeLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msTimeLeft / 1000));
    };

    findTimeLeft();
    const intervalId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [order]);

  if (timeLeft < 0) return <div>Order is expired</div>;

  return (
    <div>
      Time left to pay: {timeLeft} seconds
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
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        stripeKey={envs.STRIPE_PUBLIC_KEY}
        amount={order.price * 100}
        currency="USD"
        email={currentUser.email}
      />
    </div>
  );
};

ShowOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data: order } = await client.get(`/api/orders/${orderId}`);
  return { order };
};

export default ShowOrder;
