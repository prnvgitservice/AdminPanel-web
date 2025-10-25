import React, { useEffect, useState } from 'react';
import {
  Check,
  X,
  Star,
  Crown,
  Zap,
  Shield,
  BadgeIndianRupee,
  LucideIcon,
  Cross,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdClear } from 'react-icons/md';
import { getPlans, deletePlan } from '../../api/apiMethods';

const iconMap: { [key: string]: LucideIcon } = {
  Star,
  Crown,
  Zap,
  Shield,
};

interface PlanFeature {
  name: string;
  included: boolean;
}

interface FullFeature {
  text: string;
}

export interface Plan {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  gst: number;
  finalPrice: number;
  validity: number;
  validityUnit: string;
  icon: string;
  color: string;
  features: PlanFeature[];
  fullFeatures: FullFeature[];
  discount?: number;
  isPopular?: boolean;
  buttonColor: string;
  leads?: number; // Added for validity handling
}

const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track which plan is being deleted

  const fetchPlans = async () => {
    try {
      const response = await getPlans();
      if (response) {
        setPlans(response?.data);
      } else {
        setError('Invalid response format');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch categories');
      console.log(err, "==>err");
    }
  };
  
  useEffect(() => {
    fetchPlans();
  }, []);

  const handleFullDetails = (plan: Plan): void => {
    const originalGst = plan.originalPrice ? Math.round(plan.originalPrice * 0.18) : 0;
    navigate(`/subscription/${plan._id}`, { 
      state: { plan, originalGst } 
    });
  };

  const handleEdit = (plan: Plan): void => {
    // const originalGst = plan.originalPrice ? Math.round(plan.originalPrice * 0.18) : 0;
    navigate(`/subscription/edit/${plan._id}`, { 
      state: plan
    });
  };

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(planId);
    try {
      await deletePlan(planId);
      // Refetch plans after successful deletion
      await fetchPlans();
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete plan');
      console.log(err, "==> delete error");
    } finally {
      setIsDeleting(null);
    }
  };

  interface PlanConfig {
    gradient: string;       
    icon: React.ComponentType<any>;      
    button: string;         
  }

  const PLAN_CONFIG: Record<string, PlanConfig> = {
    "Economy Plan": {
      gradient: "from-blue-500 to-blue-600",
      icon: Zap,
      button: "bg-blue-600 hover:bg-blue-700",
    },
    "Gold Plan": {
      gradient: "from-yellow-400 to-yellow-600",
      icon: Star,
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
    "Platinum Plan": {
      gradient: "from-purple-500 to-purple-700",
      icon: Crown,
      button: "bg-purple-600 hover:bg-purple-700",
    },
    "Free Plan": {
      gradient: "from-green-400 to-green-600",
      icon: Shield,
      button: "bg-green-500 hover:bg-green-700",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Technician Subscription Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3 leading-relaxed">
            Choose the right plan to grow your technical service business and reach more customers.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* <div className="grid place-items-center"> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* <div className='flex justify-center items-stretch flex-wrap gap-9 w-full'> */}
          {plans.map((plan: Plan) => {
              const config = PLAN_CONFIG[plan.name] || {
                gradient: "from-gray-400 to-gray-600",
                icon: Star,
                button: "bg-gray-500 hover:bg-gray-600",
              };
              const IconComponent = config?.icon;
              const isCurrentDeleting = isDeleting === plan._id;

              return (
                <div
                  key={plan._id}
                  className={`relative flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border 
                    ${selectedPlan === plan._id ? 'ring-2 ring-blue-500' : ''} 
                    ${plan.isPopular ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-200'}`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  {Number(plan.discount) > 0 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        {plan?.discount}% OFF
                      </div>
                    </div>
                  )}

                  <div className="p-6 pb-6 flex flex-col h-full">
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${config?.gradient} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                        <IconComponent className="text-white" size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{plan?.name}</h3>

                      <div className="mt-2">
                        <div className="text-2xl font-extrabold text-gray-900">₹ {plan?.price}</div>
                        {Number(plan.originalPrice) > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            ₹{plan.originalPrice} + (GST 18%)
                          </div>
                        )}
                        {Number(plan.price) > 0 && (
                        <div className="text-sm text-gray-600">
                          ₹{plan.price} + ₹{plan.gst} (GST 18%)
                        </div>
                        )}
                      </div>

                      <div className="mt-3 text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
                        Valid until {plan?.validity === null ? plan.leads : plan.validity} {plan?.validity === null ? "leads" : "days"}
                      </div>
                    </div>

                    <ul className="space-y-2 mb-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm text-gray-700">
                          {feature.included ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <X size={16} className="text-red-400" />
                          )}
                          {feature.name}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex gap-3">
                      <button
                        onClick={() => handleFullDetails(plan)}
                        className="flex-1 py-2 px-4 text-green-600 hover:text-green-700 font-medium transition duration-300 border border-green-300 hover:border-green-400 rounded-lg"
                      >
                        <Eye size={16} className="inline mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(plan)}
                        className="flex-1 py-2 px-4 text-blue-600 hover:text-blue-700 font-medium transition duration-300 border border-blue-300 hover:border-blue-400 rounded-lg"
                      >
                        <Edit size={16} className="inline mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan._id)}
                        disabled={isCurrentDeleting}
                        className="flex-1 py-2 px-4 text-red-600 hover:text-red-700 font-medium transition duration-300 border border-red-300 hover:border-red-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} className="inline mr-2" />
                        {isCurrentDeleting ? (
                          <>
                            <div className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2" />
                            Deleting...
                          </>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

// import React, { useEffect, useState } from 'react';
// import {
//   Check,
//   X,
//   Star,
//   Crown,
//   Zap,
//   Shield,
//   BadgeIndianRupee,
//   LucideIcon,
//   Cross,
// } from 'lucide-react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { MdClear } from 'react-icons/md';
// import { getPlans } from '../../api/apiMethods';

// const iconMap: { [key: string]: LucideIcon } = {
//   Star,
//   Crown,
//   Zap,
//   Shield,
// };

// interface PlanFeature {
//   name: string;
//   included: boolean;
// }

// interface FullFeature {
//   text: string;
// }

// export interface Plan {
//   _id: string;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   gst: number;
//   finalPrice: number;
//   validity: number;
//   validityUnit: string;
//   icon: string;
//   color: string;
//   features: PlanFeature[];
//   fullFeatures: FullFeature[];
//   discount?: number;
//   isPopular?: boolean;
//   buttonColor: string;
// }

// const SubscriptionPage: React.FC = () => {
//   const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPlans = async () => {
//     try {
//       const response = await getPlans();
//       if (response) {
//         setPlans(response?.data);
//       } else {
//         setError('Invalid response format');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to fetch categories');
//       console.log(err, "==>err");
//     }
//   };
  
//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const handleFullDetails = (plan: Plan): void => {
//     const originalGst = plan.originalPrice ? Math.round(plan.originalPrice * 0.18) : 0;
//     navigate(`/subscription/${plan._id}`, { 
//       state: { plan, originalGst } 
//     });
//   };

//   interface PlanConfig {
//     gradient: string;       
//     icon: React.ComponentType<any>;      
//     button: string;         
//   }

//   const PLAN_CONFIG: Record<string, PlanConfig> = {
//     "Economy Plan": {
//       gradient: "from-blue-500 to-blue-600",
//       icon: Zap,
//       button: "bg-blue-600 hover:bg-blue-700",
//     },
//     "Gold Plan": {
//       gradient: "from-yellow-400 to-yellow-600",
//       icon: Star,
//       button: "bg-yellow-500 hover:bg-yellow-600",
//     },
//     "Platinum Plan": {
//       gradient: "from-purple-500 to-purple-700",
//       icon: Crown,
//       button: "bg-purple-600 hover:bg-purple-700",
//     },
//     "Free Plan": {
//       gradient: "from-green-400 to-green-600",
//       icon: Shield,
//       button: "bg-green-500 hover:bg-green-700",
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="text-center mb-14">
//           <h1 className="text-4xl font-extrabold text-gray-800">
//             Technician Subscription Plans
//           </h1>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3 leading-relaxed">
//             Choose the right plan to grow your technical service business and reach more customers.
//           </p>
//         </div>

//         <div className="grid place-items-center">
//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> */}
//           {plans
//             .filter(plan => plan.name === "Economy Plan") 
//             .map((plan: Plan) => {
//               const config = PLAN_CONFIG[plan.name] || {
//                 gradient: "from-gray-400 to-gray-600",
//                 icon: Star,
//                 button: "bg-gray-500 hover:bg-gray-600",
//               };
//               const IconComponent = config?.icon;

//               return (
//                 <div
//                   key={plan._id}
//                   className={`relative flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border 
//                     ${selectedPlan === plan._id ? 'ring-2 ring-blue-500' : ''} 
//                     ${plan.isPopular ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-200'}`}
//                 >
//                   {plan.isPopular && (
//                     <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                       <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
//                         MOST POPULAR
//                       </div>
//                     </div>
//                   )}

//                   {Number(plan.discount) > 0 && (
//                     <div className="absolute -top-2 -right-2 z-10">
//                       <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
//                         {plan?.discount}% OFF
//                       </div>
//                     </div>
//                   )}

//                   <div className="p-6 pb-6 flex flex-col h-full">
//                     <div className="text-center mb-6">
//                       <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${config?.gradient} flex items-center justify-center mx-auto mb-4 shadow-md`}>
//                         <IconComponent className="text-white" size={28} />
//                       </div>
//                       <h3 className="text-xl font-bold text-gray-800">{plan?.name}</h3>

//                       <div className="mt-2">
//                         <div className="text-2xl font-extrabold text-gray-900">₹ {plan?.price}</div>
//                         {Number(plan.originalPrice) > 0 && (
//                           <div className="text-sm text-gray-500 line-through">
//                             ₹{plan.originalPrice} + (GST 18%)
//                           </div>
//                         )}
//                         {Number(plan.price) > 0 && (
//                         <div className="text-sm text-gray-600">
//                           ₹{plan.price} + ₹{plan.gst} (GST 18%)
//                         </div>
//                         )}
//                       </div>

//                       <div className="mt-3 text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
//                         Valid until {plan?.validity === null ? plan.leads : plan.validity} {plan?.validity === null ? "leads" : "days"}
//                       </div>
//                     </div>

//                     <ul className="space-y-2 mb-3">
//                       {plan.features.map((feature, index) => (
//                         <li key={index} className="flex items-center gap-3 text-sm text-gray-700">
//                           {feature.included ? (
//                             <Check size={16} className="text-green-500" />
//                           ) : (
//                             <X size={16} className="text-red-400" />
//                           )}
//                           {feature.name}
//                         </li>
//                       ))}
//                     </ul>

//                     <div className="mt-auto">
//                       <button
//                         onClick={() => handleFullDetails(plan)}
//                         className="w-full py-2 px-4 text-gray-600 hover:text-blue-600 font-medium transition duration-300 text-green-600"
//                       >
//                         View Full Details →
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionPage;