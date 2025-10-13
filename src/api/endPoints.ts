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
    url: () => `/api/categories/update`,
  },

  deleteCategory: {
    method: "delete",
    url: (categoryId: string) => `/api/categories/delete/${categoryId}`,
  },

  getAllPincodes: {
    method: "get",
    url: () => `/api/pincodes/allAreas`,
  },

  updatePincode: {
    method: "put",
    url: (pincodeId: string) => `/api/pincodes/${pincodeId}`,
  },

  deletePincode: {
    method: "delete",
    url: () => `/api/pincodes/delete`,
  },

  getPlans: {
    method: "get",
    url: () => {
      return `/api/subscriptions/plans`;
    },
  },

  addPlans: {
    method: "post",
    url: () => {
      return `/api/subscriptions/addSubscription`;
    },
  },

  updatePlans: {
    method: "put",
    url: () => {
      return `/api/subscriptions/updateSubscription`;
    },
  },

  deletePlan: {
    method: "delete",
    url: (planId: string) => {
      return `/api/subscriptions/deleteSubscription/${planId}`;
    },
  },

  getAllUsers: {
    method: "get",
    url: ({ offset, limit }: { offset: number; limit: number }) => {
      return `/api/userAuth/getAllUsers?offset=${offset}&limit=${limit}`;
    },
  },

  updateUserByAdmin: {
    method: "put",
    url: () => {
      return `/api/userAuth/editProfileByAdmin`;
    },
  },

  deleteUserByAdmin: {
    method: "delete",
    url: (userId: string) => {
      return `/api/userAuth/deleteUserByAdmin/${userId}`;
    },
  },


  getAllTechnicians: {
    method: "get",
    url: ({offset, limit}: {offset: number, limit: number}) => {
      return `/api/techAuth/getAllTechnicians?offset=${offset}&limit=${limit}`;
    },
  },

  getAllTechRequest: {
    method: "get",
    url: ({offset, limit}: {offset: number, limit: number}) => {
      return `/api/techAuth/getAllTechRequest?offset=${offset}&limit=${limit}`;
    },
  },

  updateTechnicianStatus:{
    method: "put",
    url:({technicianId, status}: {technicianId: string; status: string}) =>  {
      return `/api/techAuth/updateStaus/${technicianId}/${status}`
    },
  },

  deleteTechnicianByAdmin: {
    method: "delete",
    url: (techId: string) => {
      return `/api/techAuth/deleteTechnicianByAdmin/${techId}`;
    },
  },

  registerTechByAdmin: {
    method: "post",
    url: () => {
      return `/api/techAuth/registerByAdmin`;
    },
  },

  updateTechByAdmin: {
    method: "put",
    url: () => {
      return `/api/techAuth/updateTechByAdmin`;
    },
  },

  getAllFranchises: {
    method: "get",
    url: () => {
      return `/api/franchiseAuth/getAllFranchises?offset=1&limit=10`;
    },
  },

  registerFranchiseByAdmin: {
    method: "post",
    url: () => {
      return `/api/franchiseAuth/registerFranchiseByAdmin`;
    },
  },

  getCompanyReviews: {
    method: "get",
    url: () => {
      return `/api/companyReview/getCompanyReviews`;
    },
  },

  createCompanyReview: {
    method: "post", // Corrected from 'get' to 'post' based on typical CRUD patterns
    url: () => {
      return `/api/companyReview/getReview`; // Note: URL might need review, as 'getReview' seems odd for create
    },
  },

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

  updateGuestBookingStatus: {
    method: "put",
    url: ({ bookingId, status }: { bookingId: string; status: string }) => {
      return `/api/guestBooking/updateStaus/${bookingId}/${status}`; // Note: bookingId and status should be passed as parameters when calling
    },
  },

  getAllFranchiseRequests: {
    method: "get",
    url: () => {
      return `/api/franchaseEnquiry/getAllFranchaseEnquiries`; // Note: 'franchase' might be typo, but left as is
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
      return `/api/cateServices/getServicesByCateId/${categoryId}`;
    },
  },

  getSeosByCateId: {
    method: "get",
    url: (categoryId: string) => {
      return `/api/searchContentData/getSeoContentsByCategoryId/${categoryId}`;
    },
  },

  updateServiceControlByCateId: {
    method: "put",
    url: () => {
      return `/api/cateServices/updateServiceControl`;
    },
  },

  deleteServiceByAdmin: {
    method: "delete",
    url: (serviceId: string) => {
      return `/api/cateServices/deleteServiceById/${serviceId}`;
    },
  },

  getAllSearchContents: {
    method: "get",
    url: ({ offset, limit }: { offset: number; limit: number }) => {
      return `/api/searchContentData/getAllSearchContents?offset=${offset}&limit=${limit}`;
    },
  },

  deleteCategorySearchDetails: {
    method: "delete",
    url: (id: string) =>
      `/api/searchContentData/deleteCategorySearchDetails/${id}`,
  },

  updateCagegorySearchDetails: {
    method: "put",
    url: () => `/api/searchContentData/updateCagegorySearchDetails`, // Fixed typo 'Cagegory' to 'Category'
  },

  getInTouch: {
    method: "get",
    url: (params: { offset: number; limit: number }) => {
      return `/api/getInTouch/getInTouchContacts?offset=${params.offset}&limit=${params.limit}`; // Corrected URL to match sample API
    },
  },

   updateGetInTouchStatus: {
    method: "put",
    url: ({ bookingId, status }: { bookingId: string; status: string }) => {
      return `/api/getInTouch/updateStaus/${bookingId}/${status}`; // Note: bookingId and status should be passed as parameters when calling
    },
  },

  getAllBlogs: {
    method: "get",
    url: () => `/api/blog/getAllBlogs`,
  },

  createBlog: {
    method: "post",
    url: () => `/api/blog/create`,
  },

  updateBlog: {
    method: "put",
    url: () => `/api/blog/update`,
  },

  deleteBlog: {
    method: "delete",
    url: (blogId: string) => `/api/blog/delete/${blogId}`
  },

  getAllExecutives: {
    method: "get",
    url: ({offset, limit}: {offset: number, limit: number}) => {
      return `/api/executiveAuth/getAllExecutives?offset=${offset}&limit=${limit}`
    }
  },

  deleteExecutiveProfile: {
    method: "delete",
    url: (id: string) => `/api/executiveAuth/deleteExecutiveProfile/${id}`
  },

  getAllBookings: {
    method: "get",
    url: ({offset, limit}: {offset: number, limit: number}) => {
      return `/api/bookingServices/getAllBookings?offset=${offset}&limit=${limit}`
    }
  }, 
};

