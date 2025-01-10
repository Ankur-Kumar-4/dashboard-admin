const prod =
  "https://2v4hkr6hho5fsiqqq75ct2rzim0fcprd.lambda-url.us-east-1.on.aws";

const ApiEndPoints = {
  login: `${prod}/token`,
  getorders: `${prod}/orders`,
  signup: `${prod}/register`,
  createorder: `${prod}/orders`,
  getusers: `${prod}/users`,
  resetpassword: `${prod}/users`,
  updateuser: `${prod}/users`,
  deleteUser: `${prod}/users`,
  userstatus: `${prod}/users`,
  deleteOrder: `${prod}/orders`,
  updateOrder: `${prod}/orders`,
  updateOrderStatus: `${prod}/order_received_update`,
  logout: `${prod}/logout`,
  getproducts: `${prod}/products`,
  addproduct: `${prod}/products`,
  updateproduct: `${prod}/products`,
  deleteproduct: `${prod}/products`,
  getpermission: `${prod}/users/me`,

};

export default ApiEndPoints;
