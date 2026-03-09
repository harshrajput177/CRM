import React, { Suspense, lazy, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
// Lazy imports
const AdminForm = lazy(() => import("./Admin-Agent-forms/AdminForm"));
const Login = lazy(() => import("./LoginPage/Login"));
const Dashboard = lazy(() => import("./Dashboard/Dashboard"));
const HRM = lazy(() => import("./Dashboard/HRMDashboard/Admin-plateform-E/HRM-das"));
const FileUploader = lazy(() => import("./Dashboard/Droplead/Droplead"));
const LeadTable = lazy(() => import("./Dashboard/Callingleads/Callingleads"));
const ColumnSelector = lazy(() => import("./Dashboard/Callingleads/Selectlead-th"));
const SelectedTable = lazy(() => import("./Dashboard/Callingleads/AdminAssignLead"));
const AgentPage = lazy(() => import("./AgentsPage/AgentPage"));
const Agentleads = lazy(() => import("./Dashboard/Callingleads/agentleads"));
const RegisterUser = lazy(() => import("./LoginPage/Register"));
const CallLeadsPage = lazy(() => import("./AgentsPage/CallLeadPage"));
const DailyReport = lazy(() => import("./AgentsPage/WorkSession"));
const FileDisplay = lazy(() => import("./Admin-Agent-forms/RecentFile"));
const FollowUpSheet = lazy(() => import("./AgentsPage/FollowUp"));
const AssignedLeadsPage = lazy(() => import("./AgentsPage/ShowAssignLead"));
const InterestedLeads = lazy(() => import("./AgentsPage/Closedlead"));
const AgentDetails = lazy(() => import("./AgentsPage/AgentDetails"));
const WorkingSession = lazy(() => import("./AgentsPage/AgentWorking"));
const TotalResolvedLeads = lazy(() => import("./Admin-Agent-forms/AgentData/TotalResolvedLead"));
const FollowUpLeads = lazy(() => import("./Admin-Agent-forms/AgentData/FollowUpShowtoadmin"));
const ClosedLeads = lazy(() => import("./Admin-Agent-forms/AgentData/ClosedUpShowtoadmin"));
const TotalAssigend = lazy(() => import("./Admin-Agent-forms/AgentData/TotalAssignedLead"));
const Notifications = lazy(() => import("./AgentsPage/Notification"));
const AcdPage = lazy(() => import("./Admin-Agent-forms/AgentData/ACD"));
const AddLeadsPage = lazy(() => import("./AgentsPage/AddLeadPage"));

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <Router>

      {/* Suspense Loader */}
      <Suspense fallback={<div style={{textAlign:"center",marginTop:"50px"}}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<RegisterUser />} />
          <Route path="/HRM-Dashboard" element={<HRM />} />
          <Route path="/add-admin" element={<AdminForm />} />
          <Route path="/droplead" element={<FileUploader />} />
          <Route path="/leads" element={<LeadTable selectedFile={selectedFile} />} />
          <Route path="/CallLead" element={<CallLeadsPage />} />
          <Route path="/allagents" element={<AgentPage />} />
          <Route
            path="/selectlead"
            element={
              selectedFile && (
                <ColumnSelector
                  key={selectedFile._id}
                  selectedFile={selectedFile}
                />
              )
            }
          />
          <Route path="/total-resolved/:id" element={<TotalResolvedLeads />} />
          <Route path="/leadtable" element={<SelectedTable />} />
          <Route path="/agentleads" element={<Agentleads />} />
          <Route
            path="/all-Files"
            element={<FileDisplay onFileSelect={setSelectedFile} />}
          />
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
          <Route path="/Addlead-by-agent" element={<AddLeadsPage />} />
          <Route
            path="/AgentDashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;