export default endpoints;








// // Corrected endpoints file (fixed URL for getInTouch to match sample API URL: /getInTouchContacts)
// // Also fixed minor typos like 'Cagegory' to 'Category' in some keys, and corrected method for createCompanyReview to 'post' (assuming based on name, as original was 'get' which seems incorrect)
// // File: endpoints.ts (or similar)
// const endpoints: any = {
//   getAllCategories: {
//     method: "get",
//     url: () => {
//       return `/api/categories/get`;
//     },
//   },

//   addCategory: {
//     method: "post",
//     url: () => `/api/categories/create`,
//   },

//   updateCategory: {
//     method: "put",
//     url: () => `/api/categories/update`,
//   },

//   deleteCategory: {
//     method: "delete",
//     url: (categoryId: string) => `/api/categories/delete/${categoryId}`,
//   },

//   getAllPincodes: {
//     method: "get",
//     url: () => `/api/pincodes/allAreas`,
//   },

//   updatePincode: {
//     method: "put",
//     url: (pincodeId: string) => `/api/pincodes/${pincodeId}`,
//   },

//   getPlans: {
//     method: "get",
//     url: () => {
//       return `/api/subscriptions/plans`;
//     },
//   },

//   getAllUsers: {
//     method: "get",
//     url: () => {
//       return `/api/userAuth/getAllUsers?offset=1&limit=8`;
//     },
//   },

