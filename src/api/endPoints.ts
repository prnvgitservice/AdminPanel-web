import {
  getAllFranchises,
  getCompanyReviews,
  getFranchisePlans,
} from "./apiMethods";

const endpoints: any = {
  getAllCategories: {
    method: "get",
    url: () => {
      return `/api/categories/get`;
    },
  },

  addCategory: {
    method: "post",
    url: () => `/api/categories/create`,
  },

  updateCategory: {
    method: "put",
    url: (categoryId: string) => `/api/categories/${categoryId}`,
  },

  deleteCategory: {
    method: "delete",
    url: (categoryId: string) => `/api/categories/${categoryId}`,
  },

  getAllPincodes: {
    method: "get",
    url: () => `/api/pincodes/allAreas`,
  },

  getPlans: {
    method: "get",
    url: () => {
      return `/api/subscriptions/plans`;
    },
  },

  getAllUsers: {
    method: "get",
    url: () => {
      return `/api/userAuth/getAllUsers?offset=1&limit=8`;
    },
  },

  getAllTechnicians: {
    method: "get",
    url: () => {
      return `/api/techAuth/getAllTechnicians?offset=1&limit=2`;
    },
  },

  getAllFranchises: {
    method: "get",
    url: () => {
      return `/api/franchiseAuth/getAllFranchises?offset=1&limit=2`;
    },
  },

  getCompanyReviews: {
    method: "get",
    url: () => {
      return `/api/companyReview/getCompanyReviews`;
    },
  },

  createCompanyReview: {
    method: "get",
    url: () => {
      return `/api/companyReview/getReview`;
    },
  },

  // getFranchisePlans: {
  //   method: "get",
  //   url: () => {
  //     return `/api/franchiseSubscription/franchisePlans`;
  //   }
  // }

  getFranchisePlans: {
    method: "get",
    url: () => {
      return `/api/franchiseSubscription/franchisePlans`;
    },
  },
  createSeoContent: {
    method: "post",
    url: () => {
      return `/api/searchContentData/addCagegorySearchDetails`;
    },
  },
  createTechnicianByAdmin: {
    method: "post",
    url: () => {
      return `/api/techAuth/registerByAdmin`;
    },
  },

  createUserByAdmin: {
    method: "post",
    url: () => {
      return `/api/userAuth/registerUserByAdmin`;
    },
  },

  getAllGuestBookings: {
    method: "get",
    url: () => {
      return `/api/guestBooking/getAllGuestBooking`;
    },
  },

  getAllFranchiseRequests: {
    method: "get",
    url: () => {
      return `/api/franchaseEnquiry/getAllFranchaseEnquiries`;
    },
  },

  createServiceControlByAdmin: {
    method: "post",
    url: () => {
      return `/api/cateServices/createServiceControl`;
    },
  },

  getServicesByCateId: {
    method: "get",
    url: (categoryId: string) => {
      return `/api/cateServices/getServicesByCateId/${categoryId}`
    }
  },

  deleteServiceByAdmin: {
    method: "delete",
    url: (serviceId: string) => {
      return `/api/cateServices/deleteServiceById/${serviceId}`;
    }
  },

  getAllSearchContents: {
    method: "get",
    url: ({offset, limit, searchTerm}: {offset: number, limit: number, searchTerm: string}) => {
      return `/api/searchContentData/getAllSearchContents?offset=${offset}&limit=${limit}&search=${searchTerm}`
    }
  },

  deleteCategorySearchDetails: {
    method: 'delete',
    url: (id: string) => `/api/searchContentData/deleteCategorySearchDetails/${id}`
  },

  updateCagegorySearchDetails: {
    method: 'put',
    url: () => `/api/searchContentData/updateCagegorySearchDetails`
  }
};
export default endpoints;
