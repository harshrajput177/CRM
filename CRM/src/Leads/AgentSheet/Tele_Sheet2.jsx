// import React, { useEffect, useState } from "react";
// import "../Styles-CSS/SalesManager-CSS/Tele_Sheet_2.css";
// import { useNavigate } from "react-router-dom";

// function TeleSheet2() {
//   const [data, setData] = useState([]); // State to store fetched data
//   const [newTeamLead, setNewTeamLead] = useState(""); // State for new team lead input

//   // Fetch data from backend
//   useEffect(() => {
//     fetch("http://localhost:5000/api/form/get")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         return response.json();
//       })
//       .then((fetchedData) => {
//         setData(fetchedData); // Store the fetched data in state
//       })
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []); // Empty array ensures this runs only once after the initial render
  

//   const navigate = useNavigate();

//   const handleShowLead = () => {
//     navigate("/"); // Navigate to TeleSheet component
//   };

//   const handleUpdate = (id, field, value) => {
//     // Update the specific field in backend
//     fetch(`http://localhost:5000/api/form/update/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ [field]: value }),
//     })
//       .then((response) => response.json())
//       .then(() => {
//         // Update the data in the frontend
//         setData((prevData) =>
//           prevData.map((row) =>
//             row._id === id ? { ...row, [field]: value } : row
//           )
//         );
//       })
//       .catch((error) => console.error("Error updating data:", error));
//   };

//   const handleDelete = (id) => {
//     console.log("Deleting ID:", id); // Debug ID

//     fetch(`http://localhost:5000/api/form/delete/${id}`, {
//       method: "DELETE",
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to delete");
//         }
//         return response.json();
//       })
//       .then(() => {
//         console.log("Delete successful"); // Debug success
//         setData((prevData) => prevData.filter((row) => row._id !== id));
//       })
//       .catch((error) => console.error("Error deleting data:", error));
//   };

  
//   const handleAddTeamLead = () => {
//     if (newTeamLead.trim()) {
//       console.log("New Team Lead Created:", newTeamLead);
//       setNewTeamLead("");
//     }
//   };

//   const handleNavigateToNewPage = () => {
//     navigate("/add-agent"); // Navigate to new page for adding team lead
//   };

//   return (
//     <div className="Tele-Sheet-container">
//       <table>
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Source</th>
//             <th>Assigned</th>
//             <th>Review</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={index}>
//               <td>{new Date(row.createdAt).toLocaleDateString()}</td>
//               <td>{row.name}</td>
//               <td>{row.email}</td>
//               <td>{row.mobile}</td>
//               <td>
//                 <input
//                   type="text"
//                   value={row.source || ""}
//                   onChange={(e) =>
//                     handleUpdate(row._id, "source", e.target.value)
//                   }
//                 />
//               </td>
//               <td>
//                 <select
//                   value={row.assigned || ""}
//                   onChange={(e) =>
//                     handleUpdate(row._id, "assigned", e.target.value)
//                   }
//                 >
//                   <option value="">Select Team Lead</option>
//                   <option value="TL 1">TL 1</option>
//                   <option value="TL 2">TL 2</option>
//                   {/* Add more team leads dynamically */}
//                 </select>
//                 <button
//                   className="Tele-Sheet2-btn"
//                   onClick={handleNavigateToNewPage} // Redirect to the page for adding team lead
//                 >
//                   +
//                 </button>
//               </td>
//               <td>
//                 <button
//                   className="Tele-Sheet2-btn"
//                   onClick={() => console.log("Update Lead:", row._id)}
//                 >
//                   Update
//                 </button>
//               </td>
//               <td>
//                 <button
//                   className="Tele-Sheet2-btn delete-btn"
//                   onClick={() => handleDelete(row._id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div>
//         <input
//           type="text"
//           placeholder="Enter new team lead"
//           value={newTeamLead}
//           onChange={(e) => setNewTeamLead(e.target.value)}
//         />
//         <button className="ADD-BTN" onClick={handleAddTeamLead}>
//           Add Team Lead
//         </button>
//       </div>
//       <button className="btn" type="button" onClick={handleShowLead}>
//         Back
//       </button>
//     </div>
//   );
// }

// export default TeleSheet2;


