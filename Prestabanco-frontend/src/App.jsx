import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from './components/Home';
import EmployeeList from './components/EmployeesList';
import AddEditEmployee from './components/AddEditEmployee';
import ExtraHoursList from './components/ExtraHoursList';
import AddEditExtraHours from './components/AddEditExtraHours';
import NotFound from './components/NotFound';
import PaycheckList from './components/PaycheckList';
import PaycheckCalculate from './components/PaycheckCalculate';
import SimulateCredit from './components/SimulateCredit';
import CreditApplication from './components/CreditApplication';
import UserRegister from './components/UserRegister';
import UserLogin from './components/UserLogin';
import CreditEvaluation from './components/CreditEvaluation';
import FollowCredits from './components/FollowCredits';

function App() {
  return (
      <Router>
          <div className="container">
          <Navbar></Navbar>
            <Routes>
              <Route path="/home" element={<Home/>} />
              <Route path="/credits/simulate" element={<SimulateCredit/>} />
              <Route path="/credits/create?userId=${userId}" element={<CreditApplication/>} />
              <Route path="/credits/getAll" element={<CreditEvaluation/>} />
              <Route path="/user/register" element={<UserRegister/>} />
              <Route path="/user/login" element={<UserLogin/>} />
              <Route path="/credits/create/:userId" element={<CreditApplication />} />
              <Route path="/credits/follow" element={<FollowCredits />} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </div>
      </Router>
  );
}

export default App
