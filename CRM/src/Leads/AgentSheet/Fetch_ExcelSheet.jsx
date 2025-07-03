// import React, { useState } from "react";
// import Papa from "papaparse";

// const ExcelSheet = () => {
//   const [csvRawData, setCsvRawData] = useState(""); // Raw CSV as string
//   const [parsedData, setParsedData] = useState([]); // Parsed JSON data

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];

//     if (!file) {
//       alert("Please upload a file!");
//       return; 
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       // Send file to server
//       const response = await fetch("http://localhost:5000/upload-file", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("File upload failed!");
//       }

//       // Fetch raw CSV data as a string
//       const csvData = await response.text();

//       // Save raw CSV data in state for displaying as string
//       setCsvRawData(csvData);

//       // Parse CSV data using PapaParse
//       Papa.parse(csvData, {
//         complete: (result) => {
//           console.log("Parsed JSON Data:", result.data);
//           setParsedData(result.data); // Save parsed data in state
//         },
//         header: true, // Assumes the first row is the header
//       });
//     } catch (error) {
//       console.error("Error processing file:", error);
//       alert("There was an error processing the file. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h1>Upload Excel File</h1>
//       <input type="file" accept=".csv" onChange={handleFileUpload} />

//       {/* Display raw CSV data as string */}
//       <h2>Raw CSV Data (String):</h2>
//       <pre>{csvRawData || "No data yet"}</pre>

//       {/* Display parsed JSON data */}
//       <h2>Parsed Excel Data (JSON):</h2>
//       <pre>{JSON.stringify(parsedData, null, 2)}</pre>
//     </div>
//   );
// };

// export default ExcelSheet;















// import React, { useState } from "react";
// import Papa from "papaparse";

// const ExcelSheet = () => {
//   const [excelData, setExcelData] = useState([]);

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];

//     if (!file) {
//       alert("Please upload a file!");
//       return;
//     }

//     // Validate file type
//     if (!file.name.endsWith(".csv")) {
//       alert("Please upload a valid CSV file!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       // Send file to server
//       const response = await fetch("http://localhost:5000/upload-file", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("File upload failed!");
//       }

//       // Assuming server returns raw CSV as text
//       const csvData = await response.text(); // Use text() to get raw CSV data
//       console.log("Raw CSV Data:", csvData);

//       // Parse CSV data using PapaParse
//       Papa.parse(csvData, {
//         complete: (result) => {
//           console.log("Parsed JSON Data:", result);
//           if (result && result.data) {
//             setExcelData(result.data);
//           } else {
//             console.error("Error: No valid data parsed");
//           }
//         },
//         header: true, // Assumes the first row is the header
//         skipEmptyLines: true, // Skip empty lines in the CSV
//       });
//     } catch (error) {
//       console.error("Error processing file:", error);
//       alert("There was an error processing the file. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h1>Upload Excel File</h1>
//       <input type="file" accept=".csv" onChange={handleFileUpload} />
//       <h2>Excel Data:</h2>
//       <pre>{JSON.stringify(excelData, null, 2)}</pre>
//     </div>
//   );
// };

// export default ExcelSheet;
