import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Layout from "../pages/Layout";
import Dashboard from "../pages/Dashboard";
import AllCategories from "../components/category/AllCategories";
import AddCategory from "../components/category/AddCategory";
import ActiveCategories from "../components/category/ActiveCategories";
import InactiveCategories from "../components/category/InactiveCategories";
import ViewCategory from "../components/category/ViewCategory";
import AddMetaInfo from "../components/metaInfo/AddMetaInfo";
import AllMetaInfo from "../components/metaInfo/AllMetaInfo";
import Users from "../components/manageUsers/Users";
import AdminUsers from "../components/manageUsers/AdminUsers";
import AddAdminUser from "../pages/AddAdminUser";
import AddUser from "../components/manageUsers/AddUser";
import Franchise from "../components/manageFranchise/Franchises";
import AddFranchise from "../components/manageFranchise/AddFranchise";
import AddTechnician from "../components/manageTechnicians/AddTechnician";
import SubscriptionPage from "../components/Subscriptions/SubscriptionPage";
import PlanDetailsPage from "../components/Subscriptions/PlanDetailsPage";
import Technicians from "../components/manageTechnicians/Technicians";
import AdminCreatedFranchises from "../components/manageFranchise/AdminCreatedFranchises";
import AdminCreatedTechnicians from "../components/manageTechnicians/AdminCreatedTechnicians";
import FranchisePage from "../components/FranchisePlansPage/AllFranchisePlansPage";
import AllFranchisePlansPage from "../components/FranchisePlansPage/AllFranchisePlansPage";
import AddFranchisePlanPage from "../components/FranchisePlansPage/AddFranchisePlanPage";
// import CompanyReview from "../pages/CompanyReview";

