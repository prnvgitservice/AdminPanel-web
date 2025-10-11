import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, Clock, ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react'; // Assuming Lucide React icons are installed

// Interfaces based on provided data structure
interface CategoryService {
  categoryServiceId: string;
  status: boolean;
  _id: string;
}

interface AuthorizedPerson {
  phone: string;
  photo: string;
  _id: string;
}

interface SubscriptionResult {
  subscriptionId: string;
  subscriptionName: string;
  startDate: string;
  endDate: string | null;
  leads: number;
  ordersCount: number;
}

interface Technician {
  id: string;
  franchiseId: string | null;
  userId: string;
  username: string;
  phoneNumber: string;
  role: string;
  category: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  description: string;
  service: string;
  admin: boolean;
  profileImage: string;
  plan: string;
  categoryServices: CategoryService[];
  aadharFront: string;
  aadharBack: string;
  panCard: string;
  voterCard: string | null;
  authorizedPersons: AuthorizedPerson[];
  result: SubscriptionResult;
  franchiseAccount: any;
  status?: 'requested' | 'registered'; // Added for status management
}

// Fake data for 6 technicians
const fakeTechnicians: Technician[] = [
  {
    id: "68ea35d9ab5cb0d00167b05c",
    franchiseId: null,
    userId: "PRNV-MSG750",
    username: "tagoor",
    phoneNumber: "9876554321",
    role: "technician",
    category: "6864fbee0fdacf74e69ddd8c",
    buildingName: "shanumaka sri boy hostal",
    areaName: "Mamidipalli",
    subAreaName: "Barkas",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500005",
    description: "5",
    service: "",
    admin: true,
    profileImage: "https://res.cloudinary.com/dkfjl3blf/image/upload/v1760179673/TechProfiles/sz7yhmuwzxj4j4ogmmt9.png",
    plan: "687f6d135322bd37218596a7",
    categoryServices: [
      {
        "categoryServiceId": "68b58cc278943ed7dc11b995",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b05d"
      },
      {
        "categoryServiceId": "68b58d3478943ed7dc11ca43",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b05e"
      },
      {
        "categoryServiceId": "68b58da078943ed7dc11db17",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b05f"
      },
      {
        "categoryServiceId": "68b5919a78943ed7dc122e8b",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b060"
      },
      {
        "categoryServiceId": "68b67b965f3c31039eff98de",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b061"
      },
      {
        "categoryServiceId": "68b67bd75f3c31039eff98e2",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b062"
      },
      {
        "categoryServiceId": "68b67ca55f3c31039effcad5",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b063"
      },
      {
        "categoryServiceId": "68b67d695f3c31039effe3f8",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b064"
      },
      {
        "categoryServiceId": "68b67de45f3c31039e001614",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b065"
      },
      {
        "categoryServiceId": "68b67e3a5f3c31039e0026d1",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b066"
      },
      {
        "categoryServiceId": "68b67e9a5f3c31039e0026d5",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b067"
      },
      {
        "categoryServiceId": "68b67ee55f3c31039e0071c1",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b068"
      },
      {
        "categoryServiceId": "68b67f455f3c31039e008ab8",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b069"
      },
      {
        "categoryServiceId": "68b67ff65f3c31039e009b6d",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b06a"
      }
    ],
    aadharFront: "https://res.cloudinary.com/dkfjl3blf/image/upload/v1760179674/TechProofs/AadharFront/w756dm946pwcevbn6afc.png",
    aadharBack: "https://res.cloudinary.com/dkfjl3blf/image/upload/v1760179674/TechProofs/AadharBack/imzzapxpyn04vmmthzlk.png",
    panCard: "https://res.cloudinary.com/dkfjl3blf/image/upload/v1760179675/TechProofs/PanCard/vajdu7ph8vgevppmjgo9.png",
    voterCard: null,
    authorizedPersons: [
      {
        "phone": "8754219630",
        "photo": "https://res.cloudinary.com/dkfjl3blf/image/upload/v1760179676/TechProofs/AuthorizedPersons/o9c3x4ip3jd5bx6bl6km.png",
        "_id": "68ea35ddab5cb0d00167b06b"
      },
      {
        "phone": "3216549870",
        "photo": "https://res.cloudinary.com/dkfjl3blf/image/upload/v1760179677/TechProofs/AuthorizedPersons/xvfll92rhnjpf3c4bto2.png",
        "_id": "68ea35deab5cb0d00167b06c"
      }
    ],
    result: {
      "subscriptionId": "687f6d135322bd37218596a7",
      "subscriptionName": "Economy Plan",
      "startDate": "2025-10-11T10:47:59.294Z",
      "endDate": null,
      "leads": 100,
      "ordersCount": 0
    },
    franchiseAccount: null,
    status: 'requested'
  },
  {
    id: "68ea35d9ab5cb0d00167b05d",
    franchiseId: null,
    userId: "PRNV-MSG751",
    username: "john_doe",
    phoneNumber: "9876554322",
    role: "technician",
    category: "6864fbee0fdacf74e69ddd8c",
    buildingName: "Tech Hub Building",
    areaName: "Downtown",
    subAreaName: "Central",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    description: "Experienced plumber",
    service: "Plumbing",
    admin: false,
    profileImage: "https://i.pravatar.cc/150?img=1",
    plan: "687f6d135322bd37218596a8",
    categoryServices: [
      {
        "categoryServiceId": "68b58cc278943ed7dc11b995",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b05d"
      },
      {
        "categoryServiceId": "68b58d3478943ed7dc11ca43",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b05e"
      }
    ],
    aadharFront: "https://via.placeholder.com/300x200?text=Aadhar+Front",
    aadharBack: "https://via.placeholder.com/300x200?text=Aadhar+Back",
    panCard: "https://via.placeholder.com/300x200?text=PAN+Card",
    voterCard: null,
    authorizedPersons: [
      {
        "phone": "8754219631",
        "photo": "https://via.placeholder.com/150?text=Auth1",
        "_id": "68ea35ddab5cb0d00167b06b"
      }
    ],
    result: {
      "subscriptionId": "687f6d135322bd37218596a8",
      "subscriptionName": "Premium Plan",
      "startDate": "2025-09-15T10:00:00.000Z",
      "endDate": null,
      "leads": 200,
      "ordersCount": 5
    },
    franchiseAccount: null,
    status: 'registered'
  },
  {
    id: "68ea35d9ab5cb0d00167b05e",
    franchiseId: null,
    userId: "PRNV-MSG752",
    username: "jane_smith",
    phoneNumber: "9876554323",
    role: "technician",
    category: "6864fbee0fdacf74e69ddd8d",
    buildingName: "Green Valley Apt",
    areaName: "Suburbia",
    subAreaName: "West End",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    description: "Electrician specialist",
    service: "Electrical",
    admin: true,
    profileImage: "https://i.pravatar.cc/150?img=2",
    plan: "687f6d135322bd37218596a7",
    categoryServices: [
      {
        "categoryServiceId": "68b67b965f3c31039eff98de",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b061"
      },
      {
        "categoryServiceId": "68b67bd75f3c31039eff98e2",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b062"
      },
      {
        "categoryServiceId": "68b67ca55f3c31039effcad5",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b063"
      }
    ],
    aadharFront: "https://via.placeholder.com/300x200?text=Aadhar+Front+2",
    aadharBack: "https://via.placeholder.com/300x200?text=Aadhar+Back+2",
    panCard: "https://via.placeholder.com/300x200?text=PAN+Card+2",
    voterCard: "https://via.placeholder.com/300x200?text=Voter+Card",
    authorizedPersons: [],
    result: {
      "subscriptionId": "687f6d135322bd37218596a7",
      "subscriptionName": "Economy Plan",
      "startDate": "2025-10-10T14:30:00.000Z",
      "endDate": null,
      "leads": 150,
      "ordersCount": 2
    },
    franchiseAccount: null,
    status: 'requested'
  },
  {
    id: "68ea35d9ab5cb0d00167b05f",
    franchiseId: null,
    userId: "PRNV-MSG753",
    username: "mike_johnson",
    phoneNumber: "9876554324",
    role: "technician",
    category: "6864fbee0fdacf74e69ddd8c",
    buildingName: "City Towers",
    areaName: "Uptown",
    subAreaName: "East Side",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    description: "AC repair expert",
    service: "AC Repair",
    admin: false,
    profileImage: "https://i.pravatar.cc/150?img=3",
    plan: "687f6d135322bd37218596a9",
    categoryServices: [
      {
        "categoryServiceId": "68b58da078943ed7dc11db17",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b05f"
      },
      {
        "categoryServiceId": "68b5919a78943ed7dc122e8b",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b060"
      }
    ],
    aadharFront: "https://via.placeholder.com/300x200?text=Aadhar+Front+3",
    aadharBack: null,
    panCard: "https://via.placeholder.com/300x200?text=PAN+Card+3",
    voterCard: null,
    authorizedPersons: [
      {
        "phone": "8754219632",
        "photo": "https://via.placeholder.com/150?text=Auth2",
        "_id": "68ea35ddab5cb0d00167b06c"
      },
      {
        "phone": "3216549871",
        "photo": "https://via.placeholder.com/150?text=Auth3",
        "_id": "68ea35deab5cb0d00167b06d"
      }
    ],
    result: {
      "subscriptionId": "687f6d135322bd37218596a9",
      "subscriptionName": "Basic Plan",
      "startDate": "2025-08-20T09:00:00.000Z",
      "endDate": null,
      "leads": 50,
      "ordersCount": 10
    },
    franchiseAccount: null,
    status: 'registered'
  },
  {
    id: "68ea35d9ab5cb0d00167b060",
    franchiseId: null,
    userId: "PRNV-MSG754",
    username: "sarah_wilson",
    phoneNumber: "9876554325",
    role: "technician",
    category: "6864fbee0fdacf74e69ddd8e",
    buildingName: "River Side Villa",
    areaName: "Riverside",
    subAreaName: "North Bank",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    description: "Painter and decorator",
    service: "Painting",
    admin: true,
    profileImage: "https://i.pravatar.cc/150?img=4",
    plan: "687f6d135322bd37218596a7",
    categoryServices: [
      {
        "categoryServiceId": "68b67de45f3c31039e001614",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b065"
      }
    ],
    aadharFront: "https://via.placeholder.com/300x200?text=Aadhar+Front+4",
    aadharBack: "https://via.placeholder.com/300x200?text=Aadhar+Back+4",
    panCard: null,
    voterCard: "https://via.placeholder.com/300x200?text=Voter+Card+2",
    authorizedPersons: [
      {
        "phone": "8754219633",
        "photo": "https://via.placeholder.com/150?text=Auth4",
        "_id": "68ea35ddab5cb0d00167b06e"
      }
    ],
    result: {
      "subscriptionId": "687f6d135322bd37218596a7",
      "subscriptionName": "Economy Plan",
      "startDate": "2025-10-11T12:00:00.000Z",
      "endDate": null,
      "leads": 80,
      "ordersCount": 0
    },
    franchiseAccount: null,
    status: 'requested'
  },
  {
    id: "68ea35d9ab5cb0d00167b061",
    franchiseId: null,
    userId: "PRNV-MSG755",
    username: "david_brown",
    phoneNumber: "9876554326",
    role: "technician",
    category: "6864fbee0fdacf74e69ddd8c",
    buildingName: "Mountain View Complex",
    areaName: "Hillside",
    subAreaName: "Peak",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    description: "Carpenter",
    service: "Carpentry",
    admin: false,
    profileImage: "https://i.pravatar.cc/150?img=5",
    plan: "687f6d135322bd37218596a8",
    categoryServices: [
      {
        "categoryServiceId": "68b67e3a5f3c31039e0026d1",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b066"
      },
      {
        "categoryServiceId": "68b67e9a5f3c31039e0026d5",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b067"
      },
      {
        "categoryServiceId": "68b67ee55f3c31039e0071c1",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b068"
      },
      {
        "categoryServiceId": "68b67f455f3c31039e008ab8",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b069"
      }
    ],
    aadharFront: "https://via.placeholder.com/300x200?text=Aadhar+Front+5",
    aadharBack: "https://via.placeholder.com/300x200?text=Aadhar+Back+5",
    panCard: "https://via.placeholder.com/300x200?text=PAN+Card+5",
    voterCard: null,
    authorizedPersons: [],
    result: {
      "subscriptionId": "687f6d135322bd37218596a8",
      "subscriptionName": "Premium Plan",
      "startDate": "2025-10-05T16:45:00.000Z",
      "endDate": null,
      "leads": 120,
      "ordersCount": 3
    },
    franchiseAccount: null,
    status: 'registered'
  },
  {
    id: "68ea35d9ab5cb0d00167b05f",
    franchiseId: null,
    userId: "PRNV-MSG753",
    username: "mike_johnson",
    phoneNumber: "9876554324",
    role: "technician",
    category: "6864fbee0fdacf74e69ddd8c",
    buildingName: "City Towers",
    areaName: "Uptown",
    subAreaName: "East Side",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    description: "AC repair expert",
    service: "AC Repair",
    admin: false,
    profileImage: "https://i.pravatar.cc/150?img=3",
    plan: "687f6d135322bd37218596a9",
    categoryServices: [
      {
        "categoryServiceId": "68b58da078943ed7dc11db17",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b05f"
      },
      {
        "categoryServiceId": "68b5919a78943ed7dc122e8b",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b060"
      }
    ],
    aadharFront: "https://via.placeholder.com/300x200?text=Aadhar+Front+3",
    aadharBack: null,
    panCard: "https://via.placeholder.com/300x200?text=PAN+Card+3",
    voterCard: null,
    authorizedPersons: [
      {
        "phone": "8754219632",
        "photo": "https://via.placeholder.com/150?text=Auth2",
        "_id": "68ea35ddab5cb0d00167b06c"
      },
      {
        "phone": "3216549871",
        "photo": "https://via.placeholder.com/150?text=Auth3",
        "_id": "68ea35deab5cb0d00167b06d"
      }
    ],
    result: {
      "subscriptionId": "687f6d135322bd37218596a9",
      "subscriptionName": "Basic Plan",
      "startDate": "2025-08-20T09:00:00.000Z",
      "endDate": null,
      "leads": 50,
      "ordersCount": 10
    },
    franchiseAccount: null,
    status: 'registered'
  },
  {
    id: "68ea35d9ab5cb0d00167b060",
    franchiseId: null,
    userId: "PRNV-MSG754",
    username: "sarah_wilson",
    phoneNumber: "9876554325",
    role: "technician",
    category: "6864fbee0fdacf74e69ddd8e",
    buildingName: "River Side Villa",
    areaName: "Riverside",
    subAreaName: "North Bank",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    description: "Painter and decorator",
    service: "Painting",
    admin: true,
    profileImage: "https://i.pravatar.cc/150?img=4",
    plan: "687f6d135322bd37218596a7",
    categoryServices: [
      {
        "categoryServiceId": "68b67de45f3c31039e001614",
        "status": true,
        "_id": "68ea35d9ab5cb0d00167b065"
      }
    ],
    aadharFront: "https://via.placeholder.com/300x200?text=Aadhar+Front+4",
    aadharBack: "https://via.placeholder.com/300x200?text=Aadhar+Back+4",
    panCard: null,
    voterCard: "https://via.placeholder.com/300x200?text=Voter+Card+2",
    authorizedPersons: [
      {
        "phone": "8754219633",
        "photo": "https://via.placeholder.com/150?text=Auth4",
        "_id": "68ea35ddab5cb0d00167b06e"
      }
    ],
    result: {
      "subscriptionId": "687f6d135322bd37218596a7",
      "subscriptionName": "Economy Plan",
      "startDate": "2025-10-11T12:00:00.000Z",
      "endDate": null,
      "leads": 80,
      "ordersCount": 0
    },
    franchiseAccount: null,
    status: 'requested'
  },
];

