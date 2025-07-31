const endpoints: any = {

    getAllCategories: {
    method: "get",
    url: () => {
      return `/api/categories/get`;
    },
  },

  addCategory: {
    method: "post",
    url: () => `/api/categories/create`
  },

   updateCategory: { 
    method: "put",
    url: (categoryId : string) => `/api/categories/${categoryId}`
  },

   deleteCategory: {
    method: "delete",
    url: (categoryId : string) => `/api/categories/${categoryId}`
  },

  getAllPincodes: {
    method: "get",
    url: () => `/api/pincodes/allAreas`
  },

  getPlans: {
    method: "get",
    url: () => {
      return `/api/subscriptions/plans`;
    }
  },
 
  getAllUsers: {
    method: "get",
    url: () => {
      return `/api/userAuth/getAllUsers?offset=1&limit=8`;
    }
  },

  getAllTechnicians: {
    method: "get",
    url: () => {
      return `/api/techAuth/getAllTechnicians?offset=1&limit=2`;
    }
  },

  getAllFranchises: {
    method: "get",
    url: () => {
      return `/api/franchiseAuth/getAllFranchises?offset=1&limit=2';
`;
    }
  }

//   getAllUsers: (offset = 0, limit = 8) => ({
//   method: "get",
//   url: () => `/api/userAuth/getAllUsers?offset=${offset}&limit=${limit}`,
// })
 
}
export default endpoints;