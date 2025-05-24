"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { Link, useNavigate } from 'react-router-dom';
import defaultImage from "../images/default-profile-pic.jpg";
import { FiFile, FiUpload, FiX, FiEye, FiTrash2, FiEdit } from 'react-icons/fi';
import {
  BriefcaseIcon,
  AcademicCapIcon,
  XCircleIcon,
  UserIcon,
  PencilIcon,
  DocumentTextIcon
} from '@heroicons/react/outline';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State management
  const [student, setStudent] = useState({
    id: '',
    name: '',
    email: '',
    skills: []
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs', 'applications', 'profile', 'edit-profile'
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [isLoading, setIsLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [studentData, setStudentData] = useState({
    profilePic: defaultImage,
    fullName: "",
    email: "",
    mobile: "",
    rollno: "",
    role: "",
    College: "",
    GitHub: "",
    linkedin: "",
    resume: null,
    tenthpercent: "",
    twelfthpercent: "",
    cgpa: "",
    yearOfPassing: "",
    course: "",
    gender: "",
    skills: []
  });

  // Helper function to safely get values
  const getSafeValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };

  // PDF document load success handler
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Convert base64 to Blob for PDF handling
  const base64ToBlob = (base64) => {
    if (!base64) return null;
    try {
      const base64Data = base64.includes('base64,')
        ? base64.split(',')[1]
        : base64;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error converting base64 to Blob:', error);
      return null;
    }
  };

  // Authentication check and data loading
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/student-login');
      return;
    }

    const studentData = JSON.parse(localStorage.getItem('currentStudent'));
    if (!studentData) {
      navigate('/student-login');
      return;
    }
    
    setStudent(studentData);
    
    // Load profile data if exists
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setStudentData(profileData);
      if (profileData.skills) {
        setSkills(profileData.skills);
      }
    }
    
    // Load jobs and applications
    const savedJobs = localStorage.getItem('postedJobs');
    if (savedJobs) {
      setAvailableJobs(JSON.parse(savedJobs));
    }
    
    const applications = localStorage.getItem(`studentApplications_${studentData.email}`);
    if (applications) {
      setMyApplications(JSON.parse(applications));
    }
    
    setIsLoading(false);
  }, []);

  // Handle profile picture upload
  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle resume upload
  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0] || fileInputRef.current?.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large (max 5MB)');
      return;
    }
    
    // Show upload progress (simulated)
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
          setStudentData(prev => ({
            ...prev,
            resume: {
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified
            }
          }));
        }
      }, 100);
    };
    
    simulateUpload();
  };
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'postedJobs') {
        setAvailableJobs(JSON.parse(e.newValue));
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  // Handle resume preview
  const handlePreview = () => {
    if (studentData.resume?.type === 'application/pdf') {
      setShowPreview(true);
    } else {
      window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}`, '_blank');
    }
  };

  // Handle logout
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('isAuthenticated');
      navigate('/');
    }
  };

  // Handle remove resume
  const handleRemoveResume = () => {
    setStudentData(prev => ({ ...prev, resume: null }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadProgress(0);
  };

  // Handle remove profile image
  const handleRemoveImage = () => {
    setStudentData(prev => ({ ...prev, profilePic: defaultImage }));
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setStudentData(prev => ({ ...prev, [id]: value }));
  };

  // Handle add skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.some(skill => skill.name === newSkill.trim())) {
      setSkills([...skills, { name: newSkill.trim(), level: skillLevel }]);
      setNewSkill('');
    }
  };

  // Handle remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill.name !== skillToRemove));
  };

  // Apply for job
  const applyForJob = (jobId) => {
    const job = availableJobs.find(j => j.id === jobId);
    if (!job) return;
    
    const newApplication = {
      id: Date.now(),
      jobId,
      jobTitle: job.title,
      company: job.company,
      companyId: job.companyId, // Add this if you track companies by ID
      studentId: student.id,
      studentName: studentData.fullName || student.name,
      studentEmail: student.email,
      studentCollege: studentData.College,
      studentCourse: studentData.course,
      studentCgpa: studentData.cgpa,
      studentSkills: skills.map(skill => skill.name),
      resumeUrl: previewUrl, // Add resume URL if available
      appliedDate: new Date().toISOString(),
      status: 'pending'
    };
    
    // Update student's applications
    const updatedStudentApplications = [...myApplications, newApplication];
    setMyApplications(updatedStudentApplications);
    localStorage.setItem(`studentApplications_${student.email}`, JSON.stringify(updatedStudentApplications));
    
    // Update company's applications
    const companyApplications = JSON.parse(
      localStorage.getItem(`companyApplications_${job.companyId}`) || '[]'
    );
      companyApplications.push(newApplication);
  localStorage.setItem(
    `companyApplications_${job.companyId}`,
    JSON.stringify(companyApplications)
  );

  // Also update global applications list (if needed)
  const allApplications = JSON.parse(
    localStorage.getItem('allApplications') || '[]'
  );
  localStorage.setItem(
    'allApplications',
    JSON.stringify([...allApplications, newApplication])
  );

  alert(`Applied for ${job.title}`);
};

  // Form validation
  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'mobile', 'College'];
    for (const field of requiredFields) {
      if (!studentData[field]) {
        alert(`Please fill in the ${field} field`);
        return false;
      }
    }
    return true;
  };

  // Save to local storage
  const saveToLocalStorage = () => {
    if (!validateForm()) return;
    
    const dataToSave = {
      ...studentData,
      skills
    };
    
    localStorage.setItem("studentProfile", JSON.stringify(dataToSave));
    alert("Profile saved successfully!");
    setActiveTab('profile'); // Switch to profile view after saving
  };

  // Job Board Component
  const JobBoard = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [showJdModal, setShowJdModal] = useState(false);
    const handleViewJd = (job) => {
      setSelectedJob(job);
      setShowJdModal(true);
    };
  
    const handleCloseJdModal = () => {
      setShowJdModal(false);
      setSelectedJob(null);
    };
  
    const handleApply = (jobId) => {
      applyForJob(jobId);
      handleCloseJdModal();
    };
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Available Jobs</h2>
          <button
            onClick={() => setActiveTab('applications')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
          >
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            View My Applications
          </button>
        </div>
        
        {availableJobs.length === 0 ? (
          <p className="text-gray-500">No jobs available at the moment</p>
        ) : (
          availableJobs.map(job => (
            <div key={job.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {job.location} • {job.jobType} • {job.salaryMin}-{job.salaryMax} LPA
                  </p>
                </div>
                <div>
                  {myApplications.some(app => app.jobId === job.id) ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Applied
                    </span>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewJd(job)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
                      >
                        View JD
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium">Brief Description:</h4>
                <p className="text-gray-700 line-clamp-2">{job.description}</p>
              </div>
              <div className="mt-3">
                <h4 className="font-medium">Key Skills:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skills && job.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                  {job.skills?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
  
        {/* JD View Modal */}
        {showJdModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold">{selectedJob.title}</h3>
                <button
                  onClick={handleCloseJdModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h4 className="font-medium text-lg mb-2">Job Description</h4>
                      <div className="prose max-w-none">
                        {selectedJob.description}
                      </div>
                    </div>
                    
                    {selectedJob.jdFile && (
                      <div>
                        <h4 className="font-medium text-lg mb-2">Detailed Job Description</h4>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                              <div>
                                <p className="font-medium">{selectedJob.jdFileName || 'Job Description File'}</p>
                                <p className="text-sm text-gray-500">
                                  {selectedJob.jdFile.size ? `${(selectedJob.jdFile.size / 1024).toFixed(2)} KB` : 'Size unknown'}
                                </p>
                              </div>
                            </div>
                            <a
                              href={selectedJob.jdFile}
                              download={`${selectedJob.title.replace(/\s+/g, '_')}_JD`}
                              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-lg mb-3">Job Details</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Company</p>
                          <p className="font-medium">{selectedJob.company}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Job Type</p>
                          <p className="font-medium capitalize">{selectedJob.jobType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">
                            {selectedJob.location} {selectedJob.remote && '(Remote)'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Salary Range</p>
                          <p className="font-medium">
                            {selectedJob.salaryMin && selectedJob.salaryMax 
                              ? `${selectedJob.salaryMin} - ${selectedJob.salaryMax} LPA`
                              : 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Experience Level</p>
                          <p className="font-medium capitalize">{selectedJob.experience}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Application Deadline</p>
                          <p className="font-medium">
                            {selectedJob.deadline || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-lg mb-3">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills && selectedJob.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-white border border-gray-200 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t flex justify-end space-x-3">
                <button
                  onClick={handleCloseJdModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApply(selectedJob.id)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Applications Component
  const ApplicationsBoard = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Applications</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
          >
            <BriefcaseIcon className="h-5 w-5 mr-2" />
            View Job Board
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            View Profile
          </button>
        </div>
      </div>
      {myApplications.length === 0 ? (
        <p className="text-gray-500">You haven't applied to any jobs yet</p>
      ) : (
        myApplications.map(application => (
          <div key={application.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                <p className="text-gray-600">{application.company}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Applied on: {application.appliedDate}
                </p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Profile View Component
  const ProfileView = () => {
    const resumeBlob = studentData.resume ? base64ToBlob(studentData.resume) : null;
    
    return (
      <div className="bg-white shadow-lg rounded-xl p-6">
        {/* PDF Preview Modal */}
        {showPreview && studentData.resume?.type === 'application/pdf' && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-medium">{studentData.resume.name}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              <iframe
                src={previewUrl}
                className="flex-1 w-full border-0"
                title="Resume Preview"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Student Profile</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('edit-profile')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
            >
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              Job Board
            </button>
          </div>
        </div>

        <div className="space-y-8 pb-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={studentData.profilePic || defaultImage}
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-indigo-100 object-cover shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                {getSafeValue(studentData.role)}
              </div>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-800">
              {getSafeValue(studentData.fullName)}
            </h3>
            <h5 className="text-xl text-gray-700">
              {getSafeValue(studentData.rollno)}
            </h5>
            <p className="text-gray-600">
              {getSafeValue(studentData.College)}
            </p>
          </div>

          {/* Personal Details */}
          <div className="border-l-2 border-gray-200 pl-6 space-y-8">
            {[
              {
                label: "Personal Information",
                icon: "👤",
                items: [
                  ["Email", studentData.email, "✉️"],
                  ["Mobile", studentData.mobile, "📱"],
                  ["Gender", studentData.gender, "⚥"],
                  ["Course", studentData.course, "🎓"]
                ]
              },
              {
                label: "Education Details",
                icon: "📚",
                items: [
                  ["10th Percentage", `${studentData.tenthpercent}%`, "🔟"],
                  ["12th Percentage", studentData.twelfthpercent ? `${studentData.twelfthpercent}%` : 'N/A', "1️⃣2️⃣"],
                  ["CGPA", studentData.cgpa, "⭐"],
                  ["Year of Passing", studentData.yearOfPassing, "🎓"]
                ]
              },
              {
                label: "Professional Links",
                icon: "🔗",
                items: [
                  ["GitHub", studentData.GitHub ? (
                    <a href={studentData.GitHub} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center">
                      🔗 {studentData.GitHub}
                    </a>
                  ) : 'N/A', ""],
                  ["LinkedIn", studentData.linkedin ? (
                    <a href={studentData.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center">
                      🔗 {studentData.linkedin}
                    </a>
                  ) : 'N/A', ""]
                ]
              }
            ].map((section, sectionIndex) => (
              <div key={sectionIndex} className="relative">
                <div className="absolute w-8 h-8 bg-blue-100 rounded-full -left-9 top-0 flex items-center justify-center text-blue-600">
                  {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  {section.label}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.items.map(([label, value, emoji], itemIndex) => (
                    <div key={itemIndex} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-sm text-gray-500 flex items-center">
                        <span className="mr-2">{emoji}</span>{label}
                      </p>
                      <p className="text-gray-800 mt-1 font-medium">
                        {React.isValidElement(value) ? value : getSafeValue(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className="relative border-l-2 border-gray-200 pl-6">
            <div className="absolute w-8 h-8 bg-blue-100 rounded-full -left-9 top-0 flex items-center justify-center text-blue-600">
              🛠️
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills Proficiency</h3>

            {skills?.length > 0 ? (
              <div className="max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((skill, index) => {
                    const levelConfig = {
                      'beginner': { percentage: 30, colorClass: 'bg-yellow-500' },
                      'intermediate': { percentage: 60, colorClass: 'bg-orange-500' },
                      'advanced': { percentage: 85, colorClass: 'bg-blue-500' },
                      'expert': { percentage: 100, colorClass: 'bg-green-500' }
                    };

                    const level = skill?.level?.toLowerCase() || 'beginner';
                    const config = levelConfig[level] || levelConfig['beginner'];
                    const percentage = config.percentage;
                    const colorClass = config.colorClass;

                    return (
                      <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 truncate">
                              {skill.name || 'Unnamed Skill'}
                            </h4>

                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span className="capitalize">{level}</span>
                                <span>{percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-2 rounded-full ${colorClass}`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-500 italic">No skills added yet</p>
              </div>
            )}
          </div>

          {studentData.resume && (
            <div className="relative border-l-2 border-gray-200 pl-6">
              <div className="absolute w-8 h-8 bg-blue-100 rounded-full -left-9 top-0 flex items-center justify-center text-blue-600">
                📄
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Resume</h3>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">
                      {studentData.resume.name || 'resume.pdf'}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {studentData.resume.size ? `${(studentData.resume.size / 1024).toFixed(2)} KB` : 'Size unknown'} • PDF
                    </p>
                    <div className="flex gap-3 mt-4">
                      <a
                        href={resumeBlob ? URL.createObjectURL(resumeBlob) : '#'}
                        download={studentData.resume.name || 'resume.pdf'}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Download
                      </a>
                      <button
                        onClick={handlePreview}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Edit Profile Component
  const EditProfile = () => (
    <div className="bg-white shadow rounded-lg overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Profile</h3>
            <p className="mt-1 text-sm text-gray-500">Update your personal information and resume</p>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Profile
          </button>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900">Personal Information</h4>
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                value={studentData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <div className="flex flex-wrap gap-4">
                {['Male', 'Female', 'Prefer not to say'].map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={studentData.gender === option}
                      onChange={() => setStudentData({...studentData, gender: option})}
                      className="h-4 w-4 text-gray-600 focus:ring-gray-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={studentData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                placeholder="Your mobile number"
                value={studentData.mobile}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="rollno" className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
              <input
                type="text"
                id="rollno"
                placeholder="Your roll number"
                value={studentData.rollno}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role/Position</label>
              <input
                type="text"
                id="role"
                placeholder="e.g., Software Developer"
                value={studentData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            
            <h4 className="text-lg font-medium text-gray-900 pt-4">Social Media</h4>
            
            <div>
              <label htmlFor="GitHub" className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
              <input
                type="url"
                id="GitHub"
                placeholder="https://github.com/username"
                value={studentData.GitHub}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                id="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={studentData.linkedin}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
          
          {/* Academic Details & Resume Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900">Academic Details</h4>
            
            <div>
              <label htmlFor="College" className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
              <input
                type="text"
                id="College"
                placeholder="Enter college name"
                value={studentData.College}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tenthpercent" className="block text-sm font-medium text-gray-700 mb-1">10th Percentage</label>
                <input
                  type="number"
                  id="tenthpercent"
                  placeholder="e.g., 85.5"
                  value={studentData.tenthpercent}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label htmlFor="twelfthpercent" className="block text-sm font-medium text-gray-700 mb-1">12th Percentage</label>
                <input
                  type="number"
                  id="twelfthpercent"
                  placeholder="e.g., 90.2"
                  value={studentData.twelfthpercent}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                <input
                  type="number"
                  id="cgpa"
                  placeholder="e.g., 8.5"
                  value={studentData.cgpa}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label htmlFor="yearOfPassing" className="block text-sm font-medium text-gray-700 mb-1">Year of Passing</label>
                <input
                  type="number"
                  id="yearOfPassing"
                  placeholder="e.g., 2024"
                  value={studentData.yearOfPassing}
                  onChange={handleInputChange}
                  min="2000"
                  max={new Date().getFullYear() + 5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <input
                type="text"
                id="course"
                placeholder="e.g., B.Tech Computer Science"
                value={studentData.course}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            
            <h4 className="text-lg font-medium text-gray-900 pt-4">Skills</h4>
            
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) => {
                    let badgeColor = "bg-gray-100 text-gray-800";
                    if (skill.level === "Intermediate") badgeColor = "bg-purple-100 text-purple-800";
                    if (skill.level === "Advanced") badgeColor = "bg-green-100 text-green-800";
                    if (skill.level === "Expert") badgeColor = "bg-yellow-100 text-yellow-800";
                    
                    return (
                      <div
                        key={index}
                        className={`${badgeColor} px-3 py-1 rounded-full flex items-center transition-all duration-200`}
                      >
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-xs ml-2 px-2 py-0.5 bg-white bg-opacity-50 rounded-full">
                          {skill.level}
                        </span>
                        <button
                          onClick={() => handleRemoveSkill(skill.name)}
                          className="ml-2 text-red-500 hover:text-red-700 text-sm"
                          aria-label="Remove skill"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 italic">No skills added yet</p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter skill (e.g., JavaScript)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Skill
                </button>
              </div>
            </div>
            
            <h4 className="text-lg font-medium text-gray-900 pt-4">Resume</h4>
            
            {/* Current Resume Display */}
            {studentData.resume ? (
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiFile className="text-gray-500 text-2xl mr-3" />
                    <div>
                      <p className="font-medium">{studentData.resume.name}</p>
                      <p className="text-sm text-gray-500">
                        {Math.round(studentData.resume.size / 1024)} KB • 
                        {studentData.resume.type.split('/')[1].toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handlePreview}
                      className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                    >
                      <FiEye className="mr-1" /> Preview
                    </button>
                    <button
                      onClick={handleRemoveResume}
                      className="text-red-500 hover:text-red-700 flex items-center text-sm"
                    >
                      <FiTrash2 className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                    <div
                      className="bg-gray-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FiUpload className="mx-auto text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500">No resume uploaded</p>
              </div>
            )}
            
            {/* Upload Button */}
            <label
              className="block"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-gray-500', 'bg-gray-50');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-gray-500', 'bg-gray-50');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-gray-500', 'bg-gray-50');
                if (e.dataTransfer.files.length) {
                  handleResumeUpload({ target: { files: e.dataTransfer.files } });
                }
              }}
            >
              <span className="sr-only">Choose resume file</span>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeUpload}
              />
              <div className="flex flex-col items-center px-4 py-6 bg-gray-50 text-gray-600 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-500 hover:bg-gray-50 cursor-pointer transition">
                <FiUpload className="text-2xl mb-2" />
                <span className="font-medium">Choose file or drag and drop</span>
                <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</span>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:px-6 border-t border-gray-200 flex justify-end">
        <button
          onClick={saveToLocalStorage}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      <p className="ml-3">Loading...</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Mobile Navigation */}
      <div className="md:hidden bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Student Portal</h1>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex mt-4 space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              activeTab === 'jobs' ? 'bg-gray-900' : 'hover:bg-gray-600'
            }`}
          >
            <BriefcaseIcon className="h-4 w-4 inline mr-1" />
            Job Board
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex-1 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              activeTab === 'applications' ? 'bg-gray-900' : 'hover:bg-gray-600'
            }`}
          >
            <AcademicCapIcon className="h-4 w-4 inline mr-1" />
            Applications
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-gray-900' : 'hover:bg-gray-600'
            }`}
          >
            <UserIcon className="h-4 w-4 inline mr-1" />
            Profile
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-gray-800 text-white">
            <div className="flex items-center h-16 px-4">
              <h1 className="text-xl font-bold">Student Portal</h1>
            </div>
            <div className="flex flex-col items-center py-6 border-b border-gray-700">
              <div className="relative w-24 h-24 mb-3">
                <img 
                  src={studentData.profilePic}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
                <div className="absolute bottom-0 right-0">
                  <label htmlFor="profile-upload" className="bg-white rounded-full shadow cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white-800" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <input 
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePicUpload}
                    />
                  </label>
                </div>
              </div>
              <h2 className="text-lg font-medium">{studentData.fullName || "Student Name"}</h2>
              <p className="text-sm text-gray-200">{studentData.email || "student@example.com"}</p>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'jobs' ? 'bg-gray-900' : 'hover:bg-gray-600'
                }`}
              >
                <BriefcaseIcon className="h-5 w-5 mr-3" />
                Job Board
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'applications' ? 'bg-gray-900' : 'hover:bg-gray-600'
                }`}
              >
                <AcademicCapIcon className="h-5 w-5 mr-3" />
                My Applications
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'profile' ? 'bg-gray-900' : 'hover:bg-gray-600'
                }`}
              >
                <UserIcon className="h-5 w-5 mr-3" />
                View Profile
              </button>
              {activeTab === 'profile' && (
                <button
                  onClick={() => setActiveTab('edit-profile')}
                  className={`flex items-center px-8 py-2 text-sm font-medium rounded-md w-full ${
                    activeTab === 'edit-profile' ? 'bg-gray-900' : 'hover:bg-gray-600'
                  }`}
                >
                  <PencilIcon className="h-5 w-5 mr-3" />
                  Edit Profile
                </button>
              )}
            </nav>
            
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-red-700"
              >
                <XCircleIcon className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === 'jobs' && <JobBoard />}
            {activeTab === 'applications' && <ApplicationsBoard />}
            {activeTab === 'profile' && <ProfileView />}
            {activeTab === 'edit-profile' && <EditProfile />}
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPreview && studentData.resume?.type === 'application/pdf' && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">{studentData.resume.name}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <iframe
              src={previewUrl}
              className="flex-1 w-full border-0"
              title="Resume Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;