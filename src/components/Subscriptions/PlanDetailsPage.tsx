import { useLocation, useNavigate } from "react-router-dom";
import { Plan } from "./SubscriptionPage";
import { ArrowLeftIcon, Info} from "lucide-react";

const PlanDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const subscription: Plan | undefined = state?.plan;

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Plan Not Found
          </h1>
          <button
            onClick={() => navigate("/plans")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex justify-center items-center gap-2">
            <Info className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md text-white w-10 h-10" size={20}/>
            <h1 className="text-2xl font-bold text-gray-900">Plan Details</h1>
           </div>
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="ml-1">Back</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Basic Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID
              </label>
              <p className="text-gray-900">{subscription._id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <p className="text-gray-900 font-medium">{subscription.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Is Popular
              </label>
              <p
                className={`text-gray-900 ${
                  subscription.isPopular ? "text-green-600" : "text-red-600"
                }`}
              >
                {subscription.isPopular ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Is Active
              </label>
              <p
                className={`text-gray-900 ${
                  subscription.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {subscription.isActive ? "Yes" : "No"}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created At
              </label>
              <p className="text-gray-900">
                {new Date(subscription?.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Updated At
              </label>
              <p className="text-gray-900">
                {new Date(subscription?.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
            Pricing Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price
              </label>
              <p className="text-gray-900">₹{subscription.originalPrice}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount
              </label>
              <p className="text-gray-900">{subscription.discount}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage
              </label>
              <p className="text-gray-900">
                {subscription.discountPercentage}%
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (After Discount)
              </label>
              <p className="text-gray-900 font-medium">₹{subscription.price}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Percentage
              </label>
              <p className="text-gray-900">{subscription.gstPercentage}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Amount
              </label>
              <p className="text-gray-900">₹{subscription.gst}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Final Price
              </label>
              <p className="text-gray-900 font-semibold">
                ₹{subscription.finalPrice}
              </p>
            </div>
            {subscription.commisionAmount !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Amount
                </label>
                <p className="text-gray-900">₹{subscription.commisionAmount}</p>
              </div>
            )}
            {subscription.executiveCommissionAmount !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Executive Commission Amount
                </label>
                <p className="text-gray-900">
                  ₹{subscription.executiveCommissionAmount}
                </p>
              </div>
            )}
            {subscription.refExecutiveCommisionAmount !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ref Executive Commission Amount
                </label>
                <p className="text-gray-900">
                  ₹{subscription.refExecutiveCommisionAmount}
                </p>
              </div>
            )}
            {subscription.referalCommisionAmount !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Commission Amount
                </label>
                <p className="text-gray-900">
                  ₹{subscription.referalCommisionAmount}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Validity & Leads Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
            Validity & Leads
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validity (Days)
              </label>
              <p className="text-gray-900">{subscription.validity || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leads
              </label>
              <p className="text-gray-900">
                {subscription.leads || "Unlimited"}
              </p>
            </div>
            {subscription.endUpPrice && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Up Price
                </label>
                <p className="text-gray-900">₹{subscription.endUpPrice}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Features Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
              Features
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Included
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscription.features.map((feature, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {feature.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            feature.included
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {feature.included ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full Features Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
              Full Features Description
            </h2>
            <ul className="space-y-2 list-disc list-inside text-gray-700">
              {subscription.fullFeatures.map((feature, index) => (
                <li key={index} className="text-sm leading-relaxed">
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsPage;
// import { useLocation, useParams } from 'react-router-dom';
// import { Plan } from './SubscriptionPage';

// const PlanDetailsPage: React.FC = () => {
//   const { state } = useLocation();
//   const subscriptionId = useParams<{ subscriptionId: string }>();

//   //  const plan = plans.find((p) => p.id.toString() === subscriptionId);
//   const subscription: Plan | undefined = state?.plan;
//   //  const subscription = plan.find((p) => p?.id?.toString() === subscriptionId?.toString());

//   if (!subscription) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-xl font-semibold">
//         Plan not found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
//         <div className="text-center mb-3">
//            {/* <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${subscription?.color} flex items-center justify-center mx-auto mb-4 shadow-md`}>
//                       <iconMap[plan.icon] || Star className="text-white" size={28} />
//                     </div> */}
//           <h2 className="text-4xl font-bold text-gray-800 mb-2">{subscription.name}</h2>

//         </div>

//         <div className="mt-2 text-center mb-2">
//           <div className="text-3xl font-extrabold text-gray-900">₹ {subscription?.price}</div>
//           {/* {subscription.originalPrice && (
//             <div className="text-sm text-gray-500 line-through">
//               ₹{subscription.originalPrice} + ₹{subscription.gst} (GST 18%)
//             </div>
//           )} */}
//            {Number(subscription.originalPrice) > 0 && (
//                         <div className="text-sm text-gray-500 line-through">
//                           ₹{subscription.originalPrice} + (GST 18%)
//                         </div>
//                       )}
//                         {Number(subscription.finalPrice) > 0 && (
//           <div className="text-sm text-gray-600 ">
//             ₹{subscription.finalPrice} +  ₹{subscription.gst} (GST 18%)
//             {/* INCL 18% GST: ₹ {subscription.finalPrice} */}
//           </div>
//                         )}
//         </div>

//         {Number(subscription.discount) > 0 && (
//           <div className="text-center my-4">
//             <span className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
//               {subscription.discount} % OFF
//             </span>
//           </div>
//         )}
//         <div className='text-center'>
//           <p className=" text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">Valid until {subscription.validity} {subscription.validityUnit}</p>
//         </div>
//         {/* <div className="text-center mb-6">
//           {subscription.originalPrice && (
//             <p className="text-sm text-gray-500 line-through">{subscription.originalPrice}</p>
//           )}
//           <p className="text-sm text-gray-600 mt-1">{subscription.gst}</p>
//         </div> */}

//         <hr className="my-6 border-gray-200" />

//         <h2 className="text-xl font-semibold text-gray-800 mb-4">What's included:</h2>
//         <ul className="space-y-2 text-gray-700 list-disc list-inside">
//           {subscription.fullFeatures.map((feature, index) => (
//             <li key={index} className="leading-relaxed">{feature?.text}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default PlanDetailsPage;
