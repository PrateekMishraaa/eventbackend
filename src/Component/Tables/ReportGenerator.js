// import React from 'react';
// import { Building, Users, GraduationCap, ShieldAlert } from 'lucide-react';

// function ReportGenerator() {
//   // Sample data
//   const schoolData = {
//     udiseCode: "27180100101",
//     schoolName: "Government Primary School",
//     address: "Village Rampur, Block Sadar, District Mathura",
//     teacherName: "Mrs. Priya Sharma",
//     teacherContact: "+91 9876543210",
//     email: "gps.rampur@education.up.gov.in",
//     schoolType: "Primary School",
//     state: "Uttar Pradesh",
//     district: "Mathura",
//     students: {
//       total: { male: 85, female: 78 },
//       trained: { male: 65, female: 68 },
//       disabled: { male: 3, female: 2 }
//     },
//     teachers: {
//       total: { male: 2, female: 4 },
//       trained: { male: 2, female: 4 }
//     },
//     programLike: "Disaster Risk Reduction Program",
//     disasterManagement: {
//       rapidVisualSurvey: "Yes",
//       conductedDrills: "Yes",
//       disasterCommitteeFormed: "Yes",
//       resourceInventoryMaintained: "No",
//       evacuationPlan: "Yes",
//       disasterManagementPlan: "Yes"
//     }
//   };

//   const SkyImage = () => (
//     <div className="w-full h-24 bg-gradient-to-b from-sky-200 to-sky-300 rounded border border-gray-300 relative overflow-hidden">
//       <div className="absolute top-2 left-4 w-8 h-6 bg-white rounded-full opacity-80"></div>
//       <div className="absolute top-3 right-6 w-6 h-4 bg-white rounded-full opacity-60"></div>
//       <div className="absolute bottom-0 left-0 right-0 h-6 bg-green-400"></div>
//     </div>
//   );

//   const YesNoCell = ({ value }) => (
//     <div className="w-12 h-8 border border-gray-400 bg-white flex items-center justify-center">
//       {value === "Yes" && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
//     </div>
//   );

//   return (
//     <div className="max-w-2xl mx-auto p-4 bg-white font-sans">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-3 border-2 border-orange-500">
//         <h1 className="text-xl font-bold text-white text-center">SCHOOL REGISTRATION FORM</h1>
//       </div>
      
//       <div className="border-2 border-orange-500 border-t-0 p-4 bg-white">
//         {/* UDISE Code */}
//         <div className="mb-4">
//           <table className="w-full border-collapse">
//             <tbody>
//               <tr>
//                 <td className="border border-gray-400 bg-orange-100 p-2 w-24 text-sm font-medium">UDISE Code</td>
//                 <td className="border border-gray-400 bg-yellow-50 p-2 text-sm">{schoolData.udiseCode}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* School Information */}
//         <div className="mb-4">
//           <div className="flex items-center mb-2">
//             <Building className="w-4 h-4 text-blue-500 mr-2" />
//             <h2 className="text-sm font-bold text-blue-600 uppercase">School Information</h2>
//           </div>
          
