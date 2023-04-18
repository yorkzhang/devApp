/*eslint-disable*/
import React from "react";
import {
  useTable,
  useFilters,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table";
import classnames from "classnames";
// A great library for fuzzy filtering/sorting items
import { matchSorter } from "match-sorter";
// react plugin used to create DropdownMenu for selecting items
import Select from "react-select";
// reactstrap components
import { Container, Row, Col, FormGroup, Input } from "reactstrap";

import './_reacttable.scss'

import NotificationAlert from "react-notification-alert";
// react-bootstrap components
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  InputGroup,
  Modal,
  Navbar,
  Nav,
  // Container,
  // Row,
  // Col,
} from "react-bootstrap";

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;
  return (
    <FormGroup>
      <Input
        placeholder={`Search ${count} records...`}
        type="text"
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
      />
    </FormGroup>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Our table component

function Table({ columns, data,restData }) {
  const [numberOfRows, setNumberOfRows] = React.useState({
    value: 10,
    label: "10 rows",
  });
  const [pageSelect, handlePageSelect] = React.useState({
    value: 0,
    label: "Page 1",
  });
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    visibleColumns,
    nextPage,
    pageOptions,
    pageCount,
    previousPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
    gotoPage,
  } = useTable(
    {
      columns,
      data,
      restData,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageSize: 20, pageIndex: 0 },
    },
    useFilters, // useFilters!
    useSortBy,
    usePagination
  );

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  // const firstPageRows = rows.slice(0, 10);
  let pageSelectData = Array.apply(
    null,
    Array(pageOptions.length)
  ).map(function () {});
  let numberOfRowsData = [5, 10, 20, 25, 50, 100];



  const notificationAlertRef = React.useRef(null);
  const notify = (place) => {
    var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            欄位資訊已複製
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  // 加千分號
  const AddThousandSign = (num) =>{
    console.log(num);
   return num.props ? num.props.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : ''
  }

  return (
    <>
      

      <div className="rna-container" style={{width:'5px'}}>
        <NotificationAlert ref={notificationAlertRef} style={{width:'5px'}}/>
      </div>
      <div className="ReactTable -striped -highlight primary-pagination">
        <table {...getTableProps()} className="rt-table">
          <thead className="rt-thead -header">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="rt-tr">
                {
                headerGroup.headers.map((column, key) => (
                  // console.log("column :", column )

                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={classnames("rt-th rt-resizable-header", {
                      "-cursor-pointer": headerGroup.headers.length!== key,
                      "-sort-asc": column.isSorted && !column.isSortedDesc,
                      "-sort-desc": column.isSorted && column.isSortedDesc,
                    })}
                  >

                    {/* 自己設定的文字位置: \lbdpr\plugins\_react-table.scss Line:86 遮蔽 */}
                    <div className="rt-resizable-header-content">
                      {column.render("Header")}
                    </div>

                    <div>
                      {headerGroup.headers.length === key
                        ? null
                        : column.canFilter
                        ? column.render("Filter")
                        : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="rt-tbody">


            <div className="ReactTable--Tip">
              <i className="fa fa-exclamation-circle ReactTable--Tip--icon" aria-hidden="true"></i>
              <div className="ReactTable--Tip--text"> 點選欄位即可複製欄位資訊 </div>
            </div>

            {/* 增加表頭 */}
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="rt-tr" style={{fontSize:'0.5rem'}}>
                {
                headerGroup.headers.map((column, key) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={classnames("rt-th rt-resizable-header", {
                      "-cursor-pointer": headerGroup.headers.length !== key,
                      "-sort-asc": column.isSorted && !column.isSortedDesc,
                      "-sort-desc": column.isSorted && column.isSortedDesc,
                    })}
                  >
                    <div className={`rt-resizable-header-content ${column.HeadPosition ? `text-${column.render("HeadPosition")}` : ''}`}>
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}

            {/* 細項內容 */}
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr style={{fontSize:'8px'}}
                  {...row.getRowProps()}
                  className={classnames(
                    "rt-tr",
                    { " -odd": i % 2 === 0 },
                    { " -even": i % 2 === 1 }
                  )}
                >
                  {row.cells.map((cell,cellIdx) => {
                    
                      // 判斷是否需加千分號
                      let thousandth = false 
                      let thousandthIdx = null;
                    
                      // 判斷內容位置
                      let ContentPosition = null;
                      let ContentPositionIdx = null;

                      headerGroups.forEach((headerGroup,idx) => {
                        headerGroup.headers.forEach((column, key) => {
                          if(column.thousandth){
                            thousandth = true;
                            thousandthIdx = key
                          }
                          if(column.ContentPosition){
                            ContentPosition = column.ContentPosition
                            ContentPositionIdx = key
                          }
                        })
                      })

                      return (
                        <td {...cell.getCellProps()}  data-toggle="tooltip" title={cell.value} 
                        onClick={()=>{
                          // navigator.clipboard.writeText(cell.value)
                          // notify("br")
                        }}
                        variant="default"
                        className={`rt-td ${ContentPosition && ContentPositionIdx == cellIdx ? `text-${ContentPosition}` : ''}` }>
                          {thousandth && thousandthIdx== cellIdx ? AddThousandSign(cell.render("Cell")) : cell.render("Cell")}
                        </td>
                      )

                      // return thousandth && thousandthIdx== cellIdx ? 
                      // <td {...cell.getCellProps()}  data-toggle="tooltip" title={cell.value} 
                      //   onClick={()=>{
                      //     // navigator.clipboard.writeText('Copy this text to clipboard', cell.value);
                      //     // document.execCommand("copy")
                      //     // console.log('cell.value :', cell.value)
                      //     navigator.clipboard.writeText(cell.value)
                      //     notify("br")
                      //   }}
                      //   variant="default"
                      //   className={`rt-td ${column.ContentPosition ? `text-${column.render("ContentPosition")}` : ''}` }>{AddThousandSign(cell.render("Cell"))}</td>
                      // :
                      // <td {...cell.getCellProps()}  data-toggle="tooltip" title={cell.value} 
                      //   onClick={()=>{
                      //     // navigator.clipboard.writeText('Copy this text to clipboard', cell.value);
                      //     // document.execCommand("copy")
                      //     // console.log('cell.value :', cell.value)
                      //     navigator.clipboard.writeText(cell.value)
                      //     notify("br")
                      //   }}
                      //   variant="default"
                      //   className={`rt-td ${column.ContentPosition ? `text-${column.render("ContentPosition")}` : ''}` }> {cell.render("Cell")}</td>
       
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination-top">
          <div className="-pagination">
            <div className="-previous py-1">
                  <button
                    type="button"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className="-btn"
                  >
                    上一頁
                  </button>
            </div>
            <div className="-center">
              <Container>
                <Row className="justify-content-center">
                  <Col sm="6" xs="12" className="py-1 px-0 p-sm-1 " >
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      name="pageSelect"
                      value={pageSelect}
                      onChange={(value) => {
                        gotoPage(value.value);
                        handlePageSelect(value);
                      }}
                      options={pageSelectData.map((prop, key) => {
                        return {
                          value: key,
                          label: "Page " + (key + 1),
                        };
                      })}
                      placeholder="Choose Page"
                    />
                  </Col>
                  <Col sm="6" xs="12" className="py-1 px-0 p-sm-1 ">
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      name="numberOfRows"
                      value={numberOfRows}
                      onChange={(value) => {
                        setPageSize(value.value);
                        setNumberOfRows(value);
                      }}
                      options={numberOfRowsData.map((prop) => {
                        return {
                          value: prop,
                          label: prop + " rows",
                        };
                      })}
                      placeholder="Choose Rows"
                    />
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="-next py-1">
                  <button
                    type="button"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="-btn"
                  >
                    下一頁
                  </button>
            </div>
          </div>
        </div>
      
        <div className="pagination-bottom"></div>
      </div>
    </>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

export default Table;




















// import React from "react";
// // react plugin for creating notifications over the dashboard
// import NotificationAlert from "react-notification-alert";

// // react-bootstrap components
// import {
//   Alert,
//   Badge,
//   Button,
//   Card,
//   Form,
//   InputGroup,
//   Modal,
//   Navbar,
//   Nav,
//   Container,
//   Row,
//   Col,
// } from "react-bootstrap";

// function ServiceStorage() {
//   const [modal, setModal] = React.useState(false);
//   const notificationAlertRef = React.useRef(null);
//   const notify = (place) => {
//     var color = Math.floor(Math.random() * 5 + 1);
//     var type;
//     switch (color) {
//       case 1:
//         type = "primary";
//         break;
//       case 2:
//         type = "success";
//         break;
//       case 3:
//         type = "danger";
//         break;
//       case 4:
//         type = "warning";
//         break;
//       case 5:
//         type = "info";
//         break;
//       default:
//         break;
//     }
//     var options = {};
//     options = {
//       place: place,
//       message: (
//         <div>
//           <div>
//             Welcome to <b>Black Dashboard React</b> - a beautiful premium admin
//             for every web developer.
//           </div>
//         </div>
//       ),
//       type: type,
//       icon: "nc-icon nc-bell-55",
//       autoDismiss: 7,
//     };
//     notificationAlertRef.current.notificationAlert(options);
//   };
//   return (
//     <>
//       <div className="rna-container">
//         <NotificationAlert ref={notificationAlertRef} />
//       </div>
//       <Container fluid>
//         <Card>
//           <Card.Body>
//             <div className="places-buttons">
//               <Row className="justify-content-center">
//                 <Col lg="3" md="3">
//                   <Button block onClick={() => notify("br")} variant="default">
//                     Bottom Right
//                   </Button>
//                 </Col>
//               </Row>
//             </div>
//             <Row>
//               <Col className="text-center" md="12">
//                 <h4 className="title">Modal</h4>
//                 <Button
//                   className="btn-fill btn-wd"
//                   onClick={() => setModal(!modal)}
//                   variant="info"
//                 >
//                   Launch Modal Mini
//                 </Button>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>
//         {/* Mini Modal */}
//         <Modal
//           className="modal-mini modal-primary"
//           onHide={() => setModal(!modal)}
//           show={modal}
//         >
//           <Modal.Header className="justify-content-center">
//             <div className="modal-profile">
//               <i className="nc-icon nc-bulb-63"></i>
//             </div>
//           </Modal.Header>
//           <Modal.Body className="text-center">
//             <p>Always have an access to your profile</p>
//           </Modal.Body>
//           <div className="modal-footer">
//             <Button
//               className="btn-simple"
//               onClick={() => setModal(!modal)}
//               variant="link"
//             >
//               Back
//             </Button>
//             <Button
//               className="btn-simple"
//               onClick={() => setModal(!modal)}
//               variant="link"
//             >
//               Close
//             </Button>
//           </div>
//         </Modal>
//         {/* End Modal */}
//       </Container>
//     </>
//   );
// }

// export default ServiceStorage;