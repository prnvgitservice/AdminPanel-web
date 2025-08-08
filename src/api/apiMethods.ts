import apiRequest from "./apiRequest";

export const getAllCategories = (data: any) => apiRequest("getAllCategories", data);

export const addCategory = (data: any) => apiRequest("addCategory", data);

export const updateCategory = (data: any) => apiRequest("updateCategory", data);

export const deleteCategory = (categoryId : string) => apiRequest("deleteCategory",null, categoryId);

export const getAllPincodes = () => apiRequest("getAllPincodes");

export const getPlans = (data: any) => apiRequest("getPlans", data);

export const getAllUsers = (data: any) => apiRequest("getAllUsers", data);

export const getAllTechnicians = (data: any) => apiRequest("getAllTechnicians", data);

export const getAllFranchises = (data: any) => apiRequest("getAllFranchises", data);

export const getCompanyReviews = (data: any) => apiRequest("getCompanyReviews", data);

export const createCompanyReview = (data: any) => apiRequest("createCompanyReview", data);

export const getFranchisePlans = (data: any) => apiRequest("getFranchisePlans", data);

export const createSeoContent = (data: any) => apiRequest("createSeoContent", data);

export const createTechnicianByAdmin = (data: any) => apiRequest("createTechnicianByAdmin", data);

export const createUserByAdmin = (data: any) => apiRequest("createUserByAdmin", data);

export const getAllGuestBookings = (data: any) => apiRequest("getAllGuestBookings", data);