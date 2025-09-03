import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Camera, Eye, EyeOff } from 'lucide-react';

interface FormData {
  username: string;
  email: string;
  profileImage: File | null;
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
}

interface Errors {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  repeatPassword?: string;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'password'>('settings');
  const [formData, setFormData] = useState<FormData>({
    username: 'admin',
    email: 'prnvservices@gmail.com',
    profileImage: null,
    currentPassword: '',
    newPassword: '',
    repeatPassword: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    repeat: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new' | 'repeat') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (activeTab === 'settings') {
      if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'New password must be at least 8 characters';
      }
      if (formData.newPassword !== formData.repeatPassword) {
        newErrors.repeatPassword = 'Passwords do not match';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Add API call or further processing here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile Settings</h1>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 text-sm font-semibold transition-all duration-300 ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-3 text-sm font-semibold transition-all duration-300 ${
                activeTab === 'password'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
             Change Password
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium">
                        Change Picture
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.currentPassword ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repeat Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.repeat ? 'text' : 'password'}
                      name="repeatPassword"
                      value={formData.repeatPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.repeatPassword ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('repeat')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.repeat ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.repeatPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.repeatPassword}</p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
// import React, { useState } from 'react';
// import { Camera, Eye } from 'lucide-react';

// const Profile: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('settings');

//   return (
//     <div className="min-h-screen bg-gray-50">


//       {/* Content */}
//       <div className="max-w-4xl mx-auto p-6">
//       <h1 className='text-2xl font-bold py-2'>Profile</h1>

//         {/* Tab Navigation */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('settings')}
//               className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
//                 activeTab === 'settings'
//                 ? 'text-white bg-blue-600 rounded-tl-lg'
//                 : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
//               }`}
//               >
//               Profile Settings
//             </button>
//             <button
//               onClick={() => setActiveTab('password')}
//               className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
//                 activeTab === 'password'
//                 ? 'text-white bg-blue-600'
//                 : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
//               }`}
//               >
//               Change password
//             </button>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === 'settings' && (
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Username
//                   </label>
//                   <input
//                     type="text"
//                     defaultValue="admin"
//                     className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     readOnly
//                     />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email ID
//                   </label>
//                   <input
//                     type="email"
//                     defaultValue="prnvservices@gmail.com"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Profile Image
//                   </label>
//                   <div className="flex items-center space-x-4">
//                     <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
//                       <Camera className="h-6 w-6 text-gray-400" />
//                     </div>
//                     <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium">
//                       Change profile picture
//                     </button>
//                   </div>
//                 </div>

//                 <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium">
//                   Save
//                 </button>
//               </div>
//             )}

//             {activeTab === 'password' && (
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Current Password
//                     <span className="ml-1 text-gray-400">👁</span>
//                   </label>
//                   <input
//                     type="password"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Password
//                     <span className="ml-1 text-gray-400">👁</span>
//                   </label>
//                   <input
//                     type="password"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Repeat Password
//                     <span className="ml-1 text-gray-400">👁</span>
//                   </label>
//                   <input
//                     type="password"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     />
//                 </div>

//                 <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium">
//                   Save
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

{/* Header */}
{/* <div className="bg-blue-600 px-6 py-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold">P</span>
      </div>
      <h1 className="text-xl font-bold text-white">Profile</h1>
    </div>
    <div className="flex items-center space-x-2">
      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
        <Eye className="h-5 w-5 text-white" />
      </button>
      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-sm font-semibold">A</span>
        </div>
      </button>
    </div>
  </div>
</div> */}