interface Category {
  id: number;
}

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [editingAdvertisement, setEditingAdvertisement] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleViewCategory = (data: Category) => {
    setSelectedCategory(data);
    navigate("/categories/view");
  };

  const handleEditAdvertisement = (id: number) => {
    setEditingAdvertisement(id);
    navigate("/advertisements/edit");
  };

  const handleEditCategory = (id: number) => {
    setEditingCategory(id);
    navigate("/categories/edit");
  };

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Categories */}
        <Route
          path="/categories"
          element={
            <AllCategories
              onAddCategory={() => navigate("/categories/add")}
              onEdit={handleEditCategory}
            />
          }
        />
        <Route
          path="/categories/all"
          element={
            <AllCategories
              onEdit={handleEditCategory}
            />
          }
        />
        <Route
          path="/categories/add"
          element={<AddCategory/>}
        />
        <Route
          path="/categories/edit"
          element={
            <AddCategory
              onBack={() => navigate("/categories/all")}
              isEdit={true}
              categoryId={editingCategory}
            />
          }
        />
        <Route
          path="/categories/active"
          element={
            <ActiveCategories
              onAddCategory={() => navigate("/categories/add")}
              onEdit={handleEditCategory}
            />
          }
        />
        <Route path="/categories/inactive" element={<InactiveCategories />} />
        <Route path="/category/:id" element={<ViewCategory/>}/>

        {/* Meta Info */}
        <Route path="/meta-info" element={<AllMetaInfo />} />
        <Route path="/meta-info/all" element={<AllMetaInfo />} />
        <Route
          path="/meta-info/add"
          element={<AddMetaInfo onBack={() => navigate("/meta-info/all")} />}
        />

        {/* Subscription */}
        <Route path="/subscription" element={<SubscriptionPage/>}/>
        <Route path="/subscription/all" element={<SubscriptionPage/>}/>
        <Route path="/subscription/:id" element={<PlanDetailsPage />} />
        <Route
          path="/subscription/add"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">Add Subscription</h1>
              <p>Add subscription form coming soon...</p>
            </div>
          }
        />
        <Route
          path="/subscription/deleted"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">Deleted Subscriptions</h1>
              <p>Deleted subscriptions list coming soon...</p>
            </div>
          }
        />

          {/* Franchise Plans Routes */}
            <Route path="/franchise-plans" element={<FranchisePlansPage />} />
      <Route path="/franchise-plans/all" element={<AllFranchisePlansPage />} />
      <Route path="/franchise-plans/add" element={<AddFranchisePlanPage />} />
            
        {/* Management - Users */}
        <Route
          path="/management"
          element={<Users onAddUser={() => navigate("/management/users/add")} />}
        />
        <Route
          path="/management/users"
          element={<Users onAddUser={() => navigate("/management/users/add")} />}
        />
        <Route
          path="/management/users/all"
          element={<Users onAddUser={() => navigate("/management/users/add")} />}
        />
        <Route
          path="/management/users/add"
          element={<AddUser onBack={() => navigate("/management/users/all")} />}
        />
        <Route
          path="/management/users/admin-created"
          element={
            <AdminUsers
              onAddUser={() => navigate("/management/users/add-admin")}
            />
          }
        />
        <Route
          path="/management/users/add-admin"
          element={
            <AddAdminUser
              onBack={() => navigate("/management/users/admin-created")}
            />
          }
        />


                  {/* Management - Technicians */}
        <Route path="/management/technicians/all" element={<Technicians/>}/>
        <Route
          path="/management/technicians/add"
          element={
            <AddTechnician
              onBack={() => navigate("/management/technicians/all")}
            />
          }
        />
        <Route
          path="/management/technicians/admin-created"
          element={<AdminCreatedTechnicians 
            onAddTechnician={() => navigate("/management/technicians")}/>}
        />

        {/* Management - Franchises */}
        <Route
          path="/management/franchises/all"
          element={<Franchise/>}
        />
        <Route
          path="/management/franchises/add"
          element={<AddFranchise />}
        />
        <Route
          path="/management/franchises/admin-created"
          element={<AdminCreatedFranchises />}
        />


        {/* Areas */}
        <Route
          path="/areas"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">All Areas</h1>
              <p>Areas management coming soon...</p>
            </div>
          }
        />
        <Route
          path="/areas/all"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">All Areas</h1>
              <p>Areas management coming soon...</p>
            </div>
          }
        />
        <Route
          path="/areas/add"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">Add Area</h1>
              <p>Add area form coming soon...</p>
            </div>
          }
        />

        {/* Bookings */}
        <Route
          path="/bookings"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">All Bookings</h1>
              <p>Bookings management coming soon...</p>
            </div>
          }
        />
        <Route
          path="/bookings/all"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">All Bookings</h1>
              <p>Bookings management coming soon...</p>
            </div>
          }
        />
        <Route
          path="/bookings/guest"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">Guest Bookings</h1>
              <p>Guest bookings list coming soon...</p>
            </div>
          }
        />

        {/* Advertisements */}
        <Route
          path="/advertisements"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">All Advertisements</h1>
              <p>Advertisements management coming soon...</p>
            </div>
          }
        />
        <Route
          path="/advertisements/all"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">All Advertisements</h1>
              <p>Advertisements management coming soon...</p>
            </div>
          }
        />
        <Route
          path="/advertisements/add"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">Add Advertisement</h1>
              <p>Add advertisement form coming soon...</p>
            </div>
          }
        />
        <Route
          path="/advertisements/edit"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">Edit Advertisement</h1>
              <p>Edit advertisement form coming soon...</p>
            </div>
          }
        />

        {/* Legacy Routes */}
        <Route
          path="/services"
          element={
            <AllCategories
              onAddCategory={() => navigate("/categories/add")}
              onEdit={handleEditCategory}
            />
          }
        />
        <Route
          path="/all-services"
          element={
            <AllCategories
              onAddCategory={() => navigate("/categories/add")}
              onEdit={handleEditCategory}
            />
          }
        />   
        </Route> 

        
    </Routes>
  );
};