// Modal Component for View Details
const TechnicianDetailsModal: React.FC<{ technician: Technician; isOpen: boolean; onClose: () => void }> = ({
  technician,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Technician Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <img src={technician.profileImage} alt={technician.username} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-200" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{technician.username}</h3>
                <p className="text-gray-600">ID: {technician.userId}</p>
                <p className="text-gray-600">Phone: {technician.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-gray-800">{technician.buildingName}, {technician.areaName}, {technician.subAreaName}</p>
                <p className="text-gray-600">{technician.city}, {technician.state} - {technician.pincode}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-gray-800">{technician.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Services ({technician.categoryServices.length})</p>
                <ul className="text-gray-600 space-y-1">
                  {technician.categoryServices.slice(0, 5).map((svc, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Service ID: {svc.categoryServiceId}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Subscription: {technician.result.subscriptionName}</p>
                <p className="text-sm text-blue-600">Leads: {technician.result.leads} | Orders: {technician.result.ordersCount}</p>
              </div>
              {technician.authorizedPersons.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Authorized Persons</p>
                  <div className="space-y-2">
                    {technician.authorizedPersons.map((person, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <img src={person.photo} alt={`Authorized Person ${idx + 1}`} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                        <span className="text-gray-600 text-sm">Phone: {person.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-4">Documents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technician.aadharFront && <img src={technician.aadharFront} alt="Aadhar Front" className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm" />}
              {technician.aadharBack && <img src={technician.aadharBack} alt="Aadhar Back" className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm" />}
              {technician.panCard && <img src={technician.panCard} alt="PAN Card" className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm" />}
              {technician.voterCard && <img src={technician.voterCard} alt="Voter Card" className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechnicianRequest: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>(fakeTechnicians);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'requested' | 'registered'>('all');
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState<number>(6);
  const [offset, setOffset] = useState<number>(0);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let filtered = [...technicians];

    if (searchTerm) {
      filtered = filtered.filter(
        (tech) =>
          tech.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tech.phoneNumber.includes(searchTerm)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((tech) => (tech.status || 'requested') === selectedStatus);
    }

    setFilteredTechnicians(filtered);
    setCurrentPage(1);
    setOffset(0);
  }, [searchTerm, selectedStatus, technicians]);

  useEffect(() => {
    setOffset((currentPage - 1) * limit);
    setCurrentPage(1);
  }, [limit]);

  useEffect(() => {
    setOffset((currentPage - 1) * limit);
  }, [currentPage]);

  const totalItems = filteredTechnicians.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paginatedTechnicians = filteredTechnicians.slice(offset, offset + limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusUpdate = async (id: string) => {
    setLoadingIds((prev) => new Set([...prev, id]));
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update local state
      setTechnicians((prev) =>
        prev.map((tech) => (tech.id === id ? { ...tech, status: 'registered' } : tech))
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'requested':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const renderPageButtons = () => {
    const pages: number[] = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages.map((page) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          page === currentPage
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        }`}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Technician Requests</h1>
          <p className="text-gray-600 mt-2">Manage and approve technician registrations.</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by username or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="requested">Requested</option>
              <option value="registered">Registered</option>
            </select>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={6}>6 per page</option>
              <option value={12}>12 per page</option>
              <option value={60}>60 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* Active Technicians Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedTechnicians.map((technician) => {
            const status = technician.status || 'requested';
            return (
              <div
                key={technician.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={technician.profileImage}
                        alt={technician.username}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{technician.username}</h3>
                        <p className="text-sm text-gray-600">{technician.phoneNumber}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-800">{technician.areaName}, {technician.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-800">{technician.result.subscriptionName}</span>
                    </div>
                    <div className="text-sm text-gray-600">Services: {technician.categoryServices.length}</div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedTechnician(technician);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {status === 'requested' && (
                      <button
                        onClick={() => handleStatusUpdate(technician.id)}
                        disabled={loadingIds.has(technician.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
                      >
                        {loadingIds.has(technician.id) ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span>Showing {offset + 1} to {Math.min(offset + limit, totalItems)} of {totalItems} results</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
              >
                <ChevronsLeft className="w-4 h-4" />
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              {renderPageButtons()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
              >
                Last
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {paginatedTechnicians.length === 0 && totalItems === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No technicians found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {paginatedTechnicians.length === 0 && totalItems > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No technicians on this page.</p>
          </div>
        )}

        {/* Modal */}
        {selectedTechnician && (
          <TechnicianDetailsModal
            technician={selectedTechnician}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TechnicianRequest;