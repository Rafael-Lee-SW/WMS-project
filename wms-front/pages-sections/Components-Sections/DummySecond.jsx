//not directly use the react-window
import React, { useState, useCallback, useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import * as XLSX from "xlsx";
import MUIDataTable from "mui-datatables";
import TextField from "@mui/material/TextField";
import debounce from "lodash.debounce";
//모달 화면을 띄우기 위한 importing
import ReactModal from "react-modal";

//Starting point of Excel control
const ExcelImport = () => {
  //기본적으로 테이블 생성 및 불러오기를 위한 부분
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  //Cell 수정을 위한 부분
  const [editCell, setEditCell] = useState(null);
  const [tempValue, setTempValue] = useState(""); // Temporary value for cell edit
  //성능 최적화를 위한 부분
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // 모달 스타일 정의
  const [modalStyle, setModalStyle] = useState({
    overlay: {
      position: "fixed",
      backgroundColor: "transparent",
    },
    content: {
      position: "relative",
      display: "inline-block",
      backgroundColor: "rgba(255, 255, 255, 0.75)",
    },
  });

  // 수정을 위한 TextField
  const texFieldRef = useRef(null);
  // 리액트 모달을 작동시키는 버튼을 위한 const
  const [showModal, setShowModal] = useState(false);

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
      const workBook = XLSX.read(bstr, { type: "binary", sheetRows: 50 });
      /* Get first workSheet */
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      /* Convert array of arrays */
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const headers = fileData[0];
      const formattedColumns = headers.map((head) => ({
        name: head,
        label: head,
        options: {
          filter: true,
          sort: true,
          setCellHeaderProps: () => ({
            style: {
              whiteSpace: "nowrap",
              textAlign: "center",
              fontWeight: "bold",
            },
          }),
          setCellProps: () => ({
            style: {
              whiteSpace: "normal",
              fontWeight: "normal",
              fontSize: "12px",
            },
          }),
        },
      }));
      setColumns(formattedColumns);
      fileData.splice(0, 1);
      console.log("헤더!")
      console.log(headers);
      console.log("실제 데이타!");
      console.log(fileData);
      convertToJson(headers, fileData);
    };
    reader.readAsArrayBuffer(file);
  };

  // 셀 하나 클릭했을 때 작동한다.
  // 해당하는 행과 열을 받고 그에 따른 값을 변경하기 위한 준비
  const handleCellClick = (rowIndex, columnIndex, value) => {
    setEditCell({ rowIndex, columnIndex });
    setTempValue(value); // Set temporary value for editing

    // event에는 다양한 정보들이 들어있다. 오히려 위에서 정의하면
    // undefined로 아무것도 못 불러옴.
    const cellRect = event.target.getBoundingClientRect();
    
    // 모달 스타일을 정의하여 투명하게 만들고 경계를 없앤다.
    setModalStyle({
      overlay: {
        // position: 'fixed',
        backgroundColor: "transparent",
        zIndex: 1001, // Ensure modal content is above the overlay
      },
      content: {
        position: "relative",
        display: "inline-block",
        backgroundColor: "transparent",
        padding: "0px",
        border: "none",
        top: `${cellRect.top}px`,
        left: `${cellRect.left}px`,
        // overflow: 'auto',
        zIndex: 1001, // Ensure modal content is above the overlay
      },
    });
    setShowModal(true); // 모달을 띄운다.
  };

  // 셀에 변경된 값을 저장하는 것.
  // 최적화를 위해 Callback 함수를 사용함
  const handleSaveEdit = useCallback(
    debounce(() => {
      if (editCell) {
        const { rowIndex, columnIndex } = editCell;
        const columnName = columns[columnIndex].name;
        const updatedData = [...tableData];
        updatedData[rowIndex][columnName] = tempValue;
        setTableData(updatedData);
        setEditCell(null);
      }
    }, 100),
    [editCell, tempValue]
  );

  // 엔터를 누르면 저장 및 모달 종료
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
      setShowModal(false);
    }
  };

  //웹에 있는 엑셀을 다운로드
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "ADN_project엑셀테스트.xlsx");
  };

  //웹에 있는 엑셀을 JSON 형태로 Local에 저장
  const downloadJsonFile = (jsonData, fileName) => {
    const dataStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadExcelForLocal = () => {
    downloadJsonFile(tableData, "data.json");
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

  const options = {
    sorting: true,
    print: false,
    download: false,
    filter: true,
    fixedHeader: true,
    caseSensitive: false,
    selectableRows: "none",
    customSearch: () => true,
    //최적화 부분
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: [10, 20, 50, 100, 200],
    count: tableData.length,
    page: page,
    onTableChange: (action, tableState) => {
      if (action === "changePage") {
        setPage(tableState.page);
      }
      if (action === "changeRowsPerPage") {
        setRowsPerPage(tableState.rowsPerPage);
        setPage(0);
      }
    },
    //셀 클릭하면 작동하게끔
    onCellClick: (cellData, cellMeta, event) => {
      const value =
        tableData[cellMeta.rowIndex + page * rowsPerPage][
          columns[cellMeta.colIndex].name
        ];
      handleCellClick(
        cellMeta.rowIndex + page * rowsPerPage,
        cellMeta.colIndex,
        value,
        event // Pass the event here
      );
    },
  };

  // 수정용 Cell을 렌더링하는 메서드

  const renderEditCell = () => {
    return (
      <TextField
        ref={texFieldRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        // onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        //style of outside when user touch the cell
        variant="outlined"
        size="small"
        style={{}}
        InputProps={{
          style: {
            color: "red",
            fontSize: "1em",
            backgroundColor: "white",
          },
        }}
      />
    );
  };

  const editableColumns = columns.map((col, colIndex) => ({
    ...col,
    options: {
      ...col.options,
      customBodyRender: (value) => value, // 모달에서만 변경되도록
    },
  }));

  return (
    <div style={{ width: "100%", marginBottom: "1%", margin: "2%" }}>
      <div>
        <h1>Excel 가져오기</h1>
      </div>
      <Paper
        style={{
          width: "100%",
          marginBottom: "1%",
          marginTop: "3%",
          paddingLeft: "1%",
          paddingRight: "3%",
          paddingBottom: "1%",
          paddingTop: "1%",
        }}
        elevation={5}
      >
        <div>
          <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
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
            </Grid>
            <Grid item xs={6} md={4}>
              <Button
                variant="contained"
                color="secondary"
                onClick={downloadExcel}
              >
                Excel 다운로드
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={loadLocalExcel}
              >
                로컬 엑셀 파일 불러오기
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={downloadExcelForLocal}
              >
                JSON 다운로드
              </Button>
            </Grid>
            <Grid item xs={12}>
              <MUIDataTable
                title={"Excel 가져오기"}
                data={tableData}
                columns={editableColumns}
                options={options}
              />
            </Grid>
          </Grid>
        </div>
      </Paper>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      {showModal ? 'true' : 'false'}
      <ReactModal
        isOpen={showModal}
        style={modalStyle}
        onRequestClose={() => setShowModal(false)}
        // ESC or 밖에 클릭 시 종료
        ariaHideApp={false} // 임시방편 에러 숨기기
      >
        {renderEditCell()}
      </ReactModal>
    </div>
  );
};

export default ExcelImport;