export default AppRoutes;
// import { Routes, Route, useNavigate } from "react-router-dom";
// import React, { useState } from "react";
// import Layout from "../pages/Layout";
// import Dashboard from "../pages/Dashboard";
// import AllCategories from "../components/category/AllCategories";
// import AddCategory from "../components/category/AddCategory";
// import ActiveCategories from "../components/category/ActiveCategories";
// import InactiveCategories from "../components/category/InactiveCategories";
// import ViewCategory from "../components/category/ViewCategory";
// import AddMetaInfo from "../components/metaInfo/AddMetaInfo";
// import AllMetaInfo from "../components/metaInfo/AllMetaInfo";
// import Users from "../components/manageUsers/Users";
// import AdminUsers from "../components/manageUsers/AdminUsers";
// import AddAdminUser from "../pages/AddAdminUser";
// import AddUser from "../components/manageUsers/AddUser";
// import Technicians from "../components/manageTechnicians/Technicians";
// import ProvidersDetails from "../pages/ProvidersDetails";
// import AddProvider from "../components/manageTechnicians/AddTechnician";


// interface Category {
//   id: number;
//   // Add other Category properties as needed
// }

// const AppRoutes: React.FC = () => {
//   const navigate = useNavigate();
//   const [editingAdvertisement, setEditingAdvertisement] = useState<number | null>(null);
//   const [editingCategory, setEditingCategory] = useState<number | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

//   const handleViewCategory = (data: Category) => {
//     setSelectedCategory(data);
//     navigate("/categories/view");
//   };

//   const handleEditAdvertisement = (id: number) => {
//     setEditingAdvertisement(id);
//     navigate("/advertisements/edit");
//   };

//   const handleEditCategory = (id: number) => {
//     setEditingCategory(id);
//     navigate("/categories/edit");
//   };

//   return (
//     <Routes>
//       <Route element={<Layout />}>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/dashboard" element={<Dashboard />} />

//         {/* Categories */}
//         <Route
//           path="/categories"
//           element={
//             <AllCategories
//               onAddCategory={() => navigate("/categories/add")}
//               onEdit={handleEditCategory}
//             />
//           }
//         />
//         <Route
//           path="/categories/all"
//           element={
//             <AllCategories onAddCategory={() => navigate("/categories/add")} />
//           }
//         />
//         <Route
//           path="/categories/add"
//           element={<AddCategory onBack={() => navigate("/categories/all")} />}
//         />
//         <Route
//           path="/categories/edit"
//           element={
//             <AddCategory
//               onBack={() => navigate("/categories/all")}
//               isEdit={true}
//               categoryId={editingCategory}
//             />
//           }
//         />
//         <Route
//           path="/categories/active"
//           element={
//             <ActiveCategories
//               onAddCategory={() => navigate("/categories/add")}
//               onEdit={handleEditCategory}
//             />
//           }
//         />
//         <Route path="/categories/inactive" element={<InactiveCategories />} />
//         <Route
//           path="/categorie/:id"
//           element={
//             <ViewCategory
//               onBack={() => navigate("/categories/all")}
//             />
//           }
//         />

//         {/* Meta Info */}
//         <Route path="/meta-info" element={<AllMetaInfo />} />
//         <Route path="/meta-info/all" element={<AllMetaInfo />} />
//         <Route
//           path="/meta-info/add"
//           element={<AddMetaInfo onBack={() => navigate("/meta-info/all")} />}
//         />

//         {/* Subscription */}
//         <Route
//           path="/subscription"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">All Subscriptions</h1>
//               <p>Subscription management coming soon...</p>
//             </div>
//           }
//         />
//         <Route
//           path="/subscription/all"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">All Subscriptions</h1>
//               <p>Subscription management coming soon...</p>
//             </div>
//           }
//         />
//         <Route
//           path="/subscription/add"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">Add Subscription</h1>
//               <p>Add subscription form coming soon...</p>
//             </div>
//           }
//         /> 

