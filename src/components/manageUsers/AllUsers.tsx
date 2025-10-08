import React, { useState, useEffect } from "react";
import { Users, Search, Eye, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteUserByAdmin, getAllUsers } from "../../api/apiMethods";

// Interface for User data
interface User {
  id: string;
  username: string;
  phoneNumber: string;
  role: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
}

interface ApiResponse {
  success: boolean;
  users: User[];
  total: number;
  offset: number;
  limit: number;
}

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]); // Store all users from API
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Store filtered users for display
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Map API user to local User interface
  const mapUser = (apiUser: any): User => ({
    id: apiUser.id,
    username: apiUser.username,
    phoneNumber: apiUser.phoneNumber,
    role: apiUser.role,
    buildingName: apiUser.buildingName,
    areaName: apiUser.areaName,
    subAreaName: apiUser.subAreaName,
    city: apiUser.city,
    state: apiUser.state,
    pincode: apiUser.pincode,
    fullAddress: `${apiUser.buildingName}, ${apiUser.subAreaName}, ${apiUser.areaName}, ${apiUser.city}, ${apiUser.state} - ${apiUser.pincode}`,
  });

  // Fetch users with server-side pagination
  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const offset = (currentPage - 1) * limit;
    try {
      const data = { offset, limit };
      const response: ApiResponse = await getAllUsers(data);
      if (!response.success) {
        throw new Error("Failed to fetch users");
      }
      const mappedUsers = response.users.map(mapUser);
      setAllUsers(mappedUsers);
      setFilteredUsers(mappedUsers); // Initially set filtered users to all users
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || "Failed to load users. Please try again.");
      setAllUsers([]);
      setFilteredUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, limit]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers]);

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeleteLoading(userId);
    setError(null);
    try {
      await deleteUserByAdmin(userId);
      fetchUsers(); // Refetch current page after delete
      alert("User deleted successfully!");
      if (filteredUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1); // Go to previous page if last item deleted
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete user. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Don't reset current page here since we're filtering client-side
  };

  const totalPages = Math.ceil(total / limit);
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              All Users
            </h1>
          </div>
          <button
            onClick={() => navigate("/management/users/add")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex-1 gap-4">
            <div className="w-full flex gap-2">
              <div className="relative flex-1 w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or phone number..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>

              <div className="w-1/4">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Users Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        <p className="text-gray-500 text-lg">
                          {searchTerm ? `No users found for "${searchTerm}".` : "There are no users available."}
                        </p>
                        <button
                          onClick={() => navigate("/management/users/add")}
                          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create User
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={user.fullAddress}>
                            {user.fullAddress}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() =>
                              navigate(`/management/users/view/${user.id}`, { state: { user } })
                            }
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="View"
                            disabled={deleteLoading === user.id}
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/management/users/edit/${user.id}`, { state: { user } })
                            }
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 ml-2"
                            title="Edit"
                            disabled={deleteLoading === user.id}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 ml-2"
                            title="Delete"
                            disabled={deleteLoading === user.id}
                          >
                            {deleteLoading === user.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startItem}</span> to{" "}
                  <span className="font-medium">{endItem}</span> of{" "}
                  <span className="font-medium">{total}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md border font-medium ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-md border font-medium ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md border font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
// import React, { useState, useEffect } from "react";
// import { Users, Search, Eye, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { deleteUserByAdmin, getAllUsers } from "../../api/apiMethods";

// // Interface for User data
// interface User {
//   id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   fullAddress: string;
// }

// interface ApiResponse {
//   success: boolean;
//   users: User[];
//   total: number;
//   offset: number;
//   limit: number;
// }

// const AllUsers = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   // Map API user to local User interface
//   const mapUser = (apiUser: any): User => ({
//     id: apiUser.id,
//     username: apiUser.username,
//     phoneNumber: apiUser.phoneNumber,
//     role: apiUser.role,
//     buildingName: apiUser.buildingName,
//     areaName: apiUser.areaName,
//     subAreaName: apiUser.subAreaName,
//     city: apiUser.city,
//     state: apiUser.state,
//     pincode: apiUser.pincode,
//     fullAddress: `${apiUser.buildingName}, ${apiUser.subAreaName}, ${apiUser.areaName}, ${apiUser.city}, ${apiUser.state} - ${apiUser.pincode}`,
//   });

//   // Fetch users with server-side pagination and search
//   const fetchUsers = async (): Promise<void> => {
//     setLoading(true);
//     setError(null);
//     const offset = (currentPage - 1) * limit;
//     try {
//       const data = { offset, limit };
//       const response: ApiResponse = await getAllUsers(data);
//       if (!response.success) {
//         throw new Error("Failed to fetch users");
//       }
//       setUsers(response.users.map(mapUser));
//       setTotal(response.total);
//     } catch (err: any) {
//       setError(err.message || "Failed to load users. Please try again.");
//       setUsers([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [currentPage, limit]);

//   // Delete user
//   const handleDeleteUser = async (userId: string) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     setDeleteLoading(userId);
//     setError(null);
//     try {
//       await deleteUserByAdmin(userId);
//       fetchUsers(); // Refetch current page after delete
//       alert("User deleted successfully!");
//       if (users.length === 1 && currentPage > 1) {
//         setCurrentPage(currentPage - 1); // Go to previous page if last item deleted
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to delete user. Please try again.");
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit);
//     setCurrentPage(1); // Reset to first page
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to first page on search
//   };

//   const totalPages = Math.ceil(total / limit);
//   const startItem = (currentPage - 1) * limit + 1;
//   const endItem = Math.min(currentPage * limit, total);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <Users className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               All Users
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/management/users/add")}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add User
//           </button>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
//           <div className="flex-1 gap-4">
//             <div className="w-full flex gap-2">
//               <div className="relative flex-1 w-1/3">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name or phone number..."
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                 />
//               </div>

//               <div className="w-1/4">
//                 <select
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                   value={limit}
//                   onChange={(e) => handleLimitChange(Number(e.target.value))}
//                 >
//                   <option value={5}>5 per page</option>
//                   <option value={10}>10 per page</option>
//                   <option value={20}>20 per page</option>
//                   <option value={50}>50 per page</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Error Messages */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {error}
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         )}

//         {/* Users Table */}
//         {!loading && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Username
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Phone Number
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Role
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Full Address
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {users.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-4 text-center">
//                         <p className="text-gray-500 text-lg">
//                           {searchTerm ? `No users found for "${searchTerm}".` : "There are no users available."}
//                         </p>
//                         <button
//                           onClick={() => navigate("/management/users/add")}
//                           className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           Create User
//                         </button>
//                       </td>
//                     </tr>
//                   ) : (
//                     users.map((user) => (
//                       <tr key={user.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             {user.username}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{user.phoneNumber}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">
//                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                               user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                             }`}>
//                               {user.role}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-900 max-w-xs truncate" title={user.fullAddress}>
//                             {user.fullAddress}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <button
//                             onClick={() =>
//                               navigate(`/management/users/view/${user.id}`, { state: { user } })
//                             }
//                             className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                             title="View"
//                             disabled={deleteLoading === user.id}
//                           >
//                             <Eye className="h-5 w-5" />
//                           </button>
//                           <button
//                             onClick={() =>
//                               navigate(`/management/users/edit/${user.id}`, { state: { user } })
//                             }
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 ml-2"
//                             title="Edit"
//                             disabled={deleteLoading === user.id}
//                           >
//                             <Edit className="h-5 w-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUser(user.id)}
//                             className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 ml-2"
//                             title="Delete"
//                             disabled={deleteLoading === user.id}
//                           >
//                             {deleteLoading === user.id ? (
//                               <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
//                             ) : (
//                               <Trash2 className="h-5 w-5" />
//                             )}
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {total > 0 && (
//               <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="text-sm text-gray-700">
//                   Showing <span className="font-medium">{startItem}</span> to{" "}
//                   <span className="font-medium">{endItem}</span> of{" "}
//                   <span className="font-medium">{total}</span> results
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-2 rounded-md border font-medium ${
//                       currentPage === 1
//                         ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
//                         : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       className={`px-3 py-2 rounded-md border font-medium ${
//                         currentPage === page
//                           ? 'bg-blue-600 text-white border-blue-600'
//                           : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className={`px-3 py-2 rounded-md border font-medium ${
//                       currentPage === totalPages
//                         ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
//                         : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllUsers;
// import React, { useState, useEffect } from "react";
// import { Users, Search, Eye, Plus, ArrowUpDown, Edit, Trash2, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { deleteUserByAdmin, getAllUsers } from "../../api/apiMethods";

// // Interface for User data
// interface User {
//   id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   fullAddress: string;
// }

// interface ApiResponse {
//   success: boolean;
//   users: User[]; // Updated to match the API response structure
//   total: number;
//   offset: number;
//   limit: number;
// }

// const AllUsers = () => {
//   const [allUsers, setAllUsers] = useState<User[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   // Map API user to local User interface
//   const mapUser = (apiUser: any): User => ({
//     id: apiUser.id,
//     username: apiUser.username,
//     phoneNumber: apiUser.phoneNumber,
//     role: apiUser.role,
//     buildingName: apiUser.buildingName,
//     areaName: apiUser.areaName,
//     subAreaName: apiUser.subAreaName,
//     city: apiUser.city,
//     state: apiUser.state,
//     pincode: apiUser.pincode,
//     fullAddress: `${apiUser.buildingName}, ${apiUser.subAreaName}, ${apiUser.areaName}, ${apiUser.city}, ${apiUser.state} - ${apiUser.pincode}`,
//   });

//   // Fetch all users by paginating through the API
//   const fetchAllUsers = async (): Promise<void> => {
//     setLoading(true);
//     setError(null);
//     try {
//       let allFetchedUsers: User[] = [];
//       let currentOffset = offset;
//       const pageSize = limit; // Fetch in chunks to avoid large requests
//       while (true) {
//         const data = { offset: currentOffset, limit: pageSize };
//         const response: ApiResponse = await getAllUsers(data);
//         if (!response.success) {
//           throw new Error("Failed to fetch users");
//         }
//         const mappedUsers = response.users.map(mapUser); // Updated to response.users
//         allFetchedUsers = [...allFetchedUsers, ...mappedUsers];
//         if (mappedUsers.length < pageSize) {
//           break;
//         }
//         currentOffset += pageSize;
//       }
//       setAllUsers(allFetchedUsers);
//     } catch (err: any) {
//       setError(err.message || "Failed to load users. Please try again.");
//       setAllUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Compute filtered and paginated users (client-side search)
//   useEffect(() => {
//     if (allUsers.length === 0 && !loading) {
//       setUsers([]);
//       setTotal(0);
//       return;
//     }
//     const lowerSearch = searchTerm.toLowerCase();
//     const filtered = allUsers.filter((user) =>
//       user.username.toLowerCase().includes(lowerSearch) ||
//       user.phoneNumber.includes(searchTerm)
//     );
//     setTotal(filtered.length);
//     const startIndex = offset;
//     const endIndex = startIndex + limit;
//     const paginatedUsers = filtered.slice(startIndex, endIndex);
//     setUsers(paginatedUsers);
//   }, [allUsers, searchTerm, offset, limit]);

//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

//   // Delete user
//   const handleDeleteUser = async (userId: string) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     setDeleteLoading(userId);
//     setError(null);
//     try {
//       await deleteUserByAdmin(userId);
//       await fetchAllUsers(); // Refetch all after delete
//       alert("User deleted successfully!");
//       setOffset(0); // Reset to first page after deletion
//     } catch (err: any) {
//       setError(err.message || "Failed to delete user. Please try again.");
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   const handlePageChange = (newOffset: number) => {
//     setOffset(newOffset);
//   };

//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit);
//     setOffset(0); // Reset to first page
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     setOffset(0); // Reset to first page on search
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <Users className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               All Users
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/management/users/add")}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add User
//           </button>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
//           <div className="flex-1 gap-4">
//             <div className="w-full flex gap-2">
//               <div className="relative flex-1 w-1/3">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name or phone number..."
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                 />
//               </div>

//               <div className="w-1/4">
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                 value={limit}
//                 onChange={(e) => handleLimitChange(Number(e.target.value))}
//               >
//                 <option value={5}>5 per page</option>
//                 <option value={10}>10 per page</option>
//                 <option value={20}>20 per page</option>
//                 <option value={50}>50 per page</option>
//               </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Error Messages */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {error}
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         )}

//         {/* Users Table */}
//         {!loading && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Username
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Phone Number
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Role
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Full Address
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {users.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-4 text-center">
//                         <p className="text-gray-500 text-lg">
//                           {searchTerm ? `No users found for "${searchTerm}".` : "There are no users available."}
//                         </p>
//                         <button
//                           onClick={() => navigate("/users/add")}
//                           className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           Create User
//                         </button>
//                       </td>
//                     </tr>
//                   ) : (
//                     users.map((user) => (
//                       <tr key={user.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             {user.username}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{user.phoneNumber}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">
//                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                               user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                             }`}>
//                               {user.role}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-900 max-w-xs truncate" title={user.fullAddress}>
//                             {user.fullAddress}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <button
//                             onClick={() =>
//                               navigate(`/management/users/view/${user.id}`, { state: { user } })
//                             }
//                             className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                             title="View"
//                             disabled={deleteLoading === user.id}
//                           >
//                             <Eye className="h-5 w-5" />
//                           </button>
//                           <button
//                             onClick={() =>
//                               navigate(`/management/users/edit/${user.id}`, { state: { user } })
//                             }
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 ml-2"
//                             title="Edit"
//                             disabled={deleteLoading === user.id}
//                           >
//                             <Edit className="h-5 w-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUser(user.id)}
//                             className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 ml-2"
//                             title="Delete"
//                             disabled={deleteLoading === user.id}
//                           >
//                             {deleteLoading === user.id ? (
//                               <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
//                             ) : (
//                               <Trash2 className="h-5 w-5" />
//                             )}
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {total > 0 && (
//               <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
//                 <div className="flex-1 flex justify-between sm:hidden">
//                   <button
//                     onClick={() => handlePageChange(Math.max(0, offset - limit))}
//                     disabled={offset === 0}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     onClick={() => handlePageChange(offset + limit)}
//                     disabled={offset + limit >= total}
//                     className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </div>
//                 <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm text-gray-700">
//                       Showing <span className="font-medium">{Math.min(offset + limit, total)}</span> of{" "}
//                       <span className="font-medium">{total}</span> results
//                     </p>
//                   </div>
//                   <div>
//                     <nav
//                       className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                       aria-label="Pagination"
//                     >
//                       <button
//                         onClick={() => handlePageChange(Math.max(0, offset - limit))}
//                         disabled={offset === 0}
//                         className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <span className="sr-only">Previous</span>
//                         <ArrowLeft className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => handlePageChange(offset + limit)}
//                         disabled={offset + limit >= total}
//                         className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <span className="sr-only">Next</span>
//                         <ArrowLeft className="h-5 w-5 transform rotate-180" />
//                       </button>
//                     </nav>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllUsers;
// import React, { useEffect, useState } from 'react';
// import { Filter, Plus, Calendar, Eye, Trash2 } from 'lucide-react';
// import { getAllUsers } from '../../api/apiMethods';

// interface Address {
//   area: string;
//   pincode: string;
// }

// interface User {
//   id: number;
//   userName: string;
//   contactNo: string;
//   signupDate: string;
//   address: Address;
//   avatar: string;
//   username: string;
//   phoneNumber: string;
//   areaName: string;
//   city: string;
//   pincode: string;
// }

// interface UsersProps {
//   onAddUser?: () => void;
// }

// const Users: React.FC<UsersProps> = ({ onAddUser }) => {
//   const [showFilter, setShowFilter] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(8);
//   const [allUsers, setAllUsers] = useState<User[]>([]);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     userName: '',
//     contactNo: '',
//     fromDate: '',
//     toDate: ''
//   });

//   const fetchAllUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await getAllUsers();
//       if (response?.users) {
//         setAllUsers(response.users);
//         setTotalUsers(response.users.length);
//       } else {
//         setError('Invalid response format');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to fetch users');
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentUsers = allUsers.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(allUsers.length / itemsPerPage);

//   const handleFilterChange = (field: string, value: string) => {
//     setFilters(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleFilterSubmit = () => {
//     console.log('Applying filters:', filters);
//     setShowFilter(false);
//   };

//   const handleView = (id: number) => {
//     console.log('View user:', id);
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       console.log('Delete user:', id);
//     }
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
//           <div className="flex flex-wrap items-center gap-2">
//             <button 
//               onClick={() => setShowFilter(!showFilter)}
//               className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               Filter
//             </button>
//             <button 
//               onClick={onAddUser}
//               className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Filter Panel */}
//         {showFilter && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 animate-in slide-in-from-top duration-300">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
//                 <select
//                   value={filters.userName}
//                   onChange={(e) => handleFilterChange('userName', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select user name</option>
//                   {allUsers.map(user => (
//                     <option key={user.id} value={user.username}>
//                       {user.username}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
//                 <select
//                   value={filters.contactNo}
//                   onChange={(e) => handleFilterChange('contactNo', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select Mobile no</option>
//                   {allUsers.map(user => (
//                     <option key={user.id} value={user.phoneNumber}>
//                       {user.phoneNumber}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={filters.fromDate}
//                     onChange={(e) => handleFilterChange('fromDate', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                   <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={filters.toDate}
//                     onChange={(e) => handleFilterChange('toDate', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                   <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex justify-center">
//               <button
//                 onClick={handleFilterSubmit}
//                 className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <div className="flex items-center gap-2">
//                 <label className="text-sm font-medium text-gray-700">Show</label>
//                 <select
//                   value={itemsPerPage}
//                   onChange={handleItemsPerPageChange}
//                   className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 >
//                   <option value={8}>8</option>
//                   <option value={12}>12</option>
//                   <option value={16}>16</option>
//                 </select>
//                 <span className="text-sm text-gray-700">entries</span>
//               </div>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile No</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-8 text-center">
//                       <div className="flex justify-center items-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-8 text-center text-red-500">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : currentUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
//                       No users found
//                     </td>
//                   </tr>
//                 ) : (
//                   currentUsers.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <img 
//                             src={user.avatar || '/default-avatar.png'} 
//                             alt={user.username}
//                             className="h-10 w-10 rounded-full object-cover mr-3 shadow-sm"
//                           />
//                           <span className="text-sm font-medium text-gray-900">{user.username}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phoneNumber}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.signupDate || '-'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {user.areaName}, {user.city}, {user.pincode}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center space-x-2">
//                           <button 
//                             onClick={() => handleView(user.id)}
//                             className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
//                             title="View"
//                           >
//                             <Eye className="h-4 w-4" />
//                           </button>
//                           <button 
//                             onClick={() => handleDelete(user.id)}
//                             className="text-red-600 hover:text-red-800 transition-colors duration-150"
//                             title="Delete"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="text-sm text-gray-700">
//               Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
//               <span className="font-medium">{Math.min(indexOfLastItem, allUsers.length)}</span> of{' '}
//               <span className="font-medium">{allUsers.length}</span> results
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-1 rounded-md ${
//                   currentPage === 1
//                     ? 'bg-gray-200 cursor-not-allowed text-gray-500'
//                     : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
//                 }`}
//               >
//                 Previous
//               </button>
              
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-3 py-1 rounded-md ${
//                     currentPage === page
//                       ? 'bg-blue-500 text-white'
//                       : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
              
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-3 py-1 rounded-md ${
//                   currentPage === totalPages
//                     ? 'bg-gray-200 cursor-not-allowed text-gray-500'
//                     : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Users;



























// import React, { useEffect, useState } from 'react';
// import { Filter, Plus, Calendar, Edit, Trash2, Eye } from 'lucide-react';
// import { getAllUsers } from '../../api/apiMethods';

// interface Address {
//   area: string;
//   pincode: string;
// }

// interface User {
//   id: number;
//   userName: string;
//   contactNo: string;
//   signupDate: string;
//   address: Address;
//   avatar: string;
// }

// interface UsersProps {
//   onAddUser?: () => void;
// }

// const Users: React.FC<UsersProps> = ({ onAddUser }) => {
//   const [showFilter, setShowFilter] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(8);
//   const [allUsers, setAllUsers] = useState([]);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [error, setError] = useState("");
//   const [filters, setFilters] = useState({
//     userName: '',
//     contactNo: '',
//     fromDate: '',
//     toDate: ''
//   });

//   const fetchAllUsers = async ()=>{
//     try{
//       const response = await getAllUsers();
//       if (response?.users) {
//         setAllUsers(response.users);
//       } else {
//         setError('Invalid response format');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to fetch users');
//     }
//   }
//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

// //   const fetchAllUsers = async () => {
// //   try {
// //     const offset = (currentPage - 1) * itemsPerPage;
// //     const response = await getAllUsers(offset, itemsPerPage);

// //     if (response?.users) {
// //       setAllUsers(response.users);
// //       setTotalUsers(response.data.totalCount); 
// //     } else {
// //       setError("Invalid response format");
// //     }
// //   } catch (err: any) {
// //     setError(err?.message || "Failed to fetch users");
// //   }
// // };
// // useEffect(() => {
// //   fetchAllUsers();
// // }, [currentPage, itemsPerPage]);

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   // const currentUsers = allUsers.slice(indexOfFirstItem, indexOfLastItem);
//   // const totalPages = Math.ceil(allUsers.length / itemsPerPage);
//   const totalPages = Math.ceil(totalUsers / itemsPerPage);

//   const handleFilterChange = (field: string, value: string) => {
//     setFilters(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleFilterSubmit = () => {
//     console.log('Applying filters:', filters);
//     setShowFilter(false);
//   };

//   const handleView = (id: number) => {
//     console.log('View user:', id);
//   };

//   const handleEdit = (id: number) => {
//     console.log('Edit user:', id);
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       console.log('Delete user:', id);
//     }
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
//           <div className="flex flex-wrap items-center gap-2">
//             <button 
//               onClick={() => setShowFilter(!showFilter)}
//               className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               Filter
//             </button>
//             <button 
//               onClick={onAddUser}
//               className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Filter Panel */}
//         {showFilter && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 animate-in slide-in-from-top duration-300">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
//                 <select
//                   value={filters.userName}
//                   onChange={(e) => handleFilterChange('userName', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                 >
//                   <option value="">Select user name</option>
//                   {allUsers.map(user => (
//                     <option key={user.id} value={user.username}>
//                       {user.username}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
//                 <select
//                   value={filters.contactNo}
//                   onChange={(e) => handleFilterChange('contactNo', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                 >
//                   <option value="">Select Mobile no</option>
//                   {allUsers.map(user => (
//                     <option key={user.id} value={user.phoneNumber}>
//                       {user.phoneNumber}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={filters.fromDate}
//                     onChange={(e) => handleFilterChange('fromDate', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                   />
//                   <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={filters.toDate}
//                     onChange={(e) => handleFilterChange('toDate', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                   />
//                   <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex justify-center">
//               <button
//                 onClick={handleFilterSubmit}
//                 className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors duration-200"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         )}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className=" w-full">
//               <thead className=" bg-gray-50 text-left">
//                 <tr>
//                   {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th> */}
//                   <th className="px-6 py-3 ">Username</th>
//                   <th className="px-6 py-3 ">Mobile No</th>
//                   <th className="px-6 py-3 ">Join Date</th>
//                   <th className="px-6 py-3 ">Address</th>
//                   <th className="px-6 py-3 ">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {allUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
//                     {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td> */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <img 
//                           src={user.avatar} 
//                           alt={user.username}
//                           className="h-10 w-10 rounded-full object-cover mr-3 shadow-sm"
//                         />
//                         <span className="text-sm font-medium text-gray-900">{user.username}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phoneNumber}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.signupDate}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {user.areaName}, {user.city}, {user.pincode}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center space-x-2">
//                         <button 
//                           onClick={() => handleView(user.id)}
//                           className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
//                           title="View"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </button>
//                         {/* <button 
//                           onClick={() => handleEdit(user.id)}
//                           className="text-green-600 hover:text-green-800 transition-colors duration-150"
//                           title="Edit"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button> */}
//                         <button 
//                           onClick={() => handleDelete(user.id)}
//                           className="text-red-600 hover:text-red-800 transition-colors duration-150"
//                           title="Delete"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="text-sm text-gray-700">
//               Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
//               <span className="font-medium">{Math.min(indexOfLastItem, allUsers.length)}</span> of{' '}
//               <span className="font-medium">{allUsers.length}</span> results
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-1 rounded-md ${
//                   currentPage === 1
//                     ? 'bg-gray-200 cursor-not-allowed'
//                     : 'bg-white border border-gray-300 hover:bg-gray-100'
//                 }`}
//               >
//                 Previous
//               </button>
              
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-3 py-1 rounded-md ${
//                     currentPage === page
//                       ? 'bg-blue-500 text-white'
//                       : 'bg-white border border-gray-300 hover:bg-gray-100'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
              
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-3 py-1 rounded-md ${
//                   currentPage === totalPages
//                     ? 'bg-gray-200 cursor-not-allowed'
//                     : 'bg-white border border-gray-300 hover:bg-gray-100'
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Users;