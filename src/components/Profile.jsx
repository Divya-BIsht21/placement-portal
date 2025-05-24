// import React, { useState, useEffect } from 'react';
// import { Document, Page } from 'react-pdf';
// import { pdfjs } from 'react-pdf';
// import { Link, useNavigate } from 'react-router-dom';
// import { BriefcaseIcon, AcademicCapIcon, XCircleIcon } from '@heroicons/react/outline';
// import { FiFile, FiUpload, FiX, FiEye, FiTrash2 } from 'react-icons/fi';

// // Initialize PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// const StudentProfile = () => {
//   const [showPreview, setShowPreview] = useState(false);
//   const [numPages, setNumPages] = useState(null);
//   const [profileData, setProfileData] = useState({
//     studentData: {},
//     skills: []
//   });
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadProfileData = () => {
//       const savedData = localStorage.getItem('studentProfile');
//       if (savedData) {
//         const parsedData = JSON.parse(savedData);
//         setProfileData({
//           studentData: parsedData || {},
//           skills: parsedData.skills || []
//         });
//       }
//       setLoading(false);
//     };

//     loadProfileData();
//   }, []);

//   const getSafeValue = (value) => {
//     if (value === null || value === undefined) return 'N/A';
//     if (typeof value === 'object') return JSON.stringify(value);
//     return value;
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const base64ToBlob = (base64) => {
//     if (!base64) return null;
//     try {
//       const base64Data = base64.includes('base64,')
//         ? base64.split(',')[1]
//         : base64;
//       const byteCharacters = atob(base64Data);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);
//       return new Blob([byteArray], { type: 'application/pdf' });
//     } catch (error) {
//       console.error('Error converting base64 to Blob:', error);
//       return null;
//     }
//   };

//   const handleLogout = () => {
//     const confirmLogout = window.confirm("Are you sure you want to logout?");
//     if (confirmLogout) {
//       localStorage.removeItem('isAuthenticated');
//       navigate('/');
//     }
//   };

//   const handlePreview = () => {
//     const { studentData } = profileData;
//     if (studentData.resume?.type === 'application/pdf') {
//       setShowPreview(true);
//     } else {
//       window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}`, '_blank');
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
//         <p className="ml-3">Loading...</p>
//       </div>
//     );
//   }

//   const { studentData, skills } = profileData;
//   const resumeBlob = studentData.resume ? base64ToBlob(studentData.resume) : null;

//   return (
//     <div className="dashboard flex flex-col md:flex-row h-screen w-full bg-gray-100">
//       {/* Sidebar */}
//       <div className="hidden md:flex md:flex-shrink-0">
//         <div className="flex flex-col w-64 bg-gray-800 text-white">
//           <div className="flex items-center h-16 px-4">
//             <h1 className="text-xl font-bold">Student Portal</h1>
//           </div>
//           <div className="flex flex-col items-center py-6 border-b border-gray-700">
//             <div className="relative w-24 h-24 mb-3">
//               <img 
//                 src={studentData.profilePic || '/default-profile.png'}
//                 alt="Profile"
//                 className="w-full h-full rounded-full object-cover border-2 border-white"
//               />
//             </div>
//             <h2 className="text-lg font-medium">{studentData.fullName || "Student Name"}</h2>
//             <p className="text-sm text-gray-200">{studentData.email || "student@example.com"}</p>
//           </div>
//           <nav className="flex-1 px-2 py-4 space-y-1">
//                       <button
//                         onClick={() => setActiveTab('jobs')}
//                         className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
//                           activeTab === 'jobs' ? 'bg-gray-900' : 'hover:bg-gray-600'
//                         }`}
//                       >
//                         <BriefcaseIcon className="h-5 w-5 mr-3" />
//                         Job Board
//                       </button>
//                       <button
//                         onClick={() => setActiveTab('applications')}
//                         className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
//                           activeTab === 'applications' ? 'bg-gray-900' : 'hover:bg-gray-600'
//                         }`}
//                       >
//                         <AcademicCapIcon className="h-5 w-5 mr-3" />
//                         My Applications
//                       </button>
//                       <Link
//                         to="/profile"
//                         className="flex items-center px-4 py-2 text-sm font-medium rounded-md w-full hover:bg-gray-600"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                         View Profile
//                       </Link>
//                     </nav>
                    
          
//           <div className="p-4 border-t border-gray-700">
//             <button
//               onClick={handleLogout}
//               className="flex items-center w-full px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-red-700"
//             >
//               <XCircleIcon className="h-5 w-5 mr-3" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="main-content flex-1 overflow-y-auto">
//         <div className="p-6 bg-white shadow-lg rounded-xl m-4">
//           {/* PDF Preview Modal */}
//           {showPreview && studentData.resume?.type === 'application/pdf' && (
//             <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
//               <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
//                 <div className="flex justify-between items-center p-4 border-b">
//                   <h3 className="text-lg font-medium">{studentData.resume.name}</h3>
//                   <button
//                     onClick={() => setShowPreview(false)}
//                     className="text-gray-500 hover:text-gray-700 text-2xl"
//                   >
//                     &times;
//                   </button>
//                 </div>
//                 <iframe
//                   src={previewUrl}
//                   className="flex-1 w-full border-0"
//                   title="Resume Preview"
//                 />
//               </div>
//             </div>
//           )}

//           <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
//             Student Profile
//           </h2>

//           <div className="space-y-8 pb-6">
//             {/* Profile Header */}
//             <div className="flex flex-col items-center">
//               <div className="relative">
//                 <img
//                   src={studentData.profilePic || '/default-profile.png'}
//                   alt="Profile"
//                   className="w-36 h-36 rounded-full border-4 border-indigo-100 object-cover shadow-lg"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = '/default-profile.png';
//                   }}
//                 />
//                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
//                   {getSafeValue(studentData.role)}
//                 </div>
//               </div>
//               <h3 className="mt-6 text-2xl font-bold text-gray-800">
//                 {getSafeValue(studentData.fullName)}
//               </h3>
//               <h5 className="text-xl text-gray-700">
//                 {getSafeValue(studentData.rollno)}
//               </h5>
//               <p className="text-gray-600">
//                 {getSafeValue(studentData.College)}
//               </p>
//             </div>

//             {/* Personal Details */}
//             <div className="border-l-2 border-gray-200 pl-6 space-y-8">
//               {[
//                 {
//                   label: "Personal Information",
//                   icon: "👤",
//                   items: [
//                     ["Email", studentData.email, "✉️"],
//                     ["Mobile", studentData.mobile, "📱"],
//                     ["Gender", studentData.gender, "⚥"],
//                     ["Course", studentData.course, "🎓"]
//                   ]
//                 },
//                 {
//                   label: "Education Details",
//                   icon: "📚",
//                   items: [
//                     ["10th Percentage", `${studentData.tenthpercent}%`, "🔟"],
//                     ["12th Percentage", studentData.twelfthpercent ? `${studentData.twelfthpercent}%` : 'N/A', "1️⃣2️⃣"],
//                     ["CGPA", studentData.cgpa, "⭐"],
//                     ["Year of Passing", studentData.yearOfPassing, "🎓"]
//                   ]
//                 },
//                 {
//                   label: "Professional Links",
//                   icon: "🔗",
//                   items: [
//                     ["GitHub", studentData.GitHub ? (
//                       <a href={studentData.GitHub} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center">
//                         🔗 {studentData.GitHub}
//                       </a>
//                     ) : 'N/A', ""],
//                     ["LinkedIn", studentData.linkedin ? (
//                       <a href={studentData.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center">
//                         🔗 {studentData.linkedin}
//                       </a>
//                     ) : 'N/A', ""]
//                   ]
//                 }
//               ].map((section, sectionIndex) => (
//                 <div key={sectionIndex} className="relative">
//                   <div className="absolute w-8 h-8 bg-blue-100 rounded-full -left-9 top-0 flex items-center justify-center text-blue-600">
//                     {section.icon}
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                     {section.label}
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {section.items.map(([label, value, emoji], itemIndex) => (
//                       <div key={itemIndex} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
//                         <p className="text-sm text-gray-500 flex items-center">
//                           <span className="mr-2">{emoji}</span>{label}
//                         </p>
//                         <p className="text-gray-800 mt-1 font-medium">
//                           {React.isValidElement(value) ? value : getSafeValue(value)}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Skills Section */}
//             <div className="relative border-l-2 border-gray-200 pl-6">
//               <div className="absolute w-8 h-8 bg-blue-100 rounded-full -left-9 top-0 flex items-center justify-center text-blue-600">
//                 🛠️
//               </div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills Proficiency</h3>

//               {skills?.length > 0 ? (
//                 <div className="max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {skills.map((skill, index) => {
//                       const levelConfig = {
//                         'beginner': { percentage: 30, colorClass: 'bg-yellow-500' },
//                         'intermediate': { percentage: 60, colorClass: 'bg-orange-500' },
//                         'advanced': { percentage: 85, colorClass: 'bg-blue-500' },
//                         'expert': { percentage: 100, colorClass: 'bg-green-500' }
//                       };

//                       const level = skill?.level?.toLowerCase() || 'beginner';
//                       const config = levelConfig[level] || levelConfig['beginner'];
//                       const percentage = config.percentage;
//                       const colorClass = config.colorClass;

//                       return (
//                         <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
//                           <div className="flex items-center">
//                             <div className="flex-1 min-w-0">
//                               <h4 className="font-bold text-gray-800 truncate">
//                                 {skill.name || 'Unnamed Skill'}
//                               </h4>

//                               <div className="mt-2">
//                                 <div className="flex justify-between text-xs text-gray-500 mb-1">
//                                   <span className="capitalize">{level}</span>
//                                   <span>{percentage}%</span>
//                                 </div>
//                                 <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                                   <div
//                                     className={`h-2 rounded-full ${colorClass}`}
//                                     style={{ width: `${percentage}%` }}
//                                   ></div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-gray-50 p-6 rounded-lg text-center">
//                   <p className="text-gray-500 italic">No skills added yet</p>
//                   <Link
//                     to="/student-dashboard"
//                     className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
//                   >
//                     Add Skills
//                   </Link>
//                 </div>
//               )}
//             </div>

//             {studentData.resume && (
//               <div className="relative border-l-2 border-gray-200 pl-6">
//                 <div className="absolute w-8 h-8 bg-blue-100 rounded-full -left-9 top-0 flex items-center justify-center text-blue-600">
//                   📄
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Resume</h3>
//                 <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
//                   <div className="flex items-start">
//                     <div className="bg-blue-100 p-3 rounded-lg mr-4">
//                       <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-bold text-gray-800">
//                         {studentData.resume.name || 'resume.pdf'}
//                       </h4>
//                       <p className="text-gray-600 text-sm mt-1">
//                         {studentData.resume.size ? `${(studentData.resume.size / 1024).toFixed(2)} KB` : 'Size unknown'} • PDF
//                       </p>
//                       <div className="flex gap-3 mt-4">
//                         <a
//                           href={resumeBlob ? URL.createObjectURL(resumeBlob) : '#'}
//                           download={studentData.resume.name || 'resume.pdf'}
//                           className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                           Download
//                         </a>
//                         <button
//                           onClick={handlePreview}
//                           className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
//                         >
//                           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                           Preview
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentProfile;