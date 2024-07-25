// "use client";

// //not directly use the react-window
// import React, { useState, useRef } from "react";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Fab from "@mui/material/Fab";
// import Button from "@mui/material/Button";
// import * as XLSX from "xlsx";

// /**
//  * 목표 : 데이터는 SheetJS xlsx를 통해 불러온 다음 JSON으로 가공
//  * 이를 HansonTable을 통해서 유연하고 자연스러운 수정하기
//  */
// import {
//   AutoColumnSize,
//   Autofill,
//   ContextMenu,
//   CopyPaste,
//   DropdownMenu,
//   Filters,
//   HiddenRows,
//   registerPlugin,
// } from "handsontable/plugins";
// import {
//   CheckboxCellType,
//   NumericCellType,
//   registerCellType,
// } from "handsontable/cellTypes";
// import "@handsontable/react";
// import { HotTable, HotColumn } from "@handsontable/react";
// import "pikaday/css/pikaday.css";
// import "handsontable/dist/handsontable.full.css";
// // 행렬 조작을 위한 jsx file 소환
// import { addClassesToRows, alignHeaders } from "./test/hooksCallbacks";

// import Handsontable from "handsontable";

// registerCellType(CheckboxCellType);
// registerCellType(NumericCellType);

// registerPlugin(AutoColumnSize);
// registerPlugin(Autofill);
// registerPlugin(ContextMenu);
// registerPlugin(CopyPaste);
// registerPlugin(DropdownMenu);
// registerPlugin(Filters);
// registerPlugin(HiddenRows);

// //Starting point of Excel control
// const ExcelImport = () => {
//   const [tableData, setTableData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [isChoosingColumn, setIsChoosingColumn] = useState(false);
//   const hotTableRef = useRef(null); // Reference to the Handsontable instance

//   // Json 형태로 바꿔주는 메서드
//   const convertToArrayOfArrays = (data) => {
//     setTableData(data);
//     return data;
//   };

//   // 엑셀 불러오기
//   const importExcel = (input) => {
//     let file;
//     if (input.target && input.target.files) {
//       file = input.target.files[0];
//     } else {
//       file = input;
//     }

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const bstr = event.target.result;
//       const workBook = XLSX.read(bstr, { type: "binary" });
//       const workSheetName = workBook.SheetNames[0];
//       const workSheet = workBook.Sheets[workSheetName];
//       const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
//       const headers = fileData[0];
//       const formattedColumns = headers.map((head) => ({
//         name: head,
//         label: head,
//       }));
//       setColumns(formattedColumns);
//       fileData.splice(0, 1);
//       convertToArrayOfArrays(fileData);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const downloadExcel = () => {
//     const worksheet = XLSX.utils.aoa_to_sheet([
//       columns.map((col) => col.label),
//       ...tableData,
//     ]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, "ADN_project엑셀테스트.xlsx");
//   };

//   const loadLocalExcel = async () => {
//     const response = await fetch("/excel/Uniqlo.xlsx");
//     const data = await response.arrayBuffer();
//     const file = new File([data], "Uniqlo.xlsx", {
//       type: "application/vnd.ms-excel",
//     });
//     importExcel(file);
//   };
//   let columnCounter = 0;

//   const applyColumnColor = (columnIndex) => {
//     const hotInstance = hotTableRef.current.hotInstance;

//     hotInstance.batch(() => {
//       tableData.forEach((row, rowIndex) => {
//         hotInstance.setCellMeta(
//           rowIndex,
//           columnIndex,
//           "className",
//           `background-color-${columnIndex}`
//         );
//       });
//     });

//     const styleElement = document.createElement("style");
//     styleElement.textContent = `.background-color-${columnIndex} { background-color: blue !important; }`;
//     document.head.append(styleElement);

//     hotInstance.render();
//   };

//   const handleColumnClick = (event, coords) => {
//     if (isChoosingColumn) {
//       applyColumnColor(coords.col);
//       columnCounter++;

//       if (columnCounter >= 4) {
//         setIsChoosingColumn(false);
//         columnCounter = 0; // Reset the counter
//       }
//     }
//   };

//   // Assuming there's a button action that sets `isChoosingColumn` to true
//   const startChoosingColumns = () => {
//     setIsChoosingColumn(true);
//     columnCounter = 0; // Reset counter when starting a new action
//   };

//   return (
//     <div style={{ marginBottom: "1%", margin: "2%" }}>
//       <div>
//         <h1>Excel 가져오기</h1>
//       </div>
//       {isChoosingColumn && (
//         <div style={{ color: "red", fontWeight: "bold" }}>
//           Choose the column that you want
//         </div>
//       )}
//       <div>
//         <div>
//           <label htmlFor="upload-photo">
//             <input
//               required
//               style={{ display: "none" }}
//               id="upload-photo"
//               name="upload_photo"
//               type="file"
//               onChange={importExcel}
//             />
//             <Fab
//               color="primary"
//               size="small"
//               component="span"
//               aria-label="add"
//               variant="extended"
//             >
//               문서 업로드
//             </Fab>
//           </label>
//         </div>
//         <Grid item xs={6} md={4}>
//           <Button variant="contained" color="secondary" onClick={downloadExcel}>
//             Excel 다운로드
//           </Button>
//           <Button variant="contained" color="primary" onClick={loadLocalExcel}>
//             로컬 엑셀 파일 불러오기
//           </Button>
//         </Grid>
//         <Grid item xs={6} md={4}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => {
//               setIsChoosingColumn(true);
//             }}
//           >
//             컬럼 색상 변경
//           </Button>
//         </Grid>
//       </div>
//       <div>
//         <HotTable
//           ref={hotTableRef}
//           data={tableData}
//           colHeaders={columns.map((col) => col.label)}
//           dropdownMenu={true}
//           hiddenColumns={{
//             indicators: true,
//           }}
//           contextMenu={true}
//           multiColumnSorting={true}
//           filters={true}
//           rowHeaders={true}
//           autoWrapCol={true}
//           autoWrapRow={true}
//           afterGetColHeader={alignHeaders}
//           beforeRenderer={addClassesToRows}
//           manualRowMove={true}
//           navigableHeaders={true}
//           licenseKey="non-commercial-and-evaluation"
//           afterOnCellMouseDown={handleColumnClick}
//         />
//       </div>
//     </div>
//   );
// };

// export default ExcelImport;
