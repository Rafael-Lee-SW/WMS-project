"use client";

//not directly use the react-window
import React, { useState, useCallback, useRef } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import * as XLSX from "xlsx";

/**
 * 목표 : 데이터는 SheetJS xlsx를 통해 불러온 다음 JSON으로 가공
 * 이를 HansonTable을 통해서 유연하고 자연스러운 수정하기
 */
import {
  AutoColumnSize,
  Autofill,
  ContextMenu,
  CopyPaste,
  DropdownMenu,
  Filters,
  HiddenRows,
  registerPlugin,
} from "handsontable/plugins";
import {
  CheckboxCellType,
  NumericCellType,
  registerCellType,
} from "handsontable/cellTypes";
import { HotTable, HotColumn } from "@handsontable/react";
import 'handsontable/dist/handsontable.full.css';

registerCellType(CheckboxCellType);
registerCellType(NumericCellType);

registerPlugin(AutoColumnSize);
registerPlugin(Autofill);
registerPlugin(ContextMenu);
registerPlugin(CopyPaste);
registerPlugin(DropdownMenu);
registerPlugin(Filters);
registerPlugin(HiddenRows);

//Starting point of Excel control
const ExcelImport = () => {
  //기본적으로 테이블 생성 및 불러오기를 위한 부분
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  // Json 형태로 바꿔주는 메서드
  const convertToJson = (headers, data) => {
    const rows = [];
    data.forEach((row) => {
      let rowData = {};
      row.forEach((element, index) => {
        rowData[headers[index]] = element;
      });
      rows.push(rowData);
    });
    setTableData(rows);
    return rows;
  };

  // 엑셀 불러오기
  const importExcel = (input) => {
    // 사용자 파일과 로컬 파일을 둘다 처리하기 위한 로직
    let file;
    if (input.target && input.target.files) {
      file = input.target.files[0];
    } else {
      file = input;
    }

    // const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      /* Parse data */
      const bstr = event.target.result;
      // sheetRow를 제한함으로써 한번에 불러오는 데이터를 제한함
      const workBook = XLSX.read(bstr, { type: "binary" });
      /* Get first workSheet */
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      /* Convert array of arrays */
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const headers = fileData[0];
      const formattedColumns = headers.map((head) => ({
        name: head,
        label: head,
      }));
      setColumns(formattedColumns);
      fileData.splice(0, 1);
      convertToJson(headers, fileData);
    };
    reader.readAsArrayBuffer(file);
  };

  //웹에 있는 엑셀을 다운로드
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "ADN_project엑셀테스트.xlsx");
  };

  // 로컬 프로젝트에 있는 파일 불러오기
  const loadLocalExcel = async () => {
    const response = await fetch("/excel/Uniqlo.xlsx");
    const data = await response.arrayBuffer();
    const file = new File([data], "Uniqlo.xlsx", {
      type: "application/vnd.ms-excel",
    });
    importExcel(file);
  };

  return (
    <div style={{ width: "100%", marginBottom: "1%", margin: "2%" }}>
      <div>
        <h1>Excel 가져오기</h1>
      </div>
      <div>
        <div>
          <label htmlFor="upload-photo">
            <input
              required
              style={{ display: "none" }}
              id="upload-photo"
              name="upload_photo"
              type="file"
              onChange={importExcel}
            />
            <Fab
              color="primary"
              size="small"
              component="span"
              aria-label="add"
              variant="extended"
            >
              문서 업로드
            </Fab>
          </label>
        </div>

        <Grid item xs={6} md={4}>
          <Button variant="contained" color="secondary" onClick={downloadExcel}>
            Excel 다운로드
          </Button>
          <Button variant="contained" color="primary" onClick={loadLocalExcel}>
            로컬 엑셀 파일 불러오기
          </Button>
        </Grid>

        <div style={{ width: "100%", marginTop: "20px" }}>
          <HotTable
            data={tableData}
            colHeaders={columns.map((col) => col.label)}
            dropdownMenu={true}
            contextMenu={true}
            filter={true}
            rowHeaders={true}
            manualRowMove={true}
            navigableHeaders={true}
            autoWrapRow={true}
            autoWrapCol={true}
            height={363}
            licenseKey="non-commercial-and-evaluation"
          >
            {columns.map((col, index) => (
              <HotColumn key={index} data={col.name} />
            ))}
          </HotTable>
        </div>
      </div>
    </div>
  );
};

export default ExcelImport;
