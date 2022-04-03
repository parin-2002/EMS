import React, { useState, useEffect } from "react";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { useFormik } from "formik";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { notifyError, notifySuccess } from "../../notification/notify";
import { isEmpAuthenticated } from "../../redux/auth";
import instance from "../../others/baseUrl";
import { useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

function Eleave() {
  const [loading, changeLoading] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  async function getLeaveRecords() {
    try {
      changeLoading(true);
      const result = await instance.get("/api/emp/selectleaverecords", {
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
        dispatch(isEmpAuthenticated({ auth: false }));
      }
    }
  }

  useEffect(() => {
    getLeaveRecords();
  }, [1]);

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
        Header: "Status",
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
      <div className="box">
        <RequestLeave getLeaveRecords={getLeaveRecords} />
        <div className="mt-2">
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
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
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
                {loading ? (
                  <CircularProgress style={{ color: "#1d366d" }} />
                ) : (
                  ""
                )}
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </>
  );
}

function RequestLeave({ getLeaveRecords }) {
  const [loading, changeLoading] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      halfDay: 0,
      fullDay: 0,
      reason: "",
    },
    validationSchema: yup.object({
      startDate: yup.date().required("Required"),
      endDate: yup.date().required("Required"),
      reason: yup.string().required("Required"),
      halfDay: yup.number().min(0, "invalid input").required("Required"),
      fullDay: yup.number().min(0, "invalid input").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        changeLoading(true);
        const result = await instance.post("/api/emp/requestleave", values, {
          withCredentials: true,
        });
        if (result) {
          notifySuccess(result.data.result);
          formik.resetForm();
          handleClose();
          changeLoading(false);
          getLeaveRecords();
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
    },
  });

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Request for leave
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Request for leave</DialogTitle>
        <form onSubmit={formik.handleSubmit} className="mx-5">
          <div className="mt-3">
            <TextField
              className="form-control"
              label="Start Date"
              name="startDate"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.startDate}
              error={
                formik.touched.startDate && Boolean(formik.errors.startDate)
              }
              required
            />
            {formik.touched.startDate && formik.errors.startDate ? (
              <p className="error">{formik.errors.startDate}</p>
            ) : null}
          </div>

          <div className="mt-3">
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
          <p style={{ fontSize: "14px" }}>
            Note: If you want one day or half day leave enter same date
          </p>

          <div className="mt-3">
            <TextField
              className="form-control"
              InputLabelProps={{
                shrink: true,
              }}
              label="HalfDay"
              name="halfDay"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.halfDay}
              error={formik.touched.halfDay && Boolean(formik.errors.halfDay)}
              required
            />
            {formik.touched.halfDay && formik.errors.halfDay ? (
              <p className="error  m-0">{formik.errors.halfDay}</p>
            ) : null}
          </div>

          <div className="mt-3">
            <TextField
              className="form-control"
              InputLabelProps={{
                shrink: true,
              }}
              label="FullDay"
              name="fullDay"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fullDay}
              error={formik.touched.fullDay && Boolean(formik.errors.fullDay)}
              required
            />
            {formik.touched.fullDay && formik.errors.fullDay ? (
              <p className="error  m-0">{formik.errors.fullDay}</p>
            ) : null}
          </div>

          <div className="mt-3">
            <TextField
              className="form-control"
              label="Reason"
              name="reason"
              type="text"
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.reason}
              error={formik.touched.reason && Boolean(formik.errors.reason)}
              required
            />
            {formik.touched.reason && formik.errors.reason ? (
              <p className="error">{formik.errors.reason}</p>
            ) : null}
          </div>

          <DialogActions className="my-2">
            <Button onClick={handleClose} className="me-2">
              Cancel
            </Button>
            {loading ? (
              <CircularProgress style={{ color: "#1d366d" }} />
            ) : (
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                Submit
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Eleave;
