import { BASE_URL } from ".";

const API_ROUTES = {
  login: `${BASE_URL}/auth/login`,
  register: `${BASE_URL}/auth/register`,
  addProduct: `${BASE_URL}/product/add`,
  updateProduct: `${BASE_URL}/product/update`,
  deleteProduct: `${BASE_URL}/product/delete`,
  getProductById: `${BASE_URL}/product/byId`,
  getProductByOrgId: `${BASE_URL}/product/byOrgId`,
  createTransaction: `${BASE_URL}/transaction/create`,
  getTransaction: `${BASE_URL}/transaction/get`,
  approveTransaction: `${BASE_URL}/transaction/approve`,
  denyTransaction: `${BASE_URL}/transaction/deny`
};

export default API_ROUTES;
