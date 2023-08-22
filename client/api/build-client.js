import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server
    // requests should be made to http://SERVICENAME.NAMESPACE.svc.cluster.local
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/",
      headers: req.headers,
    });
  }
  // We are on the browser
  // Request can be made with a base url of ''
  return axios.create({
    baseURL: "/",
  });
};

export default buildClient;