//           <table className="w-full border-collapse text-sm">
//             <tbody>
//               <tr>
//                 <td className="border border-gray-400 bg-blue-50 p-2 w-24 font-medium">School Name</td>
//                 <td className="border border-gray-400 bg-white p-2" colSpan="3">{schoolData.schoolName}</td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-400 bg-blue-50 p-2 font-medium">Address</td>
//                 <td className="border border-gray-400 bg-white p-2" colSpan="3">{schoolData.address}</td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-400 bg-blue-50 p-2 font-medium">Teacher's Name</td>
//                 <td className="border border-gray-400 bg-white p-2">{schoolData.teacherName}</td>
//                 <td className="border border-gray-400 bg-blue-50 p-2 font-medium">Teacher's Contact</td>
//                 <td className="border border-gray-400 bg-white p-2">{schoolData.teacherContact}</td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-400 bg-blue-50 p-2 font-medium">Email</td>
//                 <td className="border border-gray-400 bg-white p-2">{schoolData.email}</td>
//                 <td className="border border-gray-400 bg-blue-50 p-2 font-medium">School Type</td>
//                 <td className="border border-gray-400 bg-white p-2">{schoolData.schoolType}</td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-400 bg-blue-50 p-2 font-medium">State</td>
//                 <td className="border border-gray-400 bg-white p-2">{schoolData.state}</td>
//                 <td className="border border-gray-400 bg-blue-50 p-2 font-medium">District</td>
//                 <td className="border border-gray-400 bg-white p-2">{schoolData.district}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Student Information */}
//         <div className="mb-4">
//           <div className="flex items-center mb-2">
//             <Users className="w-4 h-4 text-blue-500 mr-2" />
//             <h2 className="text-sm font-bold text-blue-600 uppercase">Student Information</h2>
//           </div>
          
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <table className="w-full border-collapse text-sm">
//                 <tbody>
//                   <tr>
//                     <td className="border border-gray-400 bg-purple-100 p-2 font-medium">Total Students</td>
//                     <td className="border border-gray-400 bg-white p-1 text-center w-16">
//                       <div className="text-xs text-gray-600">Male</div>
//                       <div className="font-bold">{schoolData.students.total.male}</div>
//                     </td>
//                     <td className="border border-gray-400 bg-white p-1 text-center w-16">
//                       <div className="text-xs text-gray-600">Female</div>
//                       <div className="font-bold">{schoolData.students.total.female}</div>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border border-gray-400 bg-purple-100 p-2 font-medium">Total Trained Students</td>
//                     <td className="border border-gray-400 bg-white p-1 text-center">
//                       <div className="text-xs text-gray-600">Male</div>
//                       <div className="font-bold">{schoolData.students.trained.male}</div>
//                     </td>
//                     <td className="border border-gray-400 bg-white p-1 text-center">
//                       <div className="text-xs text-gray-600">Female</div>
//                       <div className="font-bold">{schoolData.students.trained.female}</div>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border border-gray-400 bg-purple-100 p-2 font-medium">Total Disabled Students</td>
//                     <td className="border border-gray-400 bg-white p-1 text-center">
//                       <div className="text-xs text-gray-600">Male</div>
//                       <div className="font-bold">{schoolData.students.disabled.male}</div>
//                     </td>
//                     <td className="border border-gray-400 bg-white p-1 text-center">
//                       <div className="text-xs text-gray-600">Female</div>
//                       <div className="font-bold">{schoolData.students.disabled.female}</div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//             <div className="w-32">
//               <SkyImage />
//             </div>
//           </div>
//         </div>

//         {/* Teacher Information */}
//         <div className="mb-4">
//           <div className="flex items-center mb-2">
//             <GraduationCap className="w-4 h-4 text-blue-500 mr-2" />
//             <h2 className="text-sm font-bold text-blue-600 uppercase">Teacher Information</h2>
//           </div>
          
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <table className="w-full border-collapse text-sm">
//                 <tbody>
//                   <tr>
//                     <td className="border border-gray-400 bg-orange-100 p-2 font-medium">Total Teachers</td>
//                     <td className="border border-gray-400 bg-white p-1 text-center w-16">
//                       <div className="text-xs text-gray-600">Male</div>
//                       <div className="font-bold">{schoolData.teachers.total.male}</div>
//                     </td>
//                     <td className="border border-gray-400 bg-white p-1 text-center w-16">
//                       <div className="text-xs text-gray-600">Female</div>
//                       <div className="font-bold">{schoolData.teachers.total.female}</div>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border border-gray-400 bg-orange-100 p-2 font-medium">Total Trained Teachers</td>
//                     <td className="border border-gray-400 bg-white p-1 text-center">
//                       <div className="text-xs text-gray-600">Male</div>
//                       <div className="font-bold">{schoolData.teachers.trained.male}</div>
//                     </td>
//                     <td className="border border-gray-400 bg-white p-1 text-center">
//                       <div className="text-xs text-gray-600">Female</div>
//                       <div className="font-bold">{schoolData.teachers.trained.female}</div>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border border-gray-400 bg-orange-100 p-2 font-medium">Program Like</td>
//                     <td className="border border-gray-400 bg-white p-2" colSpan="2">{schoolData.programLike}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//             <div className="w-32">
//               <SkyImage />
//             </div>
//           </div>
//         </div>

