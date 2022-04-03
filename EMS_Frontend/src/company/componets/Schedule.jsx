import React, { useState, useEffect } from "react";
import "@fullcalendar/react/dist/vdom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./Common.css";
import { useFormik } from "formik";
import * as yup from "yup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from "../../notification/notify";
import instance from "../../others/baseUrl";
import { isAuthenticated } from "../../redux/auth";
import { useDispatch } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function Schedule() {
  const [weekends, setWeekends] = useState(true);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, changeLoading] = useState(false);
  const [eventType, setEventType] = useState([]);
  const [events, setEvents] = useState([]);
  const [showDelete, setShowDelete] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      start: "",
      type: "",
      backgroundColor: "",
      end: "",
      allDay: false,
      url: "",
    },
    validationSchema: yup.object({
      title: yup.string().required("Required"),
      start: yup.date().required("Required"),
      type: yup.string().required("Required"),
      backgroundColor: yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        changeLoading(true);
        const result = await instance.post(
          "/api/company/manageemp/addevent",
          values,
          {
            withCredentials: true,
          }
        );
        if (result) {
          setEvents([...events, result.data.result]);
          formik.resetForm();
          setOpen(false);
          changeLoading(false);
          notifySuccess("Event Added Successfully");
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

  async function getEvents() {
    try {
      const result = await instance.get("/api/company/manageemp/selectevents", {
        withCredentials: true,
      });
      if (result) {
        setEvents(result.data.result);
      }
    } catch (err) {
      setEvents([]);
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
    getEvents();
  }, [1]);

  async function getEventTypes() {
    try {
      const result = await instance.get("/api/company/manageemp/geteventtype", {
        withCredentials: true,
      });
      if (result) {
        setEventType(result.data.result);
      }
    } catch (err) {
      setEventType();
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isAuthenticated({ auth: false }));
      }
    }
  }

  async function deleteEventType(id) {
    try {
      if (confirm("Are you sure?")) {
        notifyInfo("Request is sent it might take sometime.");
        const result = await instance.delete(
          `/api/company/manageemp/deleteeventtype?id=${id}`,
          {
            withCredentials: true,
          }
        );
        if (result) {
          notifySuccess(result.data.result);
          getEventTypes();
        }
      }
    } catch (err) {
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isAuthenticated({ auth: false }));
      }
    }
  }

  async function deleteEvent(info) {
    try {
      if (confirm("do you want to delete this event?")) {
        // console.log(info.event.extendedProps._id);
        const result = await instance.delete(
          `/api/company/manageemp/deleteevent?id=${info.event.extendedProps._id}`,
          {
            withCredentials: true,
          }
        );
        if (result) {
          notifySuccess(result.data.result);
          info.event.remove();
          getEvents();
        }
      }
    } catch (err) {
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isAuthenticated({ auth: false }));
      }
    }
  }

  async function editEvent(info) {
    try {
      const result = await instance.put(
        "/api/company/manageemp/editevent",
        {
          start: info.event.start,
          end: info.event.end,
          id: info.event.extendedProps._id,
        },
        {
          withCredentials: true,
        }
      );
      if (result) {
        notifySuccess(result.data.result);
        getEvents();
      }
    } catch (err) {
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isAuthenticated({ auth: false }));
      }
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateSelect = (selectInfo) => {
    let start = new Date(selectInfo.start);
    start = `${start.getFullYear()}-${start.getMonth() > 9 ? "" : 0}${
      start.getMonth() + 1
    }-${start.getDate() > 9 ? "" : 0}${start.getDate()}T00:00`;
    let end = new Date(selectInfo.end);
    end = `${end.getFullYear()}-${end.getMonth() > 9 ? "" : 0}${
      end.getMonth() + 1
    }-${end.getDate() > 9 ? "" : 0}${end.getDate()}T00:00`;
    formik.setFieldValue("start", start);
    formik.setFieldValue("end", end);
    getEventTypes();
    setOpen(true);
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
  };

  function renderEventContent(eventInfo) {
    return (
      <>
        <div>
          <b className="me-1">{eventInfo.timeText}</b>
          <span>{eventInfo.event.title}</span>
          <i className="fas fa-times" style={{ marginLeft: "5px" }}></i>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        {open ? (
          <div>
            <Dialog open={open} onClose={handleClose}>
              <form onSubmit={formik.handleSubmit} style={{ width: "500px" }}>
                <DialogContent>
                  <DialogContentText>Add Event</DialogContentText>
                  <div className="mt-3">
                    <TextField
                      className="form-control"
                      label="Title"
                      name="title"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.title}
                      error={
                        formik.touched.title && Boolean(formik.errors.title)
                      }
                      required
                    />
                    {formik.touched.title && formik.errors.title ? (
                      <p className="error">{formik.errors.title}</p>
                    ) : null}
                  </div>
                  <div className="mt-3">
                    <TextField
                      className="form-control"
                      label="Start Time"
                      name="start"
                      type="datetime-local"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.start}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={
                        formik.touched.start && Boolean(formik.errors.start)
                      }
                      required
                    />
                    {formik.touched.start && formik.errors.start ? (
                      <p className="error">{formik.errors.start}</p>
                    ) : null}
                  </div>
                  <div className="mt-3 row">
                    <div className="col-9">
                      <TextField
                        className="form-control"
                        label="End Time"
                        name="end"
                        type="datetime-local"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.end}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={formik.touched.end && Boolean(formik.errors.end)}
                      />
                      {formik.touched.end && formik.errors.end ? (
                        <p className="error">{formik.errors.end}</p>
                      ) : null}
                    </div>
                    <div className="col mt-2">
                      <Checkbox
                        {...label}
                        checked={formik.values.allDay}
                        name="allDay"
                        value={true}
                        onChange={formik.handleChange}
                      />
                      AllDay
                    </div>
                  </div>
                  <div className="mt-3 row">
                    <div className="col-9">
                      <FormControl fullWidth>
                        <InputLabel>Event Category</InputLabel>
                        <Select
                          label="Event Category"
                          name="backgroundColor"
                          value={formik.values.backgroundColor}
                          onChange={formik.handleChange}
                          onBlur={(e) => {
                            formik.handleBlur(e);
                            setShowDelete(false);
                          }}
                          onFocus={() => setShowDelete(true)}
                          error={
                            formik.touched.backgroundColor &&
                            Boolean(formik.errors.backgroundColor)
                          }
                          required
                        >
                          {eventType?.map((one, index) => {
                            return (
                              <MenuItem key={index} value={one.backgroundColor}>
                                <div className="d-flex justify-content-between w-100">
                                  <div> {one.type}</div>
                                  <div>
                                    {showDelete ? (
                                      <DeleteIcon
                                        className="delete"
                                        onClick={() => {
                                          deleteEventType(one._id);
                                        }}
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      {formik.touched.backgroundColor &&
                      formik.errors.backgroundColor ? (
                        <p className="error" style={{ margin: "0px" }}>
                          {formik.errors.type}
                        </p>
                      ) : null}
                    </div>
                    <div className="col">
                      <AddEventType getEventTypes={getEventTypes} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <FormControl fullWidth>
                      <InputLabel>Event Type</InputLabel>
                      <Select
                        label="Event Type"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.type && Boolean(formik.errors.type)
                        }
                        required
                      >
                        <MenuItem value="public">Public</MenuItem>
                        <MenuItem value="private">Private</MenuItem>
                      </Select>
                    </FormControl>
                    {formik.touched.type && formik.errors.type ? (
                      <p className="error" style={{ margin: "0px" }}>
                        {formik.errors.type}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-3">
                    <TextField
                      className="form-control"
                      label="Link"
                      name="url"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.url}
                      error={formik.touched.url && Boolean(formik.errors.url)}
                    />
                    {formik.touched.url && formik.errors.url ? (
                      <p className="error">{formik.errors.url}</p>
                    ) : null}
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  {loading ? (
                    <CircularProgress style={{ color: "#1d366d" }} />
                  ) : (
                    <Button type="submit">Add Event</Button>
                  )}
                </DialogActions>
              </form>
            </Dialog>
          </div>
        ) : (
          ""
        )}
      </div>

      <div>
        <div style={{ width: "100%" }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            height="80vh"
            timeZone="local"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={weekends}
            events={events}
            eventClick={(info) => {
              info.jsEvent.preventDefault();
              if (info.jsEvent.target.tagName == "I") {
                deleteEvent(info);
              } else if (info.event.url) {
                window.open(info.event.url, "_blank");
              }
            }}
            select={handleDateSelect}
            eventContent={renderEventContent}
            eventChange={(info) => {
              editEvent(info);
            }}
          />
        </div>
        <div className="mt-1">
          <Button variant="contained" onClick={() => setWeekends(!weekends)}>
            {weekends ? "hide weekends" : "show weekends"}
          </Button>
        </div>
      </div>
    </>
  );
}

function AddEventType({ getEventTypes }) {
  const dispatch = useDispatch();
  const [loading, changeLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      type: "",
      backgroundColor: "#1976d2",
    },
    validationSchema: yup.object({
      type: yup.string().required("Required"),
      backgroundColor: yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        changeLoading(true);
        const result = await instance.post(
          "/api/company/manageemp/addeventtype",
          values,
          {
            withCredentials: true,
          }
        );
        if (result) {
          getEventTypes();
          changeLoading(false);
          notifySuccess(result.data.result);
          formik.resetForm();
          setOpen(false);
        }
      } catch (err) {
        changeLoading(false);
        notifyError(err.response.data.message);
        if (
          err.response.data.message == "invalid token" ||
          err.response.data.message == "Access Denied! Unauthorized User"
        ) {
          console.log("hi");
          dispatch(isAuthenticated({ auth: false }));
        }
      }
    },
  });

  return (
    <div>
      <Button
        variant="contained"
        className="mt-2 ms-1"
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle className="px-5 mx-5">Add Event Category</DialogTitle>
          <DialogContent>
            <div className="mt-2">
              <TextField
                variant="standard"
                fullWidth
                label="Event Type"
                name="type"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.type}
                error={formik.touched.type && Boolean(formik.errors.type)}
                required
              />
              {formik.touched.type && formik.errors.type ? (
                <p className="error">{formik.errors.type}</p>
              ) : null}
            </div>

            <div className="mt-2">
              <TextField
                variant="standard"
                fullWidth
                label="Pic Color"
                name="backgroundColor"
                type="color"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.backgroundColor}
                error={
                  formik.touched.backgroundColor &&
                  Boolean(formik.errors.backgroundColor)
                }
                required
              />
              {formik.touched.backgroundColor &&
              formik.errors.backgroundColor ? (
                <p className="error">{formik.errors.backgroundColor}</p>
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
                  Add
                </Button>
              )}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Schedule;
