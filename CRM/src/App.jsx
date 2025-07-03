import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Form from './Form';
// import TeleSheet from './Tele-Form/Agent_Sheet';
// import Form from './Tele-Form/Form';
// import ExcelSheet from './Tele-Form/Fetch_ExcelSheet';
// import AgentProfile from './AgentSheet/AgentProfile';
// import AgentForm from './AgentData/AgentForm';
// import TeleSheet2 from './AgentData/Tele_Sheet2';
// import AdminForm from './Admin/AdminForm';
import Login from './LoginPage/Login';
import Dashboard from './Dashboard/Dashboard';
// import FileUploader from './Dashboard/Droplead/Droplead';
import LandingPage from './LandingPage/Full_Landing_Page/Full_Landing_Page';
import HRM from './Dashboard/HRMDashboard/HRM-das';
// import Navbar from './LandingPage/Navbar/Navbar';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/fileuploader" element={<FileUploader />} /> */}
      <Route path="/Login" element={<Login />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/HRM-Dashboard" element={<HRM/>} />
      {/* <Route path="/tele-sheet" element={<TeleSheet />} />
      <Route path="/submit-Form" element={<ExcelSheet />} />
      <Route path="/tele-sheet2" element={<TeleSheet2 />} />
      <Route path="/add-agent" element={<AgentForm />} />
      <Route path="/add-admin" element={<AdminForm/>} />
      <Route path='/AgentProfile' element={<AgentProfile />} /> */}

    </Routes>
  </Router>
  );
}

export default App;





// import * as React from 'react';
// import Box from '@mui/material/Box';
// import RadioGroup from '@mui/material/RadioGroup';
// import Radio from '@mui/material/Radio';
// import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormLabel from '@mui/material/FormLabel';
// import { ThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';

// function MyApp() {
//   const { mode, setMode } = useColorScheme();
//   if (!mode) {
//     return null;
//   }
//   return (
//       <FormControl>
//         <RadioGroup
//           aria-labelledby="demo-theme-toggle"
//           name="theme-toggle"
//           row
//           value={mode}
//           onChange={(event) => setMode(event.target.value)}
//         >
//           <FormControlLabel value="light" control={<Radio />} label="Light" />
//           <FormControlLabel value="dark" control={<Radio />} label="Dark" />
//         </RadioGroup>
//       </FormControl>
//   );
// }

// const theme = createTheme({
//   colorSchemes: {
//     dark: true,
//   },
// });

// export default function ToggleColorMode() {
//   return (
//     <ThemeProvider theme={theme}>
//       <MyApp />
//     </ThemeProvider>
//   );
// }