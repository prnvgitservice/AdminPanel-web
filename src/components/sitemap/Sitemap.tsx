import { Link2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sitemap: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSubmenu = (menu: string) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  useEffect(() => {
    // Initialize any required scripts or plugins here
    // For example, jQuery, Bootstrap, etc., if needed
  }, []);

  return (
    <div className="main-wrapper font-sans">

      {/* Page Content */}
      <div className="page-wrapper ml-0 p-6 max-w-2xl ">
        <div className="content container-fluid">
          <div className="page-header mb-4">
            <div className="row">
              <div className="col-12">
                <h3 className="page-title text-2xl font-bold">Sitemap</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-sm-12 col-12">
              <div className="card shadow rounded">
                <div className="card-header bg-gray-100 p-4">
                  <h4 className="card-title text-lg font-semibold">Sitemap</h4>
                </div>
                <div className="card-body p-4">
                  <input type="hidden" id="user_csrf" name="csrf_token_name" value="316e6e4900706688f97d63f35918ee1b" />
                  <div className="form-group mb-4">
                    <label className="block text-sm font-medium text-gray-700">Sitemap URL</label>
                    <input
                      type="text"
                      className="form-control w-full p-2 border rounded"
                      name="sitemap_url"
                      id="sitemap_url"
                      placeholder="Enter Website Name"
                      value="https://prnvservices.com/new/sitemap.xml"
                      readOnly
                    />
                  </div>
                  <div className="form-group mb-4 flex gap-2">
                    <label className="block text-sm font-medium text-gray-700">Sitemap File</label>
                    <a
                      target="_blank"
                      href="https://prnvservices.com/new/sitemap.xml"
                      className="btn btn-success btn-sm inline-flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      title="View Sitemap"
                    >
                      <Link2 className='w-5 h-5 mr-2' /> View Sitemap File
                    </a>
                  </div>
                  <div className="form-group flex gap-2">
                    <label className="block text-sm font-medium text-gray-700">Rebuild Your Sitemap</label>
                    <a
                      href="#"
                      className="btn btn-primary btn-sm inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="Rebuild Your Sitemap"
                      id="rebuild_sitemap"
                    >
                      <Link2 className='w-5 h-5 mr-2' /> Rebuild Your Sitemap
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;