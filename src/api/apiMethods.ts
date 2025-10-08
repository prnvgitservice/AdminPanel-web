import apiRequest from "./apiRequest";

export const getAllCategories = (data: any) => apiRequest("getAllCategories", data);

export const addCategory = (data: any) => apiRequest("addCategory", data);

export const updateCategory = (data: any) => apiRequest("updateCategory", data);

export const deleteCategory = (categoryId: string) => apiRequest("deleteCategory", null, categoryId);

export const getAllPincodes = () => apiRequest("getAllPincodes");

export const updatePincode = (pincodeId: string, data: any) => apiRequest("updatePincode", data, pincodeId);

export const deletePincode = (pincodeData: any) => apiRequest("deletePincode", null, pincodeData);

export const getPlans = (data: any) => apiRequest("getPlans", data);

export const addPlans = (data: any) => apiRequest("addPlans", data);

export const updatePlans = (data: any) => apiRequest("updatePlans", data);

export const deletePlan = (planId: string) => apiRequest("deletePlan", null, planId);

export const getAllUsers = (data: { offset?: number; limit?: number }) => apiRequest("getAllUsers", null, data);

export const deleteUserByAdmin = (userId: string) => apiRequest("deleteUserByAdmin", null, userId);

export const getAllTechnicians = (data: any) => apiRequest("getAllTechnicians", null, data);

export const deleteTechnicianByAdmin = (techId: string) => apiRequest("deleteTechnicianByAdmin", null, techId);

export const registerTechByAdmin = (data: any) => apiRequest("registerTechByAdmin", data);

export const getAllFranchises = (data: any) => apiRequest("getAllFranchises", data);

export const registerFranchiseByAdmin = (data: any) => apiRequest("registerFranchiseByAdmin", data);

export const getCompanyReviews = (data: any) => apiRequest("getCompanyReviews", data);

export const createCompanyReview = (data: any) => apiRequest("createCompanyReview", data);

export const getFranchisePlans = (data: any) => apiRequest("getFranchisePlans", data);

export const createSeoContent = (data: any) => apiRequest("createSeoContent", data);

export const createTechnicianByAdmin = (data: any) => apiRequest("createTechnicianByAdmin", data);

export const createUserByAdmin = (data: any) => apiRequest("createUserByAdmin", data);

export const getAllGuestBookings = (data: any) => apiRequest("getAllGuestBookings", data);

export const getAllFranchiseRequests = (data: any) => apiRequest("getAllFranchiseRequests", data);

export const createServiceControlByAdmin = (data: any) => apiRequest("createServiceControlByAdmin", data);

export const getServicesByCateId = (categoryId: string) => apiRequest("getServicesByCateId", null, categoryId);

export const updateServiceControlByCateId = (data: any) => apiRequest("updateServiceControlByCateId", data);

export const deleteServiceByAdmin = (serviceId: string) => apiRequest("deleteServiceByAdmin", null, serviceId);

export const updateCagegorySearchDetails = (data: any) => apiRequest("updateCagegorySearchDetails", data);

export const getSeosByCateId = (
  categoryId: string,
  offset: number,
  limit: number
) => apiRequest("getSeosByCateId", null, categoryId, { offset, limit });


export const getAllSearchContents = (data: any) => apiRequest("getAllSearchContents", null, data);

export const deleteCategorySearchDetails = (id: string) => apiRequest("deleteCategorySearchDetails", null, id);

export const getInTouch = (data: {offset: number, limit: number}) => apiRequest("getInTouch", null, data);

export const getAllBlogs = (data: any) => apiRequest("getAllBlogs", data);

export const createBlog = (data: any) => apiRequest("createBlog", data);

export const updateBlog = (data: any) => apiRequest("updateBlog", data);

export const deleteBlog = (blogId: string, data: any) => apiRequest("deleteBlog", data, blogId);

export const registerExecutiveByAdmin = (data: any) => apiRequest("registerExecutiveByAdmin", data);
export const getAllExecutives = (data: {offset: number, limit: number}) => apiRequest("getAllExecutives", null, data);


export const deleteExecutiveProfile = (id: string) => apiRequest("deleteExecutiveProfile", null, id);



// // API Methods file (unchanged, as no errors found here)
// // File: apiMethods.ts (or similar)

// import apiRequest from "./apiRequest";

// export const getAllCategories = (data: any) => apiRequest("getAllCategories", data);

// export const addCategory = (data: any) => apiRequest("addCategory", data);

// export const updateCategory = (data: any) => apiRequest("updateCategory", data);

// export const deleteCategory = (categoryId : string) => apiRequest("deleteCategory",null, categoryId);

// export const getAllPincodes = () => apiRequest("getAllPincodes");

// export const updatePincode = (pincodeId: string, data: any) => apiRequest("updatePincode", data, pincodeId);

// export const getPlans = (data: any) => apiRequest("getPlans", data);

// export const getAllUsers = (data: any) => apiRequest("getAllUsers", data);

// export const getAllTechnicians = (data: any) => apiRequest("getAllTechnicians", data);

// export const registerTechByAdmin = (data: any) => apiRequest("registerTechByAdmin", data);

// export const getAllFranchises = (data: any) => apiRequest("getAllFranchises", data);

// export const registerFranchiseByAdmin = (data: any) => apiRequest("registerFranchiseByAdmin", data);

// export const getCompanyReviews = (data: any) => apiRequest("getCompanyReviews", data);

// export const createCompanyReview = (data: any) => apiRequest("createCompanyReview", data);

// export const getFranchisePlans = (data: any) => apiRequest("getFranchisePlans", data);

// export const createSeoContent = (data: any) => apiRequest("createSeoContent", data);

// export const createTechnicianByAdmin = (data: any) => apiRequest("createTechnicianByAdmin", data);

// export const createUserByAdmin = (data: any) => apiRequest("createUserByAdmin", data);

// export const getAllGuestBookings = (data: any) => apiRequest("getAllGuestBookings", data);

// export const getAllFranchiseRequests = (data: any) => apiRequest("getAllFranchiseRequests", data)

// export const createServiceControlByAdmin = (data: any) => apiRequest("createServiceControlByAdmin", data);

// export const getServicesByCateId = (categoryId: string) => apiRequest("getServicesByCateId", null, categoryId);

// export const updateServiceControlByCateId = (data: any) => apiRequest("updateServiceControlByCateId", data);

// export const deleteServiceByAdmin = (serviceId: string) => apiRequest("deleteServiceByAdmin", null, serviceId);

// export const updateCagegorySearchDetails = (data: any) => apiRequest("updateCagegorySearchDetails", data);

// export const getAllSearchContents = (data: any) => apiRequest("getAllSearchContents", null, data);

// export const deleteCategorySearchDetails = (id: string) => apiRequest("deleteCategorySearchDetails", null, id);

// export const getInTouch = (data: {offset: number, limit: number}) => apiRequest("getInTouch", null, data);

// export const getAllBlogs = (data: any) => apiRequest("getAllBlogs", data);

// export const createBlog = (data: any) => apiRequest("createBlog", data);

// export const updateBlog = (data: any) => apiRequest("updateBlog", data);

// export const deleteBlog = (blogId: string, data: any) => apiRequest("deleteBlog", data, blogId);
