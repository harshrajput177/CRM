// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AgentProfile = () => {
//   const [agent, setAgent] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//   });

//   const [isEditing, setIsEditing] = useState(false);

//   // Fetch Agent Profile
//   useEffect(() => {
//     const fetchAgent = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:8181/api/agent/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAgent(response.data);
//         setFormData({
//           name: response.data.name,
//           email: response.data.email,
//           phone: response.data.phone,
//           role: response.data.role,
//         });
//       } catch (error) {
//         console.error("Error fetching agent profile", error);
//       }
//     };
//     fetchAgent();
//   }, []);

//   // Handle Form Change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Update Profile
//   const updateProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(`http://localhost:8181/api/agent/${agent._id}`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Profile updated successfully!");
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error updating profile", error);
//     }
//   };

//   // Delete Profile
//   const deleteProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:8181/api/agent/${agent._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Profile deleted successfully!");
//       setAgent(null);
//     } catch (error) {
//       console.error("Error deleting profile", error);
//     }
//   };

//   if (!agent) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>Agent Profile</h2>
//       {isEditing ? (
//         <form>
//           <label>
//             Name:
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//             />
//           </label>
//           <label>
//             Email:
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </label>
//           <label>
//             Phone:
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//             />
//           </label>
//           <label>
//             Role:
//             <input
//               type="text"
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//             />
//           </label>
//           <button type="button" onClick={updateProfile}>
//             Save Changes
//           </button>
//         </form>
//       ) : (
//         <div>
//           <p>Name: {agent.name}</p>
//           <p>Email: {agent.email}</p>
//           <p>Phone: {agent.phone}</p>
//           <p>Role: {agent.role}</p>
//           <button onClick={() => setIsEditing(true)}>Edit</button>
//           <button onClick={deleteProfile}>Delete Profile</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AgentProfile;
