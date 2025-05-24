import React from 'react';
import { Link } from 'react-router-dom';

const PlacementPortal = () => {
  const filterJobs = (course) => {
    console.log(`Filtering jobs for ${course}`);
    // Implement your job filtering logic here
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-5 flex justify-between items-center">
  <h1 className="text-xl font-bold">Placement Portal</h1>
  <ul className="flex space-x-6">
    <li><Link to="/" className="font-bold hover:text-blue-200">Home</Link></li>
    <li><Link to="/student-login" className="font-bold hover:text-blue-200">Student Registration</Link></li>
    <li><Link to="/company-login" className="font-bold hover:text-blue-200">Post a Job</Link></li>
  </ul>
</nav>

      {/* Main Content */}
      <header className="bg-white py-10 px-8 shadow-md">
        <div className="container mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to the Placement Portal</h1>
          <p className="text-gray-600 text-lg">Find the best opportunities based on your course.</p>
          
          {/* Login Buttons */}
          <div className="mt-8 mb-12">
            <h1 className="text-2xl font-bold mb-4">Welcome to Placement Portal</h1>
            <div className="flex justify-center space-x-4">
              <Link to="/student-login" className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition duration-300">
                Student Login
              </Link>
              <Link to="/company-login" className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition duration-300">
                Company Login
              </Link>
            </div>
          </div>

          {/* Course Selection */}
          <section className="my-8">
            <h2 className="tegrayx9 font-semibold mb-6">Your Course</h2>
            <ul className="flex flex-wrap justify-center gap-3">
              {['BCA', 'BBA', 'BCOM (Hons)', 'MBA', 'B-tech'].map((course) => (
                <li 
                  key={course}
                  onClick={() => filterJobs(course)}
                  className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-md cursor-pointer transition duration-300"
                >
                  {course}
                </li>
              ))}
            </ul>
          </section>

          {/* Job Openings */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Upcoming Placements</h2>
            <div className="overflow-x-auto">
              <table className="w-full md:w-4/5 mx-auto bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">Abc</td>
                    <td className="py-3 px-4">Software Engineer</td>
                    <td className="py-3 px-4">April 15, 2025</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">TCS</td>
                    <td className="py-3 px-4">Business Analyst</td>
                    <td className="py-3 px-4">Apri 20, 2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </header>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <section className="container mx-auto text-center">
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="mb-1">Email: <a href="mailto:placement@college.edu" className="hover:underline">placement@college.edu</a></p>
          <p className="mb-3">Phone: +91 9876543210</p>
          <p>&copy; since 2004 By Divya Bisht</p>
        </section>
      </footer>
    </div>
  );
};

export default PlacementPortal;