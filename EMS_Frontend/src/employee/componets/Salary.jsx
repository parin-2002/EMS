import React, { useEffect, useState } from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { notifyError, notifySuccess } from "../../notification/notify";
import { isEmpAuthenticated } from "../../redux/auth";
import instance from "../../others/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import { useTable, useSortBy, useGlobalFilter } from "react-table";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

function Esalary() {
  const empprofile = useSelector((state) => state.empprofile.value);
  const [loading, changeLoading] = useState(false);
  const [takenBy, setTakenBy] = useState("shiftyTakenByEmployee");
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  async function getSalaryDetails(calculate = takenBy) {
    try {
      changeLoading(true);
      const result = await instance.post(
        "/api/emp/salarydetail",
        { calculate: calculate },
        {
          withCredentials: true,
        }
      );
      if (result) {
        changeLoading(false);
        setData(result.data.result);
        setTotalMinutes(result.data.totalMinutes);
      }
    } catch (err) {
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
    getSalaryDetails();
  }, [takenBy]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
        id: "startTime",
        Header: "Start Time",
        accessor: "startTime",
        Cell: ({ cell }) => {
          return new Date(cell.row.original.startTime).toLocaleString();
        },
        width: "30%",
      },
      {
        id: "endTime",
        Header: "End Time",
        accessor: "endTime",
        Cell: ({ cell }) => {
          return cell.row.original.endTime
            ? new Date(cell.row.original.endTime).toLocaleString()
            : "Not end yet";
        },
        width: "30%",
      },
      {
        id: "Total Time(HH:MM)",
        Header: "Total Time(HH:MM)",
        accessor: "Total Time(HH:MM)",
        Cell: ({ cell }) => {
          var hours = Math.floor(cell.row.original.totalMinutes / 60);
          var minutes = cell.row.original.totalMinutes % 60;
          return cell.row.original.totalMinutes != undefined
            ? `${hours}:${minutes}`
            : "-";
        },
        width: "30%",
      },
      {
        id: "Salary",
        Header: "Salary",
        accessor: "Salary",
        Cell: ({ cell }) => {
          //console.log(empprofile.hourlysalary);
          let rate = empprofile.hourlysalary / 60;
          return cell.row.original.totalMinutes != undefined
            ? `${(cell.row.original.totalMinutes * rate).toFixed(2)}${
                empprofile.currency
              }`
            : "-";
        },
        width: "30%",
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
        <div className="h5-com text-center mt-2">
          <h3>
            <AccountBalanceIcon
              className="me-2 mb-1"
              style={{ fontSize: "26px" }}
            />
            Salary Details
          </h3>
        </div>
        <div className="card mt-3">
          <div className="d-flex p-2 justify-content-between mx-5 mt-2">
            <div className="">
              <h6 className="h5-com">Total time this month(HH:MM)</h6>
              <p>
                {Math.floor(totalMinutes / 60)}:{totalMinutes % 60}
              </p>
            </div>
            <div className="ms-5">
              <h6 className="h5-com">Pay Rate</h6>
              <p>
                {empprofile.hourlysalary}
                {empprofile.currency}
              </p>
            </div>
            <div className="ms-5">
              <h6 className="h5-com">Total Salary</h6>
              <p>
                {((empprofile.hourlysalary / 60) * totalMinutes).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* 
        <div className="mt-3 mx-5">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Shift Taken By
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={takenBy}
              label="Shift Taken By"
              onChange={(e) => {
                setTakenBy(e.target.value);
              }}
            >
              <MenuItem value="shiftyTakenByEmployee">Employee</MenuItem>
              <MenuItem value="shiftyTakenByCompany">Company</MenuItem>
            </Select>
          </FormControl>
        </div> */}

        <div className="mt-3">
          <Paper sx={{ width: "100%" }}>
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
                      <AccountBalanceIcon className="mb-1" /> Salary Records
                    </TableCell>
                    <TableCell colSpan={2}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Shift Taken By
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={takenBy}
                          label="Shift Taken By"
                          onChange={(e) => {
                            setTakenBy(e.target.value);
                          }}
                        >
                          <MenuItem value="shiftyTakenByEmployee">
                            Employee
                          </MenuItem>
                          <MenuItem value="shiftyTakenByCompany">
                            Company
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {/* <TextField
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
                      /> */}
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
              rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <div className="text-center">
              {loading ? <CircularProgress style={{ color: "#1d366d" }} /> : ""}
            </div>
          </Paper>
        </div>
      </div>
    </>
  );
}

export default Esalary;
