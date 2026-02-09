import React from 'react';
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Form } from "react-router-dom";
import AdminForm from './Admin-Agent-forms/AdminForm';
import Login from './LoginPage/Login';
import Dashboard from './Dashboard/Dashboard';
import HRM from './Dashboard/HRMDashboard/Admin-plateform-E/HRM-das';
import FileUploader from './Dashboard/Droplead/Droplead';
import LeadTable from './Dashboard/Callingleads/Callingleads';
import ColumnSelector from './Dashboard/Callingleads/Selectlead-th';
import SelectedTable from './Dashboard/Callingleads/AdminAssignLead';
import AgentPage from './AgentsPage/AgentPage';
import Agentleads from './Dashboard/Callingleads/agentleads';
import RegisterUser from './LoginPage/Register';
import CallLeadsPage from './AgentsPage/CallLeadPage';
import ProtectedRoute from "./ProtectedRoute";
import DailyReport from './AgentsPage/WorkSession';
import FileDisplay from './Admin-Agent-forms/RecentFile';
import FollowUpSheet from './AgentsPage/FollowUp';
import AssignedLeadsPage from './AgentsPage/ShowAssignLead';
import InterestedLeads from './AgentsPage/Closedlead';
import AgentDetails from './AgentsPage/AgentDetails';
import WorkingSession from './AgentsPage/AgentWorking';
import TotalResolvedLeads from './Admin-Agent-forms/AgentData/TotalResolvedLead';
import FollowUpLeads from './Admin-Agent-forms/AgentData/FollowUpShowtoadmin';
import ClosedLeads from './Admin-Agent-forms/AgentData/ClosedUpShowtoadmin';
import TotalAssigend from './Admin-Agent-forms/AgentData/TotalAssignedLead';
import Notifications from './AgentsPage/Notification';
import AcdPage from './Admin-Agent-forms/AgentData/ACD';
import AddLeadsPage from './AgentsPage/AddLeadPage';


function App() {
  const [selectedFile, setSelectedFile] = useState(null);


  return (
    <Router>
    <Routes>
      {/* <Route path="/" element={<LandingPage />} /> */}
      {/* <Route path="/fileuploader" element={<FileUploader />} /> */}
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<RegisterUser />} />
      <Route path="/HRM-Dashboard" element={<HRM/>} />
      {/* <Route path="/tele-sheet" element={<TeleSheet />} /> */}
      {/* <Route path="/submit-Form" element={<ExcelSheet />} /> */}
      {/* <Route path="/tele-sheet2" element={<TeleSheet2 />} /> */}
      <Route path="/add-admin" element={<AdminForm/>} />
      <Route path='/droplead' element={<FileUploader />} />
      <Route path='/leads' element={<LeadTable selectedFile={selectedFile} />} />
      <Route path='/CallLead' element={<CallLeadsPage />} />
      <Route path='/allagents' element={<AgentPage />} />
      <Route path='/selectlead' element={selectedFile && (
  <ColumnSelector 
    key={selectedFile._id}    
    selectedFile={selectedFile} 
  />
)
} />

  <Route
    path="/total-resolved/:id"
    element={<TotalResolvedLeads />}
  />
      <Route path="/leadtable" element={<SelectedTable />} />
      <Route path="/agentleads" element={<Agentleads />} />
      <Route path="/all-Files" element={<FileDisplay onFileSelect={setSelectedFile}  />} />
      <Route path="/WorkSession" element={<DailyReport />} />
        <Route path="/FollowUpSheet" element={<FollowUpSheet />} />
         <Route path="/Show_total_leads" element={<AssignedLeadsPage />} />
         <Route path="/interested-leads" element={<InterestedLeads />} />
        <Route path="/agent-details/:id" element={<AgentDetails />} />
 <Route path="/working-duration/:id" element={<WorkingSession />} />
 <Route path="/follow-up/:id" element={<FollowUpLeads />} />
<Route path="/closed-leads/:id" element={<ClosedLeads />} />
<Route path="/total-assigned/:id" element={<TotalAssigend />} />
<Route path="/notifications" element={<Notifications />} />
<Route path="/acd/:id" element={<AcdPage />} />
<Route  path='/Addlead-by-agent' element={<AddLeadsPage />}/>

      <Route
          path="/AgentDashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
    </Routes>
  </Router>
  );
}

export default App;



