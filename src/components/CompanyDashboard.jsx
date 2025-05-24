"use client";
import * as XLSX from 'xlsx';
import { useState, useRef, useEffect } from 'react';
import { 
  BriefcaseIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  UserIcon,
  PlusIcon,
  DocumentTextIcon,
  UsersIcon,
  CalendarIcon,
  LocationMarkerIcon,
  CurrencyDollarIcon,
  ClockIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilAltIcon,
  EyeIcon,
  ClockIcon as ClockOutlineIcon
} from '@heroicons/react/outline';

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] =  useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [currentUser, setCurrentUser] = useState({ role: 'student', id: 's1' }); 
  const [companyInfo, setCompanyInfo] = useState({
    name: 'MERI',
    logo: '',
    description: 'Leading tech company specializing in AI solutions'
  });
  const [filterCriteria, setFilterCriteria] = useState({
    minPercentage: 60,
    status: 'all'
  });

  // Initialize from localStorage
  useEffect(() => {
    const savedApplications = localStorage.getItem('companyApplications');
    const savedJobs = localStorage.getItem('companyJobs');
    
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
    
    if (savedJobs) {
      setJobPostings(JSON.parse(savedJobs));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('companyApplications', JSON.stringify(applications));
    localStorage.setItem('companyJobs', JSON.stringify(jobPostings));
  }, [applications, jobPostings]);

  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    skills: [],
    salaryMin: '',
    salaryMax: '',
    jobType: 'full-time',
    location: '',
    remote: false,
    deadline: '',
    experience: 'mid',
    company: companyInfo.name
  });

  const handlePostJob = (e) => {
    e.preventDefault();
    const postedJob = {
      ...newJob,
    id: Date.now().toString(), // Ensure ID is string for consistency
    applications: 0,
    status: 'active',
    postedDate: new Date().toISOString(),
    deadline: newJob.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    company: companyInfo.name,
    };
   
    
    // Save to company's job postings
    setJobPostings([...jobPostings, postedJob]);
    
    // Also save to global jobs list that students can see
    const allJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
    localStorage.setItem('postedJobs', JSON.stringify([...allJobs, postedJob]));
    
    // Reset form
    setNewJob({
      title: '',
      description: '',
      skills: [],
      salaryMin: '',
      salaryMax: '',
      jobType: 'full-time',
      location: '',
      remote: false,
      deadline: '',
      experience: 'entry',
      company: companyInfo.name
    });
      
    setActiveTab('dashboard');
  };

  const handleUpdateJob = (updatedJob) => {
    const updatedJobs = jobPostings.map(job => 
      job.id === updatedJob.id ? updatedJob : job
    );
    setJobPostings(updatedJobs);
    setIsEditModalOpen(false);
  };

  const handleSkillChange = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setNewJob({
        ...newJob,
        skills: [...newJob.skills, e.target.value]
      });
      e.target.value = '';
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = [...newJob.skills];
    updatedSkills.splice(index, 1);
    setNewJob({ ...newJob, skills: updatedSkills });
  };

  // Calculate stats for dashboard
  const calculateStats = () => {
    const activeJobs = jobPostings.filter(job => job.status === 'active').length;
    
    const newApplications = applications.filter(app => 
      app.status === 'pending'
    ).length;
    
    const interviews = applications.filter(app => 
      app.status === 'interviewed'
    ).length;
    
    return { activeJobs, newApplications, interviews };
  };

  const stats = calculateStats();

  const DashboardView = ({ companyInfo, 
    jobPostings, 
    setActiveTab,
    applications }) => {
    const [applicationCounts, setApplicationCounts] = useState({});
    const [viewingJob, setViewingJob] = useState(null);
    const [editingJob, setEditingJob] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [viewingJd, setViewingJd] = useState(null);
    useEffect(() => {
      const counts = {};
      applications.forEach(app => {
        counts[app.jobId] = (counts[app.jobId] || 0) + 1;
      });
      setApplicationCounts(counts);
    }, [applications]);

    const handleViewJob = (job) => {
      setViewingJob(job);
    };
    const handleViewJd = (jdFile) => {
      setViewingJd(jdFile);
    };
  
    const handleEditJob = (job) => {
      setEditingJob(job);
      setIsEditModalOpen(true);
    };

    const handleCloseModals = () => {
      // setIsViewModalOpen(false);
      setIsEditModalOpen(false);
      setViewingJob(null);
      setEditingJob(null);
    };
    const calculateStats = () => {
      const activeJobs = jobPostings.filter(job => job.status === 'active').length;
      const newApplications = applications.filter(app => app.status === 'pending').length;
      const interviews = applications.filter(app => app.status === 'interviewed').length;
      return { activeJobs, newApplications, interviews };
    };
  
    const stats = calculateStats();
    return (
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {companyInfo.name}</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-50">
                <BriefcaseIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">New Applications</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.newApplications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Interviews</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.interviews}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-medium text-lg">Recent Job Postings</h2>
            <button 
              onClick={() => setActiveTab('postJob')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
              New Job
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobPostings.length > 0 ? (
                  jobPostings.map((job) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.jobType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{applicationCounts[job.id] || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.deadline || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {/* <button 
                          onClick={() => handleViewJob(job)} 
                          className="text-gray-600 hover:text-gray-900 mr-3"
                        >
                          <EyeIcon className="h-4 w-4 inline mr-1" /> View
                        </button> */}
                        <button 
                          onClick={() => handleEditJob(job)} 
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <PencilAltIcon className="h-4 w-4 inline mr-1" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No job postings yet. <button onClick={() => setActiveTab('postJob')} className="text-gray-600 hover:text-gray-800 font-medium">Create your first job posting</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
       {/* View Job Modal */}
       {isViewModalOpen && viewingJob && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{viewingJob.title}</h3>
                <button
                  onClick={handleCloseModals}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Job Type</h4>
                    <p className="mt-1 text-sm text-gray-900">{viewingJob.jobType}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Experience Level</h4>
                    <p className="mt-1 text-sm text-gray-900">{viewingJob.experience}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Location</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewingJob.location} {viewingJob.remote && '(Remote)'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Salary Range</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewingJob.salaryMin && viewingJob.salaryMax 
                      ? `${viewingJob.salaryMin} - ${viewingJob.salaryMax} LPA`
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{viewingJob.description}</p>
                </div>
                {viewingJob.skills?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Required Skills</h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {viewingJob.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {viewingJob.jdFile && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Job Description File</h4>
                    <a 
                      href={viewingJob.jdFile} 
                      download={`${viewingJob.title.replace(/\s+/g, '_')}_JD`}
                      className="inline-flex items-center mt-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      Download Job Description
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {isEditModalOpen && editingJob && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Edit Job: {editingJob.title}</h3>
                <button
                  onClick={handleCloseModals}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-4">
                <PostJobView 
                  newJob={editingJob}
                  setNewJob={handleUpdateJob}
                  handlePostJob={(e) => {
                    e.preventDefault();
                    handleCloseModals();
                  }}
                  handleSkillChange={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      setEditingJob({
                        ...editingJob,
                        skills: [...editingJob.skills, e.target.value]
                      });
                      e.target.value = '';
                    }
                  }}
                  removeSkill={(index) => {
                    const updatedSkills = [...editingJob.skills];
                    updatedSkills.splice(index, 1);
                    setEditingJob({ ...editingJob, skills: updatedSkills });
                  }}
                  isEditing={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
  const [formErrors, setFormErrors] = useState({
    title: false,
    description: false,
    jdFile: false
  });
  
  const validateForm = () => {
    const errors = {
      title: !newJob.title,
      description: !newJob.description,
      // jdFile: !jdFile
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };
  const PostJobView = ({ 
    newJob, 
    setNewJob, 
    handlePostJob, 
    handleSkillChange,
    removeSkill,
    isEditing = false 
  }) => {
    const fileInputRef = useRef(null);
    const [jdFile, setJdFile] = useState(null);
    const [jdPreview, setJdPreview] = useState(null);

    const handleSalaryChange = (e, field) => {
      const value = e.target.value;
      if (/^\d*\.?\d*$/.test(value)) {
        setNewJob({...newJob, [field]: value});
      }
    };
 
      // const [jdFile, setJdFile] = useState(null);
      // const fileInputRef = useRef(null);

    const handleJdUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
          alert('Please upload a PDF, DOC, or DOCX file');
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          alert('File size too large (max 5MB)');
          return;
        }

        setJdFile(file);
        setJdPreview(URL.createObjectURL(file));
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewJob({
            ...newJob,
            jdFile: event.target.result, // This stores the base64 encoded file
            jdFileName: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    };

  
    const removeJdFile = () => {
      setNewJob({
        ...newJob,
        jdFile: null,
        jdFileName: ''
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Edit Job Posting' : 'Post New Job'}
        </h1>
        
        <form onSubmit={handlePostJob} className="bg-white shadow-sm border border-gray-100 p-6">
          <div className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                required
              />
            </div>
            
            {/* Job Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                id="description"
                rows={5}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                value={newJob.description}
                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                required
              />
            </div>
            
 {/* Job Description */}

          
          {/* JD File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Job Description (JD File) *
            </label>
            {newJob.jdFile ? (
  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
    <div className="flex items-center">
      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
      <span className="text-sm font-medium">{newJob.jdFileName}</span>
      {/* <span className="text-xs text-gray-500 ml-2">
        ({(jdFile.size / 1024).toFixed(2)} KB)
      </span> */}
    </div>
    <button
      type="button"
      onClick={removeJdFile}
      className="text-red-500 hover:text-red-700"
    >
      <XCircleIcon className="h-5 w-5" />
    </button>
  </div>
) : (
  <div className="flex items-center justify-center w-full">
  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
    <div className="flex flex-col items-center justify-center pt-5 pb-6">
      <DocumentTextIcon className="h-8 w-8 text-gray-400 mb-2" />
      <p className="mb-2 text-sm text-gray-500">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-500">PDF, DOC, or DOCX (MAX. 5MB)</p>
    </div>
    <input
      ref={fileInputRef}
      type="file"
      className="hidden"
      accept=".pdf,.doc,.docx"
      onChange={handleJdUpload}
      required={!isEditing}
    />
  </label>
</div>
)}
            <p className="mt-1 text-xs text-gray-500">
              Upload the complete job description document. This will be visible to applicants.
            </p>
          </div>

            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newJob.skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-1.5 inline-flex text-gray-400 hover:text-gray-500"
                    >
                      <XCircleIcon className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                id="skills"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                placeholder="Type skill and press Enter"
                onKeyDown={handleSkillChange}
              />
            </div>
            
            {/* Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Salary (LPA)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="salaryMin"
                    className="block w-full pl-3 pr-12 border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                    placeholder="e.g. 6.5"
                    value={newJob.salaryMin}
                    onChange={(e) => handleSalaryChange(e, 'salaryMin')}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">LPA</span>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Salary (LPA)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="salaryMax"
                    className="block w-full pl-3 pr-12 border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                    placeholder="e.g. 10.5"
                    value={newJob.salaryMax}
                    onChange={(e) => handleSalaryChange(e, 'salaryMax')}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">LPA</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Job Type and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Type */}
              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  id="jobType"
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                  value={newJob.jobType}
                  onChange={(e) => setNewJob({...newJob, jobType: e.target.value})}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              
              {/* Experience Level */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  id="experience"
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                  value={newJob.experience}
                  onChange={(e) => setNewJob({...newJob, experience: e.target.value})}
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>
            
            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LocationMarkerIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <div className="flex items-center h-10">
                  <input
                    id="remote"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                    checked={newJob.remote}
                    onChange={(e) => setNewJob({...newJob, remote: e.target.checked})}
                  />
                  <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
                    Remote position
                  </label>
                </div>
              </div>
            </div>
            
            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                Application Deadline
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="deadline"
                  className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                  value={newJob.deadline}
                  onChange={(e) => setNewJob({...newJob, deadline: e.target.value})}
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
                {isEditing ? 'Update Job' : 'Post Job'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const ApplicationsView = () => {
    const [applications, setApplications] = useState([]);
    const [selectedJob, setSelectedJob] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPercentage, setFilterPercentage] = useState(60);
    useEffect(() => {
      // Load applications specific to this company
      const companyId = companyInfo.id; // Make sure companyInfo has an id
      const companyApplications = localStorage.getItem(
        `companyApplications_${companyId}`
      );
      if (companyApplications) {
        setApplications(JSON.parse(companyApplications));
      }
    }, [companyInfo.id]);
  
  
    // Filter applications based on selected job, search term, and percentage
    const filteredApplications = applications.filter(app => {
      const matchesJob = selectedJob === 'all' || app.jobTitle === selectedJob;
      const matchesSearch = 
        app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.studentSkills && app.studentSkills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      const matchesPercentage = app.studentCgpa && 
        (parseFloat(app.studentCgpa) * 10) >= filterPercentage;
      
      return matchesJob && matchesSearch && matchesPercentage;
    });

    // Export to Excel function
    const exportToExcel = () => {
      const data = filteredApplications.map(app => ({
        'Name': app.studentName,
        'Email': app.studentEmail,
        'Roll Number': app.studentRollno || 'N/A',
        'College': app.studentCollege || 'N/A',
        'Course': app.studentCourse || 'N/A',
        'CGPA': app.studentCgpa || 'N/A',
        'Percentage': app.studentCgpa ? (parseFloat(app.studentCgpa) * 10).toFixed(2) + '%' : 'N/A',
        'Skills': app.studentSkills ? app.studentSkills.join(', ') : 'N/A',
        'Applied For': app.jobTitle,
        'Company': app.company,
        'Applied Date': app.appliedDate,
        'Status': app.status
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
      XLSX.writeFile(workbook, `${companyInfo.name.replace(/\s+/g, '_')}_Applications.xlsx`);
    };

    // Update application status
    const updateApplicationStatus = (applicationId, newStatus) => {
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      setApplications(updatedApplications);
      
      // Also update in student's applications
      const application = applications.find(app => app.id === applicationId);
      if (application) {
        const studentApplications = JSON.parse(
          localStorage.getItem(`studentApplications_${application.studentEmail}`) || '[]'
        );
        const updatedStudentApplications = studentApplications.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        );
        localStorage.setItem(
          `studentApplications_${application.studentEmail}`,
          JSON.stringify(updatedStudentApplications)
        );
      }
    };

    // View resume function
    const viewResume = (resumeUrl) => {
      if (resumeUrl) {
        window.open(resumeUrl, '_blank');
      } else {
        alert('Resume not available');
      }
    };

    // Status badge component
    const getStatusBadge = (status) => {
      const statusClasses = {
        pending: 'bg-yellow-100 text-yellow-800',
        reviewed: 'bg-blue-100 text-blue-800',
        interviewed: 'bg-purple-100 text-purple-800',
        rejected: 'bg-red-100 text-red-800',
        hired: 'bg-green-100 text-green-800'
      };
      return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    };

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Applications</h1>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
            Export to Excel
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Job</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <option value="all">All Jobs</option>
                {[...new Set(applications.map(app => app.jobTitle))].map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Percentage</label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filterPercentage}
                  onChange={(e) => setFilterPercentage(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">{filterPercentage}%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search applications..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{app.studentName}</div>
                            <div className="text-sm text-gray-500">{app.studentEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.jobTitle}</div>
                        <div className="text-sm text-gray-500">{app.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.studentCollege || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.studentCgpa ? (parseFloat(app.studentCgpa) * 10).toFixed(2) + '%' : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {app.studentSkills?.map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.appliedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewResume(app.resumeUrl)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Resume
                          </button>
                          <select
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                            className="border-gray-300 rounded text-sm focus:ring-gray-500 focus:border-gray-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      No applications found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const Logout = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
 
    const handleLogout = () => {
      setIsLoggingOut(true);
      setTimeout(() => {
        window.location.href = '/'; 
      }, 1000);
    };
 
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
          <UserIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Logout</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to logout?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-800 text-white">
          <div className="flex items-center h-16 px-4">
            <h1 className="text-xl font-bold">RecruitHub</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'dashboard' ? 'bg-gray-900' : 'hover:bg-gray-600'}`}
            >
              <BriefcaseIcon className="h-5 w-5 mr-3" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('postJob')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'postJob' ? 'bg-gray-800' : 'hover:bg-gray-600'}`}
            >
              <PlusIcon className="h-5 w-5 mr-3" />
              Post New Job
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'applications' ? 'bg-gray-800' : 'hover:bg-gray-600'}`}
            >
              <UsersIcon className="h-5 w-5 mr-3" />
              Applications
            </button>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => setActiveTab('logout')}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-gray-700"
            >
              <XCircleIcon className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100">
                <BriefcaseIcon className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-medium text-gray-900 ml-2">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'postJob' && 'Post New Job'}
                {activeTab === 'applications' && 'Applications'}
                {activeTab === 'logout' && 'Logout'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{companyInfo.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === 'dashboard' && (
            <DashboardView 
            companyInfo={companyInfo} 
            jobPostings={jobPostings} 
            setActiveTab={setActiveTab}
            applications={applications}
            setIsEditModalOpen={setIsEditModalOpen}
            setEditingJob={setEditingJob} 
            />
          )}
          {activeTab === 'postJob' && (
            <PostJobView 
              newJob={newJob} 
              setNewJob={setNewJob} 
              handlePostJob={handlePostJob} 
              handleSkillChange={handleSkillChange} 
              removeSkill={removeSkill} 
            />
          )}
          {activeTab === 'applications' && (
            <ApplicationsView applications={applications} />
          )}
          {activeTab === 'logout' && <Logout />}
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;