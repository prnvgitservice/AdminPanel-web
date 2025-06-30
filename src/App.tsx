import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ServicesList from './components/ServicesList';
import AddService from './components/AddService';
import PendingServices from './components/PendingServices';
import DeletedServices from './components/DeletedServices';
import InactiveServices from './components/InactiveServices';
import Payments from './components/Payments';
import WorkGallery from './components/WorkGallery';
import VideoGallery from './components/VideoGallery';
import AdvertisementPosts from './components/AdvertisementPosts';
import EditAdvertisement from './components/EditAdvertisement';
import AdminUsers from './components/AdminUsers';
import AddAdminUser from './components/AddAdminUser';
import Providers from './components/Providers';
import AddProvider from './components/AddProvider';
import Users from './components/Users';
import AddUser from './components/AddUser';
import BusinessAssociates from './components/BusinessAssociates';
import ProvidersDetails from './components/ProvidersDetails';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingAdvertisement, setEditingAdvertisement] = useState<number | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setEditingAdvertisement(null);
  };

  const handleEditAdvertisement = (id: number) => {
    setEditingAdvertisement(id);
    setCurrentPage('edit-advertisement');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'all-services':
        return <ServicesList onAddService={() => setCurrentPage('add-service')} />;
      case 'add-service':
        return <AddService onBack={() => setCurrentPage('all-services')} />;
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
      case 'advertisements':
        return <AdvertisementPosts onEdit={handleEditAdvertisement} />;
      case 'edit-advertisement':
        return <EditAdvertisement onBack={() => setCurrentPage('advertisements')} />;
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
      case 'add-user':
        return <AddUser onBack={() => setCurrentPage('users')} />;
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