//          {/* Management - Users */}
//         <Route
//           path="/management"
//           element={<Users onAddUser={() => navigate("/management/users/add")} />}
//         />
//         <Route
//           path="/management/users"
//           element={<Users onAddUser={() => navigate("/management/users/add")} />}
//         />
//         <Route
//           path="/management/users/all"
//           element={<Users onAddUser={() => navigate("/management/users/add")} />}
//         />
//         <Route
//           path="/management/users/add"
//           element={<AddUser onBack={() => navigate("/management/users/all")} />}
//         />
//         <Route
//           path="/management/users/admin-created"
//           element={
//             <AdminUsers
//               onAddUser={() => navigate("/management/users/add-admin")}
//             />
//           }
//         />
//         <Route
//           path="/management/users/add-admin"
//           element={
//             <AddAdminUser
//               onBack={() => navigate("/management/users/admin-created")}
//             />
//           }
//         />

//         {/* Management - Technicians */}
//         <Route
//           path="/management/technicians"
//           element={
//             <Technicians
//               onAddProvider={() => navigate("/management/technicians/add")}
//             />
//           }
//         />
//         <Route
//           path="/management/technicians/all"
//           element={
//             <ProvidersDetails
//               onAddProvider={() => navigate("/management/technicians/add")}
//             />
//           }
//         />
//         <Route
//           path="/management/technicians/add"
//           element={
//             <AddProvider
//               onBack={() => navigate("/management/technicians/all")}
//             />
//           }
//         />
//         <Route
//           path="/management/technicians/admin-created"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">Admin Created Technicians</h1>
//               <p>Admin created technicians list coming soon...</p>
//             </div>
//           }
//         />

//         {/* Management - Franchises */}
//         <Route path="/management/franchises" element={<BusinessAssociates />} />
//         <Route
//           path="/management/franchises/all"
//           element={<BusinessAssociates />}
//         />
//         <Route
//           path="/management/franchises/add"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">Add Franchise</h1>
//               <p>Add franchise form coming soon...</p>
//             </div>
//           }
//         />
//         <Route
//           path="/management/franchises/admin-created"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">Admin Created Franchises</h1>
//               <p>Admin created franchises list coming soon...</p>
//             </div>
//           }
//         />

//         {/* Areas */}
//         <Route
//           path="/areas"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">All Areas</h1>
//               <p>Areas management coming soon...</p>
//             </div>
//           }
//         />
//         <Route
//           path="/areas/all"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">All Areas</h1>
//               <p>Areas management coming soon...</p>
//             </div>
//           }
//         />
//         <Route
//           path="/areas/add"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">Add Area</h1>
//               <p>Add area form coming soon...</p>
//             </div>
//           }
//         />

//         Bookings
//         <Route path="/bookings" element={<Payments />} />
//         <Route path="/bookings/all" element={<Payments />} />
//         <Route
//           path="/bookings/guest"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">Guest Bookings</h1>
//               <p>Guest bookings list coming soon...</p>
//             </div>
//           }
//         />

//         {/* Reviews */}
//         <Route
//           path="/reviews"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">All Reviews</h1>
//               <p>Reviews management coming soon...</p>
//             </div>
//           }
//         />
//         <Route
//           path="/reviews/all"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">All Reviews</h1>
//               <p>Reviews management coming soon...</p>
//             </div>
//           }
//         />

//         {/* Advertisements */}
//         <Route
//           path="/advertisements"
//           element={<AdvertisementPosts onEdit={handleEditAdvertisement} />}
//         />
//         <Route
//           path="/advertisements/all"
//           element={<AdvertisementPosts onEdit={handleEditAdvertisement} />}
//         />
//         <Route
//           path="/advertisements/add"
//           element={
//             <div className="p-8">
//               <h1 className="text-2xl font-bold">Add Advertisement</h1>
//               <p>Add advertisement form coming soon...</p>
//             </div>
//           }
//         />
//         <Route
//           path="/advertisements/edit"
//           element={
//             <EditAdvertisement
//               onBack={() => navigate("/advertisements/all")}
//             />
//           }
//         />

