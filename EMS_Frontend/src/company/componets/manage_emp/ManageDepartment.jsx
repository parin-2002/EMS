import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import DomainIcon from "@mui/icons-material/Domain";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
// dialog or popup for adding designation
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { Department } from "../manage_emp/Addemp";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  notifyError,
  notifySuccess,
  notifyInfo,
} from "../../../notification/notify";
import { useFormik } from "formik";
import * as yup from "yup";
import instance from "../../../others/baseUrl";
import "./style.emp.css";
import CircularProgress from "@mui/material/CircularProgress";
import { isAuthenticated } from "../../../redux/auth";

async function deleteDepartment(id, getDepartment) {
  try {
    if (confirm("Are you sure?")) {
      notifyInfo("Request is sent to server it may take sometime");
      const result = await instance.delete(
        `/api/company/manageemp/deletedepartment?id=${id}`,
        {
          withCredentials: true,
        }
      );
      if (result) {
        getDepartment();
        notifySuccess("Deleted successfully");
      }
    }
  } catch (err) {
    notifyError(err.response.data.message);
    if (
      err.response.data.message == "invalid token" ||
      err.response.data.message == "Access Denied! Unauthorized User"
    ) {
      location.reload();
    }
  }
}

function UpdateDepartment({ getDepartment, data }) {
  const dispatch = useDispatch();
  const [loading, changeLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  // console.log(data.department);
  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      id: data._id,
      department: data.department,
      description: data.description,
    },
    validationSchema: yup.object({
      department: yup.string().required("Required"),
      description: yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        changeLoading(true);
        const result = await instance.put(
          "/api/company/manageemp/updatedepartment",
          values,
          {
            withCredentials: true,
          }
        );
        if (result) {
          changeLoading(false);
          notifySuccess("Updated successfully");
          getDepartment();
          setOpen(false);
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
    },
  });

  return (
    <div>
      <ModeEditIcon onClick={handleClickOpen} className="edit" />

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle className="px-5 mx-5">Update Department</DialogTitle>
          <DialogContent>
            <div className="mt-2">
              <TextField
                variant="standard"
                fullWidth
                label="Department"
                name="department"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.department}
                error={
                  formik.touched.department && Boolean(formik.errors.department)
                }
                required
              />
              {formik.touched.department && formik.errors.department ? (
                <p className="error">{formik.errors.department}</p>
              ) : null}
            </div>

            <div className="mt-2">
              <TextField
                variant="standard"
                fullWidth
                label="Description"
                name="description"
                type="text"
                multiline
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                required
              />
              {formik.touched.description && formik.errors.description ? (
                <p className="error">{formik.errors.description}</p>
              ) : null}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <div className="mx-2">
              {loading ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <Button type="submit" disabled={formik.isSubmitting}>
                  Update
                </Button>
              )}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

function managerDepartment({ getDepartment }) {
  const data = useSelector((state) => state.department.value);

  //  useEffect(() => {
  //   getDepartment();
  // }, [1]);

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
        id: "department",
        Header: "Department Name",
        accessor: "department",
        width: "30%",
      },
      {
        id: "description",
        Header: "Description",
        accessor: "description",
        Cell: ({ cell }) => {
          return (
            <p style={{ wordWrap: "break-word", maxWidth: "700px" }}>
              {cell.row.original.description}
            </p>
          );
        },
        width: "40%",
      },
      {
        width: "15%",
        id: "edit",
        Header: "Edit",
        Cell: ({ cell }) => {
          return (
            <UpdateDepartment
              getDepartment={getDepartment}
              data={cell.row.original}
            />
          );
        },
      },
      {
        width: "15%",
        id: "delete",
        Header: "Delete",
        Cell: ({ cell }) => {
          return (
            <DeleteIcon
              className="delete"
              onClick={() => {
                deleteDepartment(cell.row.original._id, getDepartment);
              }}
            />
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
                colSpan={1}
                style={{ fontSize: "22px", color: "#1d366d" }}
              >
                <DomainIcon className="mb-1" /> Departments
              </TableCell>
              <TableCell align="right" colSpan={2}>
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
              <TableCell align="left" colSpan={1}>
                <Department getDepartment={getDepartment} />
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
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ArrowDownwardIcon
                            style={{ marginLeft: "2px", fontSize: "18px" }}
                          />
                        ) : (
                          <ArrowUpwardIcon
                            style={{ marginLeft: "2px", fontSize: "18px" }}
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
  );
}

export default managerDepartment;