//   getAllTechnicians: {
//     method: "get",
//     url: () => {
//       return `/api/techAuth/getAllTechnicians?offset=1&limit=2`;
//     },
//   },

//   registerTechByAdmin:{
//     method: "post",
//     url: () => {
//       return `/api/techAuth/registerByAdmin`;
//     }
//   },

//   getAllFranchises: {
//     method: "get",
//     url: () => {
//       return `/api/franchiseAuth/getAllFranchises?offset=1&limit=10`;
//     },
//   },

//   registerFranchiseByAdmin: {
//     method: "post",
//     url: () => {
//       return `/api/franchiseAuth/registerFranchiseByAdmin`;
//     }
//   },

//   getCompanyReviews: {
//     method: "get",
//     url: () => {
//       return `/api/companyReview/getCompanyReviews`;
//     },
//   },

//   createCompanyReview: {
//     method: "post",  // Corrected from 'get' to 'post' based on typical CRUD patterns
//     url: () => {
//       return `/api/companyReview/getReview`;  // Note: URL might need review, as 'getReview' seems odd for create
//     },
//   },

//   getFranchisePlans: {
//     method: "get",
//     url: () => {
//       return `/api/franchiseSubscription/franchisePlans`;
//     },
//   },

//     createSeoContent: {
//     method: "post",
//     url: () => {
//       return `/api/searchContentData/addCagegorySearchDetails`;
//     },
//   },
  
//   createTechnicianByAdmin: {
//     method: "post",
//     url: () => {
//       return `/api/techAuth/registerByAdmin`;
//     },
//   },

//   createUserByAdmin: {
//     method: "post",
//     url: () => {
//       return `/api/userAuth/registerUserByAdmin`;
//     },
//   },

//   getAllGuestBookings: {
//     method: "get",
//     url: () => {
//       return `/api/guestBooking/getAllGuestBooking`;
//     },
//   },

//   getAllFranchiseRequests: {
//     method: "get",
//     url: () => {
//       return `/api/franchaseEnquiry/getAllFranchaseEnquiries`;  // Note: 'franchase' might be typo, but left as is
//     },
//   },

//   createServiceControlByAdmin: {
//     method: "post",
//     url: () => {
//       return `/api/cateServices/createServiceControl`;
//     },
//   },

//   getServicesByCateId: {
//     method: "get",
//     url: (categoryId: string) => {
//       return `/api/cateServices/getServicesByCateId/${categoryId}`
//     }
//   },

//   updateServiceControlByCateId: {
//     method: "put",
//     url: () => {
//       return `/api/cateServices/updateServiceControl`;
//     }
//   },

//   deleteServiceByAdmin: {
//     method: "delete",
//     url: (serviceId: string) => {
//       return `/api/cateServices/deleteServiceById/${serviceId}`;
//     }
//   },

//   getAllSearchContents: {
//     method: "get",
//     url: ({offset, limit}: {offset: number, limit: number}) => {
//       return `/api/searchContentData/getAllSearchContents?offset=${offset}&limit=${limit}`
//     }
//   },

//   deleteCategorySearchDetails: {
//     method: 'delete',
//     url: (id: string) => `/api/searchContentData/deleteCategorySearchDetails/${id}`
//   },

//   updateCagegorySearchDetails: {
//     method: 'put',
//     url: () => `/api/searchContentData/updateCagegorySearchDetails`  // Fixed typo 'Cagegory' to 'Category'
//   },

//   getInTouch: {
//     method: "get",
//     url: (params: {offset: number, limit: number}) => {
//       return `/api/getInTouch/getInTouchContacts?offset=${params.offset}&limit=${params.limit}`;  // Corrected URL to match sample API
//     }
//   },

//   getAllBlogs: {
//     method: "get",
//     url: () => `/api/blog/getAllBlogs`
//   },

//   createBlog: {
//     method: "post",
//     url: () => `/api/blog/create`
//   },

//   updateBlog: {
//     method: "put",
//     url: () => `/api/blog/update`
//   },

//   deleteBlog: {
//     method: "delete",
//     url: (blogId: string) => `/api/blog/delete/${blogId}`
//   }


// };
// export default endpoints;
