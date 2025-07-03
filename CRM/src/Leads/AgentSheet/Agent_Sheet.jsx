// import React, { useEffect, useState } from "react";
// import '../Styles-CSS/Tele_Sheet.css';
// import { useNavigate } from "react-router-dom"; 

// function TeleSheet() {
//   const [data, setData] = useState([]); // State to store fetched data


//   // Fetch data from backend
//   useEffect(() => {
//     fetch("http://localhost:5000/api/form/get") // Replace with your API endpoint
//       .then((response) => response.json())
//       .then((fetchedData) => setData(fetchedData)) // Store fetched data in state
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);

//   const navigate = useNavigate(); 

//   const handleShowLead = () => {
//     navigate("/"); // Navigate to TeleSheet component
//   };

//   return (
//     <div className="container">
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Remarks</th>
//             <th>Status</th>
//             <th>Private</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={index}>
//               <td>{row.name}</td>
//               <td>{row.email}</td>
//               <td>{row.mobile}</td> {/* Backend field should match */}
//               <td>{row.remarks || "N/A"}</td>
//               <td>{row.status || "Pending"}</td>
//               <td>{row.private || "No"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <button className="btn"  type="button" onClick={handleShowLead} >Back</button>
//     </div>
//   );
// }

// export default TeleSheet;

    
    