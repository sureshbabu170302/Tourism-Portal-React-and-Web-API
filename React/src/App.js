import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import About from './Components/About';
import Detail from './Components/Detail';
import Cards from './Components/Cards';
import Login from './Components/Login';
import AdminSignIn from './Components/AdminLogin';
import AgentSignIn from './Components/AgentLogin';
import SignUp from './Components/Register';
import AgentRegister from './Components/AgentRegister';
import { useNavigate } from 'react-router-dom';
import AdminPanel from './Components/AdminPanel';
import AgentPanel from './Components/AgentPanel';
import AdminPanelGallery from './Components/AdminPanelGallery';
import AgentBooking from './Components/AgentBooking';


function App() {
  return (
      <div className="App">  
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/UserSignup" element={<SignUp />} />
            <Route path="/AdminLogin" element={<AdminSignIn />} />
            <Route path="/AgentLogin" element={<AgentSignIn />} />
            <Route path="/AgentSignup" element={<AgentRegister />} />
            <Route path="/Admin" element={<AdminPanel />} />
            <Route path="/AdminGallery" element={<AdminPanelGallery />} />
            <Route path="/Agent" element={<AgentPanel />} />
            <Route path="/AgentBooking" element={<AgentBooking />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/About" element={<About/>} />
            <Route path="/Detail" element={<Detail />} />
            <Route path="/Cards" element={<Cards />} />
          </Routes>
      </BrowserRouter>
      </div>
  );
}

export default App;