//         {/* Legacy Routes */}
//         <Route
//           path="/services"
//           element={
//             <AllCategories
//               onAddCategory={() => navigate("/categories/add")}
//               onEdit={handleEditCategory}
//             />
//           }
//         />
//         <Route
//           path="/all-services"
//           element={
//             <AllCategories
//               onAddCategory={() => navigate("/categories/add")}
//               onEdit={handleEditCategory}
//             />
//           }
//         />
//         <Route path="*" element={<Dashboard />} />
//       </Route>

//     </Routes>
//   );
// };

// export default AppRoutes;
// // import { Routes, Route, useNavigate, useParams } from "react-router-dom";
// // import React, { useState } from "react";
// // import Dashboard from "../pages/Dashboard";
// // import AllCategories from "../components/category/AllCategories";
// // import AddCategory from "../components/category/AddCategory";
// // import ActiveCategories from "../components/category/ActiveCategories";
// // import ViewCategory from "../components/category/ViewCategory";
// // import InactiveCategories from "../components/category/InactiveCategories";
// // import Layout from "../pages/Layout";

// // const AppRoutes = () => {
// //   const navigate = useNavigate();
// //   const [editingAdvertisement, setEditingAdvertisement] = useState<
// //     number | null
// //   >(null);
// //   const [editingCategory, setEditingCategory] = useState<number | null>(null);
// //   const [selectedCategory, setSelectedCategory] = useState<Category | null>(
// //     null
// //   );

// //   const handlePageChange = (page: string) => {
// //     navigate(`/${page}`);
// //     setEditingAdvertisement(null);
// //     setEditingCategory(null);
// //   };

// //   const handleViewCategory = (data: Category) => {
// //     setSelectedCategory(data);
// //     navigate("/view-category");
// //   };

// //   const handleEditAdvertisement = (id: number) => {
// //     setEditingAdvertisement(id);
// //     navigate("/edit-advertisement");
// //   };

// //   const handleEditCategory = (id: number) => {
// //     setEditingCategory(id);
// //     navigate("/edit-category");
// //   };

// //   return (
// //     <Routes>
// //       <Route element={<Layout />}>
// //         <Route path="/" element={<Dashboard />} />
// //         <Route path="/dashboard" element={<Dashboard />} />

// //         {/* Categories */}
// //         <Route
// //           path="/categories"
// //           element={
// //             <AllCategories
// //               onAddCategory={() => navigate("/add-category")}
// //               onEdit={handleEditCategory}
// //             />
// //           }
// //         />
// //         <Route
// //           path="/all-categories"
// //           element={
// //             <AllCategories onAddCategory={() => navigate("/add-category")} />
// //           }
// //         />
// //         <Route
// //           path="/add-category"
// //           element={<AddCategory onBack={() => navigate("/all-categories")} />}
// //         />
// //         <Route
// //           path="/edit-category"
// //           element={
// //             <AddCategory
// //               onBack={() => navigate("/all-categories")}
// //               isEdit={true}
// //               categoryId={editingCategory}
// //             />
// //           }
// //         />
// //         <Route
// //           path="/active-categories"
// //           element={
// //             <ActiveCategories
// //               onAddCategory={() => navigate("/add-category")}
// //               onEdit={handleEditCategory}
// //             />
// //           }
// //         />
// //         <Route path="/inactive-categories" element={<InactiveCategories />} />
// //         <Route
// //           path="/view-category"
// //           element={
// //             <ViewCategory
// //               onBack={() => navigate("/all-categories")}
// //               category={selectedCategory}
// //             />
// //           }
// //         />
// //         {/* <Route path="/deleted-categories" element={<DeletedServices />} /> */}