//         {/* Disaster Management */}
//         <div className="mb-4">
//           <div className="flex items-center mb-2">
//             <ShieldAlert className="w-4 h-4 text-blue-500 mr-2" />
//             <h2 className="text-sm font-bold text-blue-600 uppercase">Disaster Management</h2>
//           </div>
          
//           <table className="w-full border-collapse text-sm">
//             <tbody>
//               <tr>
//                 <td className="border border-gray-400 bg-cyan-100 p-2 font-medium w-3/4">Rapid Visual Survey Done?</td>
//                 <td className="border border-gray-400 bg-white p-1 text-center">
//                   <div className="flex justify-center gap-1">
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">Yes</div>
//                       <YesNoCell value={schoolData.disasterManagement.rapidVisualSurvey} />
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">No</div>
//                       <YesNoCell value={schoolData.disasterManagement.rapidVisualSurvey === "Yes" ? "" : "No"} />
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-400 bg-cyan-100 p-2 font-medium">Conducted any drills in last 6 months?</td>
//                 <td className="border border-gray-400 bg-white p-1 text-center">
//                   <div className="flex justify-center gap-1">
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">Yes</div>
//                       <YesNoCell value={schoolData.disasterManagement.conductedDrills} />
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">No</div>
//                       <YesNoCell value={schoolData.disasterManagement.conductedDrills === "Yes" ? "" : "No"} />
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-400 bg-cyan-100 p-2 font-medium">School Disaster Management Committee formed?</td>
//                 <td className="border border-gray-400 bg-white p-1 text-center">
//                   <div className="flex justify-center gap-1">
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">Yes</div>
//                       <YesNoCell value={schoolData.disasterManagement.disasterCommitteeFormed} />
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">No</div>
//                       <YesNoCell value={schoolData.disasterManagement.disasterCommitteeFormed === "Yes" ? "" : "No"} />
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-400 bg-cyan-100 p-2 font-medium">Resource Inventory Maintained?</td>
//                 <td className="border border-gray-400 bg-white p-1 text-center">
//                   <div className="flex justify-center gap-1">
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">Yes</div>
//                       <YesNoCell value={schoolData.disasterManagement.resourceInventoryMaintained} />
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">No</div>
//                       <YesNoCell value={schoolData.disasterManagement.resourceInventoryMaintained === "Yes" ? "" : "No"} />
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-400 bg-cyan-100 p-2 font-medium">Evacuation plan with exit map</td>
//                 <td className="border border-gray-400 bg-white p-1 text-center">
//                   <div className="flex justify-center gap-1">
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">Yes</div>
//                       <YesNoCell value={schoolData.disasterManagement.evacuationPlan} />
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">No</div>
//                       <YesNoCell value={schoolData.disasterManagement.evacuationPlan === "Yes" ? "" : "No"} />
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-400 bg-cyan-100 p-2 font-medium">School Disaster Management Plan created?</td>
//                 <td className="border border-gray-400 bg-white p-1 text-center">
//                   <div className="flex justify-center gap-1">
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">Yes</div>
//                       <YesNoCell value={schoolData.disasterManagement.disasterManagementPlan} />
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <div className="text-xs mb-1">No</div>
//                       <YesNoCell value={schoolData.disasterManagement.disasterManagementPlan === "Yes" ? "" : "No"} />
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ReportGenerator;