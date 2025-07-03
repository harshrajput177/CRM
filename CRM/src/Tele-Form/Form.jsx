// import React, { useState } from 'react';
// import { useNavigate } from "react-router-dom"; 
// import axios from 'axios';
// import AttachmentIcon from '@mui/icons-material/Attachment';
// import  '../Styles-CSS/Form.css';

// function Form() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const navigate = useNavigate(); 

//   const handleShowLead = () => {
//     navigate("/tele-sheet"); // Navigate to TeleSheet component
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/form/post', formData);
//       alert('Data Submitted Successfully');
//       console.log(response.data);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }

//     setFormData({
//       name: '',
//       email: '',
//       mobile: '',

//     })
//   };

//   return (
//     <div className='Sales-Form-Container'>
//     <div   className='Sales-form' style={{ padding: '20px' }}>
//       <h1>Create Lead</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Name:
//           <input type="text" name="name" value={formData.name} onChange={handleChange} required />
//         </label>
//         <br />
//         <label>
//           Email:
//           <input type="email" name="email" value={formData.email} onChange={handleChange} required />
//         </label>
//         <br />
//         <label>
//           Mobile:
//           <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
//         </label>
//         <br />
//         <button type="submit">Submit</button>
//         <br />
//         <br />
//         <button className='Showlead-btn' type='button' onClick={handleShowLead}>Show Lead</button>
//       </form>
//     </div>
//     <div>
//       <h1>Drop Excel File</h1>
//              <input  className='input-Color' type="text" 
//         />
//          <AttachmentIcon />
//       </div>
//     </div>
//   );
// }
// export default Form;
