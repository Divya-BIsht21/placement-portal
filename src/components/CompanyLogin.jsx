import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import logoImg from '../images/companydemoimg-removebg-preview.png';

const CompanyLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    console.log('Company Login:', { email, password });
    // Implement login logic here
    // On successful login:
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/CompanyDashboard');
    console.log('Navigate called');
  };

  return (
    <div className="font-sans bg-gray-100 flex flex-col md:flex-row items-center justify-center min-h-screen p-4">
      <img src={logoImg} alt="Company Logo" className="w-58 h-72 md:w-94 md:h-70 mb-8 md:mb-0 md:mr-10"
      />
      
      <div className="p-8 w-full max-w-md">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Company Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-800">
              I agree to the <a href="/" className="text-blue-600 hover:underline">Terms & Conditions</a>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={!agreeToTerms}
          >
            Login
          </button>
        </form>

 
      </div>
    </div>
  );
};

export default CompanyLogin;