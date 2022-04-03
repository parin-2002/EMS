import React, { useState, useEffect } from "react";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { useSelector, useDispatch } from "react-redux";
import { notifyError, notifySuccess } from "../../notification/notify";
import instance from "../../others/baseUrl";
import Button from "@mui/material/Button";
import { takeAttendance } from "../../redux/empdata";
import CircularProgress from "@mui/material/CircularProgress";
import { isEmpAuthenticated } from "../../redux/auth";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import TextField from "@mui/material/TextField";

function Eattendance() {
  const empprofile = useSelector((state) => state.empprofile.value);
  const attendance = useSelector((state) => state.empattendance.value);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [loading, changeLoading] = useState(false);

  const [data, setAttendanceData] = useState([]);
  const dispatch = useDispatch();

  async function getAttendanceRecords() {
    try {
      changeLoading(true);
      const result = await instance.get("/api/emp/getattendancerecords", {
        withCredentials: true,
      });
      if (result) {
        setAttendanceData(result.data.result);
        changeLoading(false);
      }
    } catch (err) {
      setAttendanceData([]);
      changeLoading(false);
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isEmpAuthenticated({ auth: false }));
      }
    }
  }

  useEffect(() => {
    getAttendanceRecords();
  }, [1]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = React.useMemo(
    () => [
      {
        id: "date",
        Header: "Date",
        accessor: "date",
        Cell: ({ cell }) => {
          return new Date(cell.row.original.date).toDateString();
        },
      },
      {
        id: "shiftemp",
        Header: "Shift Taken By Employee",
        accessor: "shiftyTakenByEmployee",
        Cell: ({ cell }) => {
          return (
            <div>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      StartTime
                    </th>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      EndTime
                    </th>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      TotalTime(H:M)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cell.row.original.shiftyTakenByEmployee.map((one, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            border: "1px solid gray",
                            padding: "1px",
                          }}
                        >
                          {new Date(one.startTime).toLocaleTimeString()}
                        </td>
                        <td
                          style={{
                            border: "1px solid gray",
                            padding: "1px",
                          }}
                        >
                          {one.endTime
                            ? new Date(one.endTime).toLocaleTimeString()
                            : "Not end yet"}
                        </td>
                        <td
                          style={{
                            border: "1px solid gray",
                            padding: "1px",
                          }}
                        >
                          {one.totalMilliseconds
                            ? `${Math.floor(
                                one.totalMinutes / 60
                              )}:${Math.floor(one.totalMinutes % 60)}`
                            : "Not end yet"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        },
      },
      {
        id: "shiftcmp",
        Header: "Shift Taken By Company",
        accessor: "shiftyTakenByCompany",
        Cell: ({ cell }) => {
          return (
            <div>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      StartTime
                    </th>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      EndTime
                    </th>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      TotalTime(H:M)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cell.row.original.shiftyTakenByCompany.map((one, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            border: "1px solid gray",
                            padding: "1px",
                          }}
                        >
                          {new Date(one.startTime).toLocaleTimeString()}
                        </td>
                        <td
                          style={{
                            border: "1px solid gray",
                            padding: "1px",
                          }}
                        >
                          {one.endTime
                            ? new Date(one.endTime).toLocaleTimeString()
                            : "Not end yet"}
                        </td>
                        <td
                          style={{
                            border: "1px solid gray",
                            padding: "1px",
                          }}
                        >
                          {one.totalMilliseconds
                            ? `${Math.floor(
                                one.totalMinutes / 60
                              )}:${Math.floor(one.totalMinutes % 60)}`
                            : "Not end yet"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    state,
    setGlobalFilter,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);
  const { globalFilter } = state;

  return (
    <>
      <div className="box">
        <div className="h5-com mt-2 d-flex justify-content-center">
          <AccessAlarmIcon className="me-2" style={{ fontSize: "30px" }} />
          <h3>Attendance Details</h3>
        </div>
        <hr />
        <div>
          {!empprofile.leavingDate ? (
            <div>
              {attendanceLoading ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <Button
                  variant="contained"
                  onClick={async () => {
                    try {
                      if (confirm("do you want to take attendance?")) {
                        setAttendanceLoading(true);
                        const result = await instance.get(
                          "/api/emp/takeattendance",
                          {
                            withCredentials: true,
                          }
                        );
                        if (result) {
                          setAttendanceLoading(false);
                          dispatch(
                            takeAttendance({
                              attendance: !attendance.attendance,
                            })
                          );
                          notifySuccess(result.data.result);
                          getAttendanceRecords(); //
                        }
                      }
                    } catch (err) {
                      setAttendanceLoading(false);
                      notifyError(err.response.data.message);
                      if (
                        err.response.data.message == "invalid token" ||
                        err.response.data.message ==
                          "Access Denied! Unauthorized User"
                      ) {
                        dispatch(isEmpAuthenticated({ auth: false }));
                      }
                    }
                  }}
                >
                  {attendance.attendance ? "End shift" : "start shift"}
                </Button>
              )}
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="mt-2">
          <Paper sx={{ width: "100%" }} className="mt-2">
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                {...getTableProps()}
                sx={{ width: "100%" }}
              >
                <TableHead className="sticky-top">
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{ fontSize: "22px", color: "#1d366d" }}
                    >
                      <AccessAlarmIcon className="mb-1" /> Attendance Records
                    </TableCell>
                    <TableCell align="right" colSpan={2}>
                      <div>
                        <div>
                          <TextField
                            label="Search"
                            type="search"
                            variant="standard"
                            value={globalFilter || ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  {headerGroups.map((headerGroup, index) => (
                    <TableRow key={index}>
                      {headerGroup.headers.map((column) => (
                        <TableCell
                          key={column?.id}
                          align={column?.align}
                          style={{ top: 57, width: column?.width }}
                          {...headerGroup.getHeaderGroupProps()}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ArrowDownwardIcon
                                  style={{
                                    marginLeft: "2px",
                                    fontSize: "18px",
                                  }}
                                />
                              ) : (
                                <ArrowUpwardIcon
                                  style={{
                                    marginLeft: "2px",
                                    fontSize: "18px",
                                  }}
                                />
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      prepareRow(row);
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                          {...row.getRowProps()}
                        >
                          {row.cells.map((cell, index) => {
                            return (
                              <TableCell {...cell.getCellProps()} key={index}>
                                {cell.render("Cell")}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[2, 5, 10, 15, 20, 25, 30]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {loading ? (
              <div className="my-2 text-center">
                <CircularProgress style={{ color: "#1d366d" }} />
              </div>
            ) : (
              ""
            )}
          </Paper>
        </div>
      </div>
    </>
  );
}

export default Eattendance;