// //         {/* Meta Info */}
// //         <Route path="/metaInfo" element={<AllMetaInfo />} />
// //         <Route path="/all-meta-info" element={<AllMetaInfo />} />
// //         <Route path="/add-meta-info" element={<AddMetaInfo onBack={() => navigate('/all-meta-info')} />} />

// //         {/* Subscription */}
// //         <Route path="/subscription" element={<div className="p-8"><h1 className="text-2xl font-bold">All Subscriptions</h1><p>Subscription management coming soon...</p></div>} />
// //         <Route path="/all-subscriptions" element={<div className="p-8"><h1 className="text-2xl font-bold">All Subscriptions</h1><p>Subscription management coming soon...</p></div>} />
// //         <Route path="/add-subscription" element={<div className="p-8"><h1 className="text-2xl font-bold">Add Subscription</h1><p>Add subscription form coming soon...</p></div>} />
// //         <Route path="/edit-subscription" element={<div className="p-8"><h1 className="text-2xl font-bold">Edit Subscription</h1><p>Edit subscription form coming soon...</p></div>} />

// //         {/* Management - Users */}
// //         <Route path="/management" element={<Users onAddUser={() => navigate('/add-user')} />} />
// //         <Route path="/manage-users" element={<Users onAddUser={() => navigate('/add-user')} />} />
// //         <Route path="/all-users" element={<Users onAddUser={() => navigate('/add-user')} />} />
// //         <Route path="/add-user" element={<AddUser onBack={() => navigate('/all-users')} />} />
// //         <Route path="/edit-user" element={<div className="p-8"><h1 className="text-2xl font-bold">Edit User</h1><p>Edit user form coming soon...</p></div>} />
// //         <Route path="/delete-user" element={<div className="p-8"><h1 className="text-2xl font-bold">Delete User</h1><p>Delete user interface coming soon...</p></div>} />
// //         <Route path="/admin-created-users" element={<AdminUsers onAddUser={() => navigate('/add-admin-user')} />} />
// //         <Route path="/admin-users" element={<AdminUsers onAddUser={() => navigate('/add-admin-user')} />} />
// //         <Route path="/add-admin-user" element={<AddAdminUser onBack={() => navigate('/admin-users')} />} />

// //         {/* Management - Technicians */}
// //         <Route path="/manage-technicians" element={<Providers onAddProvider={() => navigate('/add-technician')} />} />
// //         <Route path="/all-technicians" element={<Providers onAddProvider={() => navigate('/add-technician')} />} />
// //         <Route path="/add-technician" element={<AddProvider onBack={() => navigate('/all-technicians')} />} />
// //         <Route path="/edit-technician" element={<div className="p-8"><h1 className="text-2xl font-bold">Edit Technician</h1><p>Edit technician form coming soon...</p></div>} />
// //         <Route path="/delete-technician" element={<div className="p-8"><h1 className="text-2xl font-bold">Delete Technician</h1><p>Delete technician interface coming soon...</p></div>} />
// //         <Route path="/admin-created-technicians" element={<div className="p-8"><h1 className="text-2xl font-bold">Admin Created Technicians</h1><p>Admin created technicians list coming soon...</p></div>} />
// //         <Route path="/providers" element={<Providers onAddProvider={() => navigate('/add-provider')} />} />
// //         <Route path="/add-provider" element={<AddProvider onBack={() => navigate('/providers')} />} />
// //         <Route path="/providers-details" element={<ProvidersDetails />} />

