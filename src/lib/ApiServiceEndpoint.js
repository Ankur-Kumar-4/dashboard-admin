const prod =
  "https://2v4hkr6hho5fsiqqq75ct2rzim0fcprd.lambda-url.us-east-1.on.aws";

  const ApiEndPoints = {
    login: `${prod}/token`,
    getorders: `${prod}/orders`,
    signup: `${prod}/register`,
    createorder: `${prod}/orders`,
  }

  export default ApiEndPoints