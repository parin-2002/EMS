import React, { useEffect, useState } from "react";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { useFormik } from "formik";
import * as yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import { isAuthenticated } from "../../../redux/auth";
import instance from "../../../others/baseUrl";
import { useDispatch } from "react-redux";
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
import { TextField } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Button from "@mui/material/Button";
import { notifyError, notifySuccess } from "../../../notification/notify";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

function Leave() {
  const [loading, changeLoading] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  async function getLeaveRequest() {
    try {
      changeLoading(true);
      const result = await instance.get(
        "/api/company/manageemp/getleaverequest",
        {
          withCredentials: true,
        }
      );
      if (result) {
        changeLoading(false);
        setData(result.data.result);
      }
    } catch (err) {
      changeLoading(false);
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isAuthenticated({ auth: false }));
      }
    }
  }

  useEffect(() => {
    getLeaveRequest();
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
        id: "empdetails",
        Header: "Employee Details",
        accessor: "empdetail",
        Cell: ({ cell }) => {
          return (
            <div>
              <p style={{ margin: "0px" }}>
                {cell.row.original.empdetail.fullname}
              </p>
              <p style={{ margin: "0px" }}>
                Email: {cell.row.original.empdetail.email}
              </p>
              <p style={{ margin: "0px" }}>
                Mo: {cell.row.original.empdetail.mobileno}
              </p>
            </div>
          );
        },
        width: "30%",
      },
      {
        id: "startDate",
        Header: "Start Date",
        accessor: "startDate",
        Cell: ({ cell }) => {
          return new Date(cell.row.original.startDate).toDateString();
        },
        width: "30%",
      },
      {
        id: "endDate",
        Header: "End Date",
        accessor: "endDate",
        Cell: ({ cell }) => {
          return new Date(cell.row.original.endDate).toDateString();
        },
        width: "30%",
      },
      {
        id: "reason",
        Header: "Reason",
        accessor: "reason",
        Cell: ({ cell }) => {
          return (
            <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
              {cell.row.original.reason}
            </p>
          );
        },
        width: "30%",
      },
      {
        id: "fullDay",
        Header: "Full Day",
        accessor: "fullDay",
        width: "30%",
      },
      {
        id: "halfDay",
        Header: "Half Day",
        accessor: "halfDay",
        width: "30%",
      },
      {
        id: "status",
        Header: "Manage Leave",
        accessor: "status",
        Cell: ({ cell }) => {
          return (
            <div>
              <CloseIcon
                className="me-4"
                style={{ color: "red" }}
                onClick={async () => {
                  if (confirm("are you sure?")) {
                    try {
                      const result = await instance.post(
                        "/api/company/manageemp/changeleavestatus",
                        {
                          id: cell.row.original._id,
                          status: "cancelled",
                          email: cell.row.original.empdetail.email,
                        },
                        {
                          withCredentials: true,
                        }
                      );
                      if (result) {
                        notifySuccess(result.data.result);
                        setData([]);
                        getLeaveRequest();
                      }
                    } catch (err) {
                      notifyError(err.response.data.message);
                      if (
                        err.response.data.message == "invalid token" ||
                        err.response.data.message ==
                          "Access Denied! Unauthorized User"
                      ) {
                        dispatch(isAuthenticated({ auth: false }));
                      }
                    }
                  }
                }}
              />
              <DoneIcon
                onClick={async () => {
                  if (confirm("are you sure?")) {
                    try {
                      const result = await instance.post(
                        "/api/company/manageemp/changeleavestatus",
                        {
                          id: cell.row.original._id,
                          status: "approved",
                          email: cell.row.original.empdetail.email,
                        },
                        {
                          withCredentials: true,
                        }
                      );
                      if (result) {
                        notifySuccess(result.data.result);
                        setData([]);
                        getLeaveRequest();
                      }
                    } catch (err) {
                      notifyError(err.response.data.message);
                      if (
                        err.response.data.message == "invalid token" ||
                        err.response.data.message ==
                          "Access Denied! Unauthorized User"
                      ) {
                        dispatch(isAuthenticated({ auth: false }));
                      }
                    }
                  }
                }}
                style={{ color: "green" }}
              />
            </div>
          );
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
        <div className="h5-com mt-2 d-flex justify-content-center">
          <NoteAltIcon className="me-2" style={{ fontSize: "30px" }} />
          <h3>Manage Leaves</h3>
        </div>

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
                      colSpan={3}
                      style={{ fontSize: "22px", color: "#1d366d" }}
                    >
                      <NoteAltIcon className="mb-1" /> Leave Requests
                    </TableCell>
                    <TableCell align="right" colSpan={4}>
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
        <hr className="my-4" />
        <div>
          <EmpOnLeaveToday />
        </div>
        <hr className="my-4" />
        <div>
          <FindLeaveRecords />
        </div>
      </div>
    </>
  );
}

function FindLeaveRecords() {
  const [loading, changeLoading] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      startDate: "",
      endDate: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Required"),
      startDate: yup.date().required("Required"),
      endDate: yup.date().required("required"),
    }),
    onSubmit: async (values) => {
      try {
        changeLoading(true);
        const result = await instance.post(
          "/api/company/manageemp/filterleaves",
          values,
          {
            withCredentials: true,
          }
        );
        if (result) {
          changeLoading(false);
          setData(result.data.result);
        }
      } catch (err) {
        changeLoading(false);
        setData([]);
        notifyError(err.response.data.message);
        if (
          err.response.data.message == "invalid token" ||
          err.response.data.message == "Access Denied! Unauthorized User"
        ) {
          dispatch(isAuthenticated({ auth: false }));
        }
      }
    },
  });

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
        id: "startDate",
        Header: "Start Date",
        accessor: "startDate",
        Cell: ({ cell }) => {
          return new Date(cell.row.original.startDate).toDateString();
        },
        width: "30%",
      },
      {
        id: "endDate",
        Header: "End Date",
        accessor: "endDate",
        Cell: ({ cell }) => {
          return new Date(cell.row.original.endDate).toDateString();
        },
        width: "30%",
      },
      {
        id: "reason",
        Header: "Reason",
        accessor: "reason",
        Cell: ({ cell }) => {
          return (
            <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
              {cell.row.original.reason}
            </p>
          );
        },
        width: "30%",
      },
      {
        id: "fullDay",
        Header: "Full Day",
        accessor: "fullDay",
        width: "30%",
      },
      {
        id: "halfDay",
        Header: "Half Day",
        accessor: "halfDay",
        width: "30%",
      },
      {
        id: "status",
        Header: "status",
        accessor: "status",
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
      <div>
        <h5 className="h5-com">Filter Leave Records</h5>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="mt-3 col">
              <TextField
                className="form-control"
                label="Email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                required
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="error">{formik.errors.email}</p>
              ) : null}
            </div>
            <div className="mt-3 col">
              <TextField
                className="form-control"
                label="Start Date"
                name="startDate"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.startDate}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.startDate && Boolean(formik.errors.startDate)
                }
                required
              />
              {formik.touched.startDate && formik.errors.startDate ? (
                <p className="error">{formik.errors.startDate}</p>
              ) : null}
            </div>
            <div className="mt-3 col">
              <TextField
                className="form-control"
                label="End Date"
                name="endDate"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.endDate}
                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                required
              />
              {formik.touched.endDate && formik.errors.endDate ? (
                <p className="error">{formik.errors.endDate}</p>
              ) : null}
            </div>
            <div className="col-1 pt-4">
              {loading ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
      {data.length ? (
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
                      colSpan={3}
                      style={{ fontSize: "22px", color: "#1d366d" }}
                    >
                      <NoteAltIcon className="mb-1" /> Leave Records
                    </TableCell>
                    <TableCell align="right" colSpan={4}>
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
          </Paper>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

function EmpOnLeaveToday() {
  const [loading, changeLoading] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  async function getRecords() {
    try {
      changeLoading(true);
      const result = await instance.get("/api/company/manageemp/onleaveemp", {
        withCredentials: true,
      });
      if (result) {
        changeLoading(false);
        setData(result.data.result);
      }
    } catch (err) {
      changeLoading(false);
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isAuthenticated({ auth: false }));
      }
    }
  }

  useEffect(() => {
    getRecords();
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
        id: "empdetails",
        Header: "Employee Details",
        accessor: "empdetail",
        Cell: ({ cell }) => {
          return (
            <div>
              <p style={{ margin: "0px" }}>
                {cell.row.original.empdetail.fullname}
              </p>
              <p style={{ margin: "0px" }}>
                Email: {cell.row.original.empdetail.email}
              </p>
              <p style={{ margin: "0px" }}>
                Mo: {cell.row.original.empdetail.mobileno}
              </p>
            </div>
          );
        },
        width: "30%",
      },
      {
        id: "startDate",
        Header: "Start Date",
        accessor: "startDate",
        Cell: ({ cell }) => {
          return new Date(cell.row.original.startDate).toDateString();
        },
        width: "30%",
      },
      {
        id: "endDate",
        Header: "End Date",
        accessor: "endDate",
        Cell: ({ cell }) => {
          return new Date(cell.row.original.endDate).toDateString();
        },
        width: "30%",
      },
      {
        id: "reason",
        Header: "Reason",
        accessor: "reason",
        Cell: ({ cell }) => {
          return (
            <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
              {cell.row.original.reason}
            </p>
          );
        },
        width: "30%",
      },
      {
        id: "fullDay",
        Header: "Full Day",
        accessor: "fullDay",
        width: "30%",
      },
      {
        id: "halfDay",
        Header: "Half Day",
        accessor: "halfDay",
        width: "30%",
      },
      {
        id: "status",
        Header: "Manage Leave",
        accessor: "status",
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
                    colSpan={3}
                    style={{ fontSize: "22px", color: "#1d366d" }}
                  >
                    <NoteAltIcon className="mb-1" /> Employees on leave today
                  </TableCell>
                  <TableCell align="right" colSpan={4}>
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
    </>
  );
}

export default Leave;
