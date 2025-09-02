import { Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "../pages/Layout";
import Dashboard from "../pages/Dashboard";
import AllCategories from "../components/category/AllCategories";
import AddCategory from "../components/category/AddCategory";
import ViewCategory from "../components/category/ViewCategory";
import AllMetaInfo from "../components/metaInfo/AllMetaInfo";
import ViewMetaInfo from "../components/metaInfo/ViewMetaInfo";
import SubscriptionPage from "../components/Subscriptions/SubscriptionPage";
import PlanDetailsPage from "../components/Subscriptions/PlanDetailsPage";
import AllFranchisePlansPage from "../components/FranchisePlansPage/AllFranchisePlansPage";
import Users from "../components/manageUsers/Users";
import AddUser from "../components/manageUsers/AddUser";
import AdminUsers from "../components/manageUsers/AdminUsers";
import AddAdminUser from "../pages/AddAdminUser";
import Technicians from "../components/manageTechnicians/Technicians";
import AddTechnician from "../components/manageTechnicians/AddTechnician";
import AdminCreatedTechnicians from "../components/manageTechnicians/AdminCreatedTechnicians";
import Franchise from "../components/manageFranchise/Franchises";
import AddFranchise from "../components/manageFranchise/AddFranchise";
import AdminCreatedFranchises from "../components/manageFranchise/AdminCreatedFranchises";
import CompanyReviews from "../components/reviews/CompanyReviews";
import AllGuestBookings from "../components/bookings/GuestBooking";
import FranchiseRequest from "../components/enquiries/FranchiseRequest";
import AllServices from "../components/services/AllServices";
import AddService from "../components/services/AddServices";
import ViewService from "../components/services/ViewService";
import EditService from "../components/services/EditService";
import AllAreas from "../components/areas/AllAreas";
import AddArea from "../components/areas/AddArea";
import ViewArea from "../components/areas/ViewArea";
import EditMetaInfo from "../components/metaInfo/EditMetaInfo";
import EditArea from "../components/areas/EditArea";
import Sitemap from "../components/sitemap/Sitemap";
import AddMetaInfo from "../components/metaInfo/AddMetaInfo";

// Import the new components for blogs and get in touch
import GetInTouch from "../components/enquiries/GetInTouch";
import AllBlogs from "../components/blogs/AllBlogs";
import BlogForm from "../components/blogs/BlogForm";
import ViewBlog from "../components/blogs/ViewBlog";
import AddExecutive from "../components/manageExecutives/AddExecutive";
import AllExecutives from "../components/manageExecutives/AllExecutives";
import AllReferrals from "../components/manageReferrals/AllReferrals";
import AddReferral from "../components/manageReferrals/AddReferral";



// Placeholder component for routes not yet implemented
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p>{title} page coming soon...</p>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* All routes are wrapped in the Layout component, which includes the sidebar */}
      <Route element={<Layout />}>
        {/* Dashboard: Main landing page */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Categories: Routes for managing service categories */}
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/categories/all" element={<AllCategories />} />
        <Route path="/categories/add" element={<AddCategory />} />
        <Route path="/categories/edit/:id" element={<AddCategory isEdit={true} />} />
        <Route path="/category/:id" element={<ViewCategory />} />

        {/* Services: Routes for managing services */}
        <Route path="/services" element={<AllServices />} />
        <Route path="/services/all" element={<AllServices />} />
        <Route path="/services/add" element={<AddService />} />
        <Route path="/services/view/:id" element={<ViewService />} />
        <Route path="/services/edit/:id" element={<EditService />} />

        {/* Meta Info: Routes for managing metadata (e.g., SEO or content details) */}
        <Route path="/meta-info" element={<AllMetaInfo />} />
        <Route path="/meta-info/all" element={<AllMetaInfo />} />
        <Route path="/meta-info/add" element={<AddMetaInfo />} />
        <Route path="/meta-info/view/:id" element={<ViewMetaInfo />} />
        <Route path="/meta-info/edit/:id" element={<EditMetaInfo />} />

        {/* Blogs: Routes for managing blog content */}
        <Route path="/blogs" element={<AllBlogs />} />
        <Route path="/blogs/all" element={<AllBlogs />} />
        <Route path="/blogs/add" element={<BlogForm />} />
        <Route path="/blogs/edit/:id" element={<BlogForm isEdit={true} />} />
        <Route path="/blogs/view/:id" element={<ViewBlog />} />

        {/* Subscriptions: Routes for managing subscription plans */}
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/subscription/all" element={<SubscriptionPage />} />
        <Route path="/subscription/:id" element={<PlanDetailsPage />} />
        <Route
          path="/subscription/add"
          element={<PlaceholderPage title="Add Subscription" />}
        />

        {/* Franchise Plans: Routes for managing franchise plans */}
        <Route path="/franchise-plans" element={<AllFranchisePlansPage />} />
        <Route
          path="/franchise-plans/all"
          element={<AllFranchisePlansPage />}
        />
        <Route
          path="/franchise-plans/add"
          element={<PlaceholderPage title="Add Franchise Plan" />}
        />

        {/* Management - Users: Routes for user management */}
        <Route path="/management" element={<Users />} />
        <Route path="/management/users" element={<Users />} />
        <Route path="/management/users/all" element={<Users />} />
        <Route path="/management/users/add" element={<AddUser />} />
        <Route
          path="/management/users/admin-created"
          element={<AdminUsers />}
        />
        <Route path="/management/users/add-admin" element={<AddAdminUser />} />

        {/* Management - Technicians: Routes for technician management */}
        <Route path="/management/technicians" element={<Technicians />} />
        <Route path="/management/technicians/all" element={<Technicians />} />
        <Route path="/management/technicians/add" element={<AddTechnician />} />
        <Route
          path="/management/technicians/admin-created"
          element={<AdminCreatedTechnicians />}
        />

        {/* Management - Franchises: Routes for franchise management */}
        <Route path="/management/franchises" element={<Franchise />} />
        <Route path="/management/franchises/all" element={<Franchise />} />
        <Route path="/management/franchises/add" element={<AddFranchise />} />
        <Route
          path="/management/franchises/admin-created"
          element={<AdminCreatedFranchises />}
        />

        {/* Management - Executives: Routes for executive management */}
        <Route path="/management/executives" element={<AllExecutives />} />
        <Route path="/management/executives/all" element={<AllExecutives />} />
        <Route path="/management/executives/add" element={<AddExecutive />} />

        {/* Management - Referrals: Routes for referral management */}
        <Route path="/management/referrals" element={<AllReferrals />} />
        <Route path="/management/referrals/all" element={<AllReferrals />} />
        <Route path="/management/referrals/add" element={<AddReferral />} />

        {/* Areas: Routes for managing service areas */}
        <Route path="/areas" element={<AllAreas />} />
        <Route path="/areas/all" element={<AllAreas />} />
        <Route path="/areas/add" element={<AddArea />} />
        <Route path="/areas/view/:id" element={<ViewArea />} />
        <Route path="/areas/edit/:id" element={<EditArea />} />

        {/* Bookings: Routes for managing bookings */}
        <Route
          path="/bookings"
          element={<PlaceholderPage title="Bookings" />}
        />
        <Route
          path="/bookings/all"
          element={<PlaceholderPage title="All Bookings" />}
        />
        <Route path="/bookings/guest" element={<AllGuestBookings />} />

        {/* Enquiries: Routes for managing enquiries */}
        <Route path="/franchise-requests" element={<FranchiseRequest />} />
        <Route path="/get-in-touch" element={<GetInTouch />} />

        {/* Notifications: Routes for notification-related actions */}
        <Route
          path="/notifications"
          element={<PlaceholderPage title="Notifications" />}
        />

        {/* Reviews: Routes for managing reviews */}
        <Route path="/reviews" element={<CompanyReviews />} />
        <Route path="/reviews/all" element={<CompanyReviews />} />

        {/* Advertisements: Routes for managing advertisements */}
        <Route
          path="/advertisements"
          element={<PlaceholderPage title="Advertisements" />}
        />
        <Route
          path="/advertisements/all"
          element={<PlaceholderPage title="All Advertisements" />}
        />
        <Route
          path="/advertisements/add"
          element={<PlaceholderPage title="Add Advertisement" />}
        />

        {/* Sitemap: Routes for managing the sitemap */}
        <Route path="/sitemap" element={<Sitemap />} />

        {/* Legacy Routes: Older service-related routes for backward compatibility */}
        <Route path="/services" element={<AllCategories />} />
        <Route path="/all-services" element={<AllCategories />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;






// import { Routes, Route } from "react-router-dom";
// import React from "react";
// import Layout from "../pages/Layout";
// import Dashboard from "../pages/Dashboard";
// import AllCategories from "../components/category/AllCategories";
// import AddCategory from "../components/category/AddCategory";
// import ViewCategory from "../components/category/ViewCategory";
// import AllMetaInfo from "../components/metaInfo/AllMetaInfo";
// import ViewMetaInfo from "../components/metaInfo/ViewMetaInfo";
// import SubscriptionPage from "../components/Subscriptions/SubscriptionPage";
// import PlanDetailsPage from "../components/Subscriptions/PlanDetailsPage";
// import AllFranchisePlansPage from "../components/FranchisePlansPage/AllFranchisePlansPage";
// import Users from "../components/manageUsers/Users";
// import AddUser from "../components/manageUsers/AddUser";
// import AdminUsers from "../components/manageUsers/AdminUsers";
// import AddAdminUser from "../pages/AddAdminUser";
// import Technicians from "../components/manageTechnicians/Technicians";
// import AddTechnician from "../components/manageTechnicians/AddTechnician";
// import AdminCreatedTechnicians from "../components/manageTechnicians/AdminCreatedTechnicians";
// import Franchise from "../components/manageFranchise/Franchises";
// import AddFranchise from "../components/manageFranchise/AddFranchise";
// import AdminCreatedFranchises from "../components/manageFranchise/AdminCreatedFranchises";
// import CompanyReviews from "../components/reviews/CompanyReviews";
// import AllGuestBookings from "../components/bookings/GuestBooking";
// import FranchiseRequest from "../components/enquiries/FranchiseRequest";
// import AllServices from "../components/services/AllServices";
// import AddService from "../components/services/AddServices";
// import ViewService from "../components/services/ViewService";
// import EditService from "../components/services/EditService";
// import AllAreas from "../components/areas/AllAreas";
// import AddArea from "../components/areas/AddArea";
// import ViewArea from "../components/areas/ViewArea";
// import EditMetaInfo from "../components/metaInfo/EditMetaInfo";
// import EditArea from "../components/areas/EditArea";
// import EditCategory from "../components/category/EditCategory";
// import Sitemap from "../components/sitemap/Sitemap";
// import AddMetaInfo from "../components/metaInfo/AddMetaInfo";

// // Import the new components for blogs and get in touch
// import GetInTouch from "../components/enquiries/GetInTouch";
// import AllBlogs from "../components/blogs/AllBlogs";
// import AddBlog from "../components/blogs/BlogForm";
// import BlogForm from "../components/blogs/BlogForm";
// import ViewBlog from "../components/blogs/ViewBlog";


// import AddExecutive from "../components/manageExecutives/AddExecutive";
// import AllExecutives from "../components/manageExecutives/AllExecutives";

// import AllReferrals from "../components/manageReferrals/AllReferrals";
// import AddReferral from "../components/manageReferrals/AddReferral";

// // Placeholder component for routes not yet implemented
// const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
//   <div className="p-8">
//     <h1 className="text-2xl font-bold">{title}</h1>
//     <p>{title} page coming soon...</p>
//   </div>
// );

// const AppRoutes: React.FC = () => {
//   return (
//     <Routes>
//       {/* All routes are wrapped in the Layout component, which includes the sidebar */}
//       <Route element={<Layout />}>
//         {/* Dashboard: Main landing page */}
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/dashboard" element={<Dashboard />} />

//         {/* Categories: Routes for managing service categories */}
//         <Route path="/categories" element={<AllCategories />} />
//         <Route path="/categories/all" element={<AllCategories />} />
//         <Route path="/categories/add" element={<AddCategory />} />
//         <Route path="/categories/edit/:id" element={<AddCategory isEdit={true} />} />
//         <Route path="/category/:id" element={<ViewCategory />} />

//         {/* Services: Routes for managing services */}
//         <Route path="/services" element={<AllServices />} />
//         <Route path="/services/all" element={<AllServices />} />
//         <Route path="/services/add" element={<AddService />} />
//         <Route path="/services/view/:id" element={<ViewService />} />
//         <Route path="/services/edit/:id" element={<EditService />} />

//         {/* Meta Info: Routes for managing metadata (e.g., SEO or content details) */}
//         <Route path="/meta-info" element={<AllMetaInfo />} />
//         <Route path="/meta-info/all" element={<AllMetaInfo />} />
//         <Route path="/meta-info/add" element={<AddMetaInfo />} />
//         <Route path="/meta-info/view/:id" element={<ViewMetaInfo />} />
//         <Route path="/meta-info/edit/:id" element={<EditMetaInfo />} />

//         {/* Blogs: Routes for managing blog content */}
//         <Route path="/blogs" element={<AllBlogs />} />
//         <Route path="/blogs/all" element={<AllBlogs />} />
//         <Route path="/blogs/add" element={<BlogForm />} />
//         <Route path="/blogs/edit/:id" element={<BlogForm isEdit={true} />} />
//         <Route path="/blogs/view/:id" element={<ViewBlog />} />

//         {/* Subscriptions: Routes for managing subscription plans */}
//         <Route path="/subscription" element={<SubscriptionPage />} />
//         <Route path="/subscription/all" element={<SubscriptionPage />} />
//         <Route path="/subscription/:id" element={<PlanDetailsPage />} />
//         <Route
//           path="/subscription/add"
//           element={<PlaceholderPage title="Add Subscription" />}
//         />

//         {/* Franchise Plans: Routes for managing franchise plans */}
//         <Route path="/franchise-plans" element={<AllFranchisePlansPage />} />
//         <Route
//           path="/franchise-plans/all"
//           element={<AllFranchisePlansPage />}
//         />
//         <Route
//           path="/franchise-plans/add"
//           element={<PlaceholderPage title="Add Franchise Plan" />}
//         />

//         {/* Management - Users: Routes for user management */}
//         <Route path="/management" element={<Users />} />
//         <Route path="/management/users" element={<Users />} />
//         <Route path="/management/users/all" element={<Users />} />
//         <Route path="/management/users/add" element={<AddUser />} />
//         <Route
//           path="/management/users/admin-created"
//           element={<AdminUsers />}
//         />
//         <Route path="/management/users/add-admin" element={<AddAdminUser />} />

//         {/* Management - Technicians: Routes for technician management */}
//         <Route path="/management/technicians" element={<Technicians />} />
//         <Route path="/management/technicians/all" element={<Technicians />} />
//         <Route path="/management/technicians/add" element={<AddTechnician />} />
//         <Route
//           path="/management/technicians/admin-created"
//           element={<AdminCreatedTechnicians />}
//         />

//         {/* Management - Franchises: Routes for franchise management */}
//         <Route path="/management/franchises" element={<Franchise />} />
//         <Route path="/management/franchises/all" element={<Franchise />} />
//         <Route path="/management/franchises/add" element={<AddFranchise />} />
//         <Route
//           path="/management/franchises/admin-created"
//           element={<AdminCreatedFranchises />}
//         />


//         {/* Management - Executives: Routes for executive management */}
//         <Route path="/management/executives" element={<AllExecutives />} />
//         <Route path="/management/executives/all" element={<AllExecutives />} />
//         <Route path="/management/executives/add" element={<AddExecutive />} />


//         {/* Management - Referrals: Routes for referral management */}
//         <Route path="/management/referrals" element={<AllReferrals />} />
//         <Route path="/management/referrals/all" element={<AllReferrals />} />
//         <Route path="/management/referrals/add" element={<AddReferral />} />

//         {/* Areas: Routes for managing service areas */}
//         <Route path="/areas" element={<AllAreas />} />
//         <Route path="/areas/all" element={<AllAreas />} />
//         <Route path="/areas/add" element={<AddArea />} />
//         <Route path="/areas/view/:id" element={<ViewArea />} />
//         <Route path="/areas/edit/:id" element={<EditArea />} />

//         {/* Bookings: Routes for managing bookings */}
//         <Route
//           path="/bookings"
//           element={<PlaceholderPage title="Bookings" />}
//         />
//         <Route
//           path="/bookings/all"
//           element={<PlaceholderPage title="All Bookings" />}
//         />
//         <Route path="/bookings/guest" element={<AllGuestBookings />} />

//         {/* Enquiries: Routes for managing enquiries */}
//         <Route path="/franchise-requests" element={<FranchiseRequest />} />
//         <Route path="/get-in-touch" element={<GetInTouch />} />

//         {/* Notifications: Routes for notification-related actions */}
//         <Route
//           path="/notifications"
//           element={<PlaceholderPage title="Notifications" />}
//         />

//         {/* Reviews: Routes for managing reviews */}
//         <Route path="/reviews" element={<CompanyReviews />} />
//         <Route path="/reviews/all" element={<CompanyReviews />} />

//         {/* Advertisements: Routes for managing advertisements */}
//         <Route
//           path="/advertisements"
//           element={<PlaceholderPage title="Advertisements" />}
//         />
//         <Route
//           path="/advertisements/all"
//           element={<PlaceholderPage title="All Advertisements" />}
//         />
//         <Route
//           path="/advertisements/add"
//           element={<PlaceholderPage title="Add Advertisement" />}
//         />

//         {/* Sitemap: Routes for managing the sitemap */}
//         <Route path="/sitemap" element={<Sitemap />} />

//         {/* Legacy Routes: Older service-related routes for backward compatibility */}
//         <Route path="/services" element={<AllCategories />} />
//         <Route path="/all-services" element={<AllCategories />} />
//       </Route>
//     </Routes>
//   );
// };

// export default AppRoutes;