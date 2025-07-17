import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import AllCategories from './components/category/AllCategories';
import AddCategory from './components/category/AddCategory';
import PendingServices from './pages/PendingServices';
import DeletedServices from './components/category/DeletedCategories';
import InactiveServices from './components/category/InactiveCategories';
import Payments from './components/bookings/Payments';
import WorkGallery from './pages/WorkGallery';
import VideoGallery from './pages/VideoGallery';
import AdvertisementPosts from './components/advertisements/AdvertisementPosts';
import EditAdvertisement from './components/advertisements/EditAdvertisement';
import AdminUsers from './components/manageUsers/AdminUsers';
import AddAdminUser from './pages/AddAdminUser';
import Providers from './components/manageTechnicians/Technicians';
import AddProvider from './components/manageTechnicians/AddTechnician';
import Users from './components/manageUsers/Users';
import BusinessAssociates from './components/manageFranchise/Franchises';
import ProvidersDetails from './pages/ProvidersDetails';
import ActiveCategories from './components/category/ActiveCategories';
import AddUser from './components/manageUsers/AddUser';
import Layout from './pages/Layout';
import AllMetaInfo from './components/metaInfo/AllMetaInfo';
import AddMetaInfo from './components/metaInfo/AddMetaInfo';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingAdvertisement, setEditingAdvertisement] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setEditingAdvertisement(null);
    setEditingCategory(null);
  };

  const handleEditAdvertisement = (id: number) => {
    setEditingAdvertisement(id);
    setCurrentPage('edit-advertisement');
  };

  const handleEditCategory = (id: number) => {
    setEditingCategory(id);
    setCurrentPage('edit-category');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      
      // Categories
      case 'categories':
      case 'all-categories':
        return <AllCategories onAddCategory={() => setCurrentPage('add-category')} onEdit={handleEditCategory} />;
      case 'add-category':
        return <AddCategory onBack={() => setCurrentPage('all-categories')} />;
      case 'edit-category':
        return <AddCategory onBack={() => setCurrentPage('all-categories')} isEdit={true} categoryId={editingCategory} />;
      case 'active-categories':
        return <ActiveCategories onAddCategory={() => setCurrentPage('add-category')} onEdit={handleEditCategory} />;
      case 'inactive-categories':
        return <InactiveServices />;
      case 'deleted-categories':
        return <DeletedServices />;

         case 'metaInfo':
      case 'all-meta-info':
        return <AllMetaInfo/>;
      case 'add-meta-info':
        return <AddMetaInfo onBack={() => setCurrentPage('all-meta-info')} />;

      // Subscription
      case 'subscription':
      case 'all-subscriptions':
        return <div className="p-8"><h1 className="text-2xl font-bold">All Subscriptions</h1><p>Subscription management coming soon...</p></div>;
      case 'add-subscription':
        return <div className="p-8"><h1 className="text-2xl font-bold">Add Subscription</h1><p>Add subscription form coming soon...</p></div>;
      case 'edit-subscription':
        return <div className="p-8"><h1 className="text-2xl font-bold">Edit Subscription</h1><p>Edit subscription form coming soon...</p></div>;
      case 'deleted-subscriptions':
        return <div className="p-8"><h1 className="text-2xl font-bold">Deleted Subscriptions</h1><p>Deleted subscriptions list coming soon...</p></div>;

      // Management - Users
      case 'management':
      case 'manage-users':
      case 'all-users':
        return <Users onAddUser={() => setCurrentPage('add-user')} />;
      case 'add-user':
        return <AddUser onBack={() => setCurrentPage('all-users')} />;
      case 'edit-user':
        return <div className="p-8"><h1 className="text-2xl font-bold">Edit User</h1><p>Edit user form coming soon...</p></div>;
      case 'delete-user':
        return <div className="p-8"><h1 className="text-2xl font-bold">Delete User</h1><p>Delete user interface coming soon...</p></div>;
      case 'admin-created-users':
        return <AdminUsers onAddUser={() => setCurrentPage('add-admin-user')} />;

      // Management - Technicians
      case 'manage-technicians':
      case 'all-technicians':
        return <Providers onAddProvider={() => setCurrentPage('add-technician')} />;
      case 'add-technician':
        return <AddProvider onBack={() => setCurrentPage('all-technicians')} />;
      case 'edit-technician':
        return <div className="p-8"><h1 className="text-2xl font-bold">Edit Technician</h1><p>Edit technician form coming soon...</p></div>;
      case 'delete-technician':
        return <div className="p-8"><h1 className="text-2xl font-bold">Delete Technician</h1><p>Delete technician interface coming soon...</p></div>;
      case 'admin-created-technicians':
        return <div className="p-8"><h1 className="text-2xl font-bold">Admin Created Technicians</h1><p>Admin created technicians list coming soon...</p></div>;

      // Management - Franchises
      case 'manage-franchises':
      case 'all-franchises':
        return <BusinessAssociates />;
      case 'add-franchise':
        return <div className="p-8"><h1 className="text-2xl font-bold">Add Franchise</h1><p>Add franchise form coming soon...</p></div>;
      case 'edit-franchise':
        return <div className="p-8"><h1 className="text-2xl font-bold">Edit Franchise</h1><p>Edit franchise form coming soon...</p></div>;
      case 'delete-franchise':
        return <div className="p-8"><h1 className="text-2xl font-bold">Delete Franchise</h1><p>Delete franchise interface coming soon...</p></div>;
      case 'admin-created-franchises':
        return <div className="p-8"><h1 className="text-2xl font-bold">Admin Created Franchises</h1><p>Admin created franchises list coming soon...</p></div>;

      // Areas
      case 'areas':
      case 'all-areas':
        return <div className="p-8"><h1 className="text-2xl font-bold">All Areas</h1><p>Areas management coming soon...</p></div>;
      case 'add-area':
        return <div className="p-8"><h1 className="text-2xl font-bold">Add Area</h1><p>Add area form coming soon...</p></div>;
      case 'edit-area':
        return <div className="p-8"><h1 className="text-2xl font-bold">Edit Area</h1><p>Edit area form coming soon...</p></div>;
      case 'delete-area':
        return <div className="p-8"><h1 className="text-2xl font-bold">Delete Area</h1><p>Delete area interface coming soon...</p></div>;

      // Bookings
      case 'bookings':
      case 'all-bookings':
        return <Payments />;
      case 'guest-bookings':
        return <div className="p-8"><h1 className="text-2xl font-bold">Guest Bookings</h1><p>Guest bookings list coming soon...</p></div>;

      // Reviews
      case 'reviews':
      case 'all-reviews':
        return <div className="p-8"><h1 className="text-2xl font-bold">All Reviews</h1><p>Reviews management coming soon...</p></div>;

      // Advertisements
      case 'advertisements':
      case 'all-advertisements':
        return <AdvertisementPosts onEdit={handleEditAdvertisement} />;
      case 'add-advertisement':
        return <div className="p-8"><h1 className="text-2xl font-bold">Add Advertisement</h1><p>Add advertisement form coming soon...</p></div>;
      case 'edit-advertisement':
        return <EditAdvertisement onBack={() => setCurrentPage('all-advertisements')} />;
      case 'delete-advertisement':
        return <div className="p-8"><h1 className="text-2xl font-bold">Delete Advertisement</h1><p>Delete advertisement interface coming soon...</p></div>;

      // Legacy routes (for backward compatibility)
      case 'services':
      case 'all-services':
        return <AllCategories onAddCategory={() => setCurrentPage('add-category')} onEdit={handleEditCategory} />;
      case 'pending-services':
        return <PendingServices />;
      case 'deleted-services':
        return <DeletedServices />;
      case 'inactive-services':
        return <InactiveServices />;
      case 'payments':
        return <Payments />;
      case 'work-gallery':
        return <WorkGallery />;
      case 'video-gallery':
        return <VideoGallery />;
      case 'admin-users':
        return <AdminUsers onAddUser={() => setCurrentPage('add-admin-user')} />;
      case 'add-admin-user':
        return <AddAdminUser onBack={() => setCurrentPage('admin-users')} />;
      case 'providers':
        return <Providers onAddProvider={() => setCurrentPage('add-provider')} />;
      case 'add-provider':
        return <AddProvider onBack={() => setCurrentPage('providers')} />;
      case 'users':
        return <Users onAddUser={() => setCurrentPage('add-user')} />;
      case 'bda':
        return <BusinessAssociates />;
      case 'providers-details':
        return <ProvidersDetails />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={handlePageChange}>
      {renderContent()}
    </Layout>
  );
}

export default App;