// //         {/* Management - Franchises */}
// //         <Route path="/manage-franchises" element={<BusinessAssociates />} />
// //         <Route path="/all-franchises" element={<BusinessAssociates />} />
// //         <Route path="/add-franchise" element={<div className="p-8"><h1 className="text-2xl font-bold">Add Franchise</h1><p>Add franchise form coming soon...</p></div>} />
// //         <Route path="/edit-franchise" element={<div className="p-8"><h1 className="text-2xl font-bold">Edit Franchise</h1><p>Edit franchise form coming soon...</p></div>} />
// //         <Route path="/delete-franchise" element={<div className="p-8"><h1 className="text-2xl font-bold">Delete Franchise</h1><p>Delete franchise interface coming soon...</p></div>} />
// //         <Route path="/admin-created-franchises" element={<div className="p-8"><h1 className="text-2xl font-bold">Admin Created Franchises</h1><p>Admin created franchises list coming soon...</p></div>} />
// //         <Route path="/bda" element={<BusinessAssociates />} />

// //         {/* Areas */}
// //         <Route path="/areas" element={<div className="p-8"><h1 className="text-2xl font-bold">All Areas</h1><p>Areas management coming soon...</p></div>} />
// //         <Route path="/all-areas" element={<div className="p-8"><h1 className="text-2xl font-bold">All Areas</h1><p>Areas management coming soon...</p></div>} />
// //         <Route path="/add-area" element={<div className="p-8"><h1 className="text-2xl font-bold">Add Area</h1><p>Add area form coming soon...</p></div>} />
// //         <Route path="/edit-area" element={<div className="p-8"><h1 className="text-2xl font-bold">Edit Area</h1><p>Edit area form coming soon...</p></div>} />
// //         <Route path="/delete-area" element={<div className="p-8"><h1 className="text-2xl font-bold">Delete Area</h1><p>Delete area interface coming soon...</p></div>} />

// //         {/* Bookings */}
// //         <Route path="/bookings" element={<Payments />} />
// //         <Route path="/all-bookings" element={<Payments />} />
// //         <Route path="/guest-bookings" element={<div className="p-8"><h1 className="text-2xl font-bold">Guest Bookings</h1><p>Guest bookings list coming soon...</p></div>} />
// //         <Route path="/payments" element={<Payments />} />

// //         {/* Reviews */}
// //         <Route path="/reviews" element={<div className="p-8"><h1 className="text-2xl font-bold">All Reviews</h1><p>Reviews management coming soon...</p></div>} />
// //         <Route path="/all-reviews" element={<div className="p-8"><h1 className="text-2xl font-bold">All Reviews</h1><p>Reviews management coming soon...</p></div>} />

// //         {/* Advertisements */}
// //         <Route path="/advertisements" element={<AdvertisementPosts onEdit={handleEditAdvertisement} />} />
// //         <Route path="/all-advertisements" element={<AdvertisementPosts onEdit={handleEditAdvertisement} />} />
// //         <Route path="/add-advertisement" element={<div className="p-8"><h1 className="text-2xl font-bold">Add Advertisement</h1><p>Add advertisement form coming soon...</p></div>} />
// //         <Route path="/edit-advertisement" element={<EditAdvertisement onBack={() => navigate('/all-advertisements')} />} />
// //         <Route path="/delete-advertisement" element={<div className="p-8"><h1 className="text-2xl font-bold">Delete Advertisement</h1><p>Delete advertisement interface coming soon...</p></div>} />

// //         {/* Legacy Routes */}
// //         <Route path="/services" element={<AllCategories onAddCategory={() => navigate('/add-category')} onEdit={handleEditCategory} />} />
// //         <Route path="/all-services" element={<AllCategories onAddCategory={() => navigate('/add-category')} onEdit={handleEditCategory} />} />
// //         <Route path="/pending-services" element={<PendingServices />} />
// //         <Route path="/deleted-services" element={<DeletedServices />} />
// //         <Route path="/inactive-services" element={<InactiveServices />} />
// //         <Route path="/work-gallery" element={<WorkGallery />} />
// //         <Route path="/video-gallery" element={<VideoGallery />} />

// //       </Route>

// //       <Route path="*" element={<Dashboard />} />
// //     </Routes>
// //   );
// // };

// // export default AppRoutes;