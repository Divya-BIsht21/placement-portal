"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import defaultImage from "../images/default-profile-pic.jpg";

const JobDetails = ({ job, onBack, onApply, studentData }) => {
  const [resumeOption, setResumeOption] = useState("existing");
  const [newResume, setNewResume] = useState(null);

  const handleApply = () => {
    const applicationData = {
      job,
      student: {
        name: studentData.fullName,
        email: studentData.email,
        phone: studentData.mobile,
        college: studentData.College,
        skills: studentData.skills || [],
        education: {
          degree: studentData.course,
          graduationYear: studentData.yearOfPassing,
          gpa: studentData.cgpa
        }
      },
      resume: resumeOption === "existing" ? studentData.resume : newResume,
      applicationDate: new Date().toISOString()
    };
    onApply(applicationData);
  };
  const getSafeValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to jobs
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <h3 className="text-xl text-blue-600">{job.company} • {job.location}</h3>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Job Description</h4>
        <p className="text-gray-700 mb-4">{job.description}</p>
        
        <h4 className="font-semibold mb-2">Requirements</h4>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h4 className="font-semibold mb-4">Your Application</h4>
        
        <div className="mb-6">
          <h5 className="font-medium mb-2">Resume Options</h5>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="existing-resume"
                name="resume-option"
                value="existing"
                checked={resumeOption === "existing"}
                onChange={() => setResumeOption("existing")}
                className="mr-2"
              />
              <label htmlFor="existing-resume">Use my existing resume</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="new-resume"
                name="resume-option"
                value="new"
                checked={resumeOption === "new"}
                onChange={() => setResumeOption("new")}
                className="mr-2"
              />
              <label htmlFor="new-resume">Upload new resume</label>
            </div>

            {resumeOption === "new" && (
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setNewResume(e.target.files[0])}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h5 className="font-medium mb-2">Your Information</h5>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{getSafeValue(studentData.fullName)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{studentData.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">College</p>
                <p className="font-medium">{studentData.College || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Course</p>
                <p className="font-medium">{studentData.course || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={!studentData.resume && !newResume}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

const ApplicationConfirmation = ({ job, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
      <div className="text-green-500 text-5xl mb-4">✓</div>
      <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
      <p className="text-gray-600 mb-6">
        Your application for <span className="font-medium">{job.title}</span> at <span className="font-medium">{job.company}</span> has been successfully submitted.
      </p>
      <div className="mb-6">
        <p className="text-sm text-gray-500">The company will review your application and contact you if you're selected for the next round.</p>
      </div>
      <button
        onClick={onBack}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Browse More Jobs
      </button>
    </div>
  );
};

const StudentJobApplication = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [studentData, setStudentData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    College: '',
    course: '',
    yearOfPassing: '',
    cgpa: '',
    resume: null,
    skills: [],
    profilePic: '',
    rollno: '',
    role: '',
    GitHub: '',
    linkedin: '',
    tenthpercent: '',
    twelfthpercent: '',
    gender: ''
  });
  
  // Load student data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('studentProfile');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setStudentData(prev => ({
        ...prev,
        ...parsedData,
        profilePic: parsedData.profilePic || defaultImage
      }));
    }
  }, []);



  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setApplicationStatus(null);
  };

  const handleBack = () => {
    setSelectedJob(null);
    setApplicationStatus(null);
  };

  const handleApply = (applicationData) => {
    console.log("Submitting application:", applicationData);
    setTimeout(() => {
      setApplicationStatus("success");
    }, 1000);
  };
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('isAuthenticated');
      navigate('/');
    }
  };
   // Job listings data
   const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Corp",
      location: "Remote",
      posted: "2 days ago",
      status: "pending",
      description: "We're looking for a skilled Frontend Developer...",
      requirements: [
        "Bachelor's degree in Computer Science",
        "2+ years of experience",
        "Proficiency in JavaScript"
      ]
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "Data Systems",
      location: "Noida",
      posted: "1 week ago",
      status: "pending",
      description: "Join our backend team to build scalable applications.",
      requirements: [
        "Degree in Computer Science",
        "3+ years of backend experience",
        "Strong knowledge of Node.js/Python/Java"
      ]
    }
  ]);
  
  const handleAccept = (jobId) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, status: "accepted" } : job
    );
    setJobs(updatedJobs);
    handleJobSelect(updatedJobs.find(job => job.id === jobId));
  };

  const handleReject = (jobId) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, status: "rejected" } : job
    );
    setJobs(updatedJobs);
  };

  const renderMainContent = () => {
    if (!selectedJob) {
      return (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Upcoming Jobs</h2>
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className={`border rounded-lg p-4 ${job.status === 'accepted' ? 'border-green-200 bg-green-50' : job.status === 'rejected' ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                    <p className="text-xs text-gray-500">Posted {job.posted}</p>
                  </div>
                  {job.status === "pending" ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleAccept(job.id)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleReject(job.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Not Interested
                      </button>
                    </div>
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded-full ${job.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {job.status === 'accepted' ? 'Applied' : 'Declined'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (applicationStatus === "success") {
      return <ApplicationConfirmation job={selectedJob} onBack={handleBack} />;
    } else {
      return (
        <JobDetails 
          job={selectedJob} 
          onBack={handleBack}
          onApply={handleApply}
          studentData={studentData}
        />
      );
    }
  };

  return (
    <div className="dashboard flex flex-col md:flex-row h-screen w-full bg-gray-100">
      {/* Sidebar - Consistent across all views */}
      <div className="sidebar w-full md:w-1/5 bg-gray-800 text-white p-6 shadow-md flex flex-col">
        <div className="profile text-center mb-6">
          <img 
            src={studentData.profilePic} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover mx-auto"
          />
          <h2 className="text-lg mb-2 mt-4">{studentData.fullName || "Student Name"}</h2>
          <p className="m-0 text-sm text-gray-400">Roll No: {studentData.rollno || 'N/A'}</p>
        </div>
        <div className="flex-grow">
          <ul className="list-none p-0">
            <li>
              <Link to="/profile" className="text-gray-400 hover:text-white no-underline block p-3 mb-4 rounded-lg transition duration-300 hover:bg-gray-700">
                Show Profile
              </Link>
            </li>
            <li>
              <Link to="/StudentDashboard" className="text-gray-400 hover:text-white no-underline block p-3 mb-4 rounded-lg transition duration-300 hover:bg-gray-700">
                Edit Profile
              </Link>
            </li>
            <li>
              <Link to="/StudentJobApplication" className="text-white no-underline block p-3 rounded-lg transition duration-300 bg-gray-700">
                Apply
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white no-underline block p-3 rounded-lg transition duration-300 hover:bg-gray-700 w-full text-left"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Job Opportunities</h1>
        {renderMainContent()}
      </div>
    </div>
  );
};

export default StudentJobApplication;