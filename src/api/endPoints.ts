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

}
export default endpoints;