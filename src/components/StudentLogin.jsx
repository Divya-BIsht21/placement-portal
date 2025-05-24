import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../images/logimg.png';

const StudentLogin = () => {
  const studentCredentials = {
    username: "student123",
    password: "password123",
  };
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Entered:', username, password);
    console.log('Expected:', studentCredentials.username, studentCredentials.password);
    
    // Validate credentials
    if (username === studentCredentials.username && password === studentCredentials.password) {
      // Store authentication state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentStudent', JSON.stringify({
        id: '123',
        name: 'Student User',
        email: 'student@example.com'
      }));
      
      // Navigate to dashboard
      navigate('/StudentDashboard');
      console.log('navigation called')
    } else {
      // Show error message
      setErrorMessage("Invalid username or password.");
    }
  };

  return (
    <div className="font-sans bg-gray-100 m-0 p-0 flex flex-row items-center justify-center h-screen">
      <img
        src={logoImg}
        alt="Student studying"
        className="w-82 h-92 mb-4 mr-10"
      />
      <div className="p-8 rounded-xl text-center w-80 ">
        <h1 className="text-3xl mb-2 text-gray-800">Ready to start your success story?</h1>
        <p className="text-sm text-gray-600 mb-5">log in to our website!</p>
        <form id="signup-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="username" className="block text-sm text-gray-800 mb-1">User name</label>
            <input
              type="text"
              id="username"
              className="block w-full outline-none border-0 border-b-2 border-gray-300 p-0 pb-1 focus:border-blue-500 focus:ring-0 sm:text-sm"
              placeholder="Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="text-left">
            <label htmlFor="password" className="block text-sm text-gray-800 mb-1">Password</label>
            <input
              type="password" 
              id="password" 
              placeholder="Your Password"
              required
              className="block w-full outline-none border-0 border-b-2 border-gray-300 p-0 pb-1 focus:border-blue-500 focus:ring-0 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              required
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="terms" className="text-sm text-gray-800 outline-none">I agree to the Terms & Conditions</label>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded text-base w-full mt-3 hover:bg-blue-700 transition-colors"
          >
            Log in
          </button>
        </form>
        {errorMessage && (
          <p id="error-message" className="text-red-500 text-sm mt-2">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentLogin;
