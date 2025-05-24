import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import StudentLogin from './components/StudentLogin';
import StudentDashboard from './components/StudentDashboard';
import CompanyLogin from './components/CompanyLogin';
import CompanyDashboard from './components/CompanyDashboard'
import StudentJobApplication from './components/StudentJobApplication';
function App() {
  return (
       <Router>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/student-login" element={<StudentLogin/>} />
        <Route path="/StudentDashboard" element={<StudentDashboard/>} />
        <Route path="/company-login" element={<CompanyLogin/>} />
       
        <Route path="/CompanyDashboard" element={<CompanyDashboard/>} />
        <Route path='/StudentJobApplication' element={<StudentJobApplication/>}/>
      </Routes>
    </Router>
  );
}

export default App;
