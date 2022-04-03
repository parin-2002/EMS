import React, { useState, useEffect } from "react";
import "@fullcalendar/react/dist/vdom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from "../../notification/notify";
import instance from "../../others/baseUrl";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { isEmpAuthenticated } from "../../redux/auth";
import DialogTitle from "@mui/material/DialogTitle";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function Eschedule() {
  const empprofile = useSelector((state) => state.empprofile.value);
  const [weekends, setWeekends] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, changeLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();

  const handleDateSelect = (selectInfo) => {
    setOpen(true);
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
  };

  async function getEvents() {
    try {
      const result = await instance.get("/api/emp/selectevents", {
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
        dispatch(isEmpAuthenticated({ auth: false }));
      }
    }
  }

  useEffect(() => {
    getEvents();
  }, [1]);

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      start: "",
      type: "",
      backgroundColor: "#1976d2",
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
        const result = await instance.post("/api/emp/addevent", values, {
          withCredentials: true,
        });
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
          dispatch(isEmpAuthenticated({ auth: false }));
        }
      }
    },
  });

  function renderEventContent(eventInfo) {
    const eempid = eventInfo.event.extendedProps.employeeId;
    const empid = empprofile._id;

    return (
      <>
        <div>
          <b className="me-1">{eventInfo.timeText}</b>
          <span>{eventInfo.event.title}</span>
          {eempid == empid ? (
            <i className="fas fa-times" style={{ marginLeft: "5px" }}></i>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }

  async function deleteEvent(info) {
    try {
      if (confirm("do you want to delete this event?")) {
        //console.log(info.event.extendedProps._id);
        const result = await instance.delete(
          `/api/emp/deleteevent?id=${info.event.extendedProps._id}`,
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
        dispatch(isEmpAuthenticated({ auth: false }));
      }
    }
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
                        name="allDay"
                        checked={formik.values.allDay}
                        value={true}
                        onChange={formik.handleChange}
                      />
                      AllDay
                    </div>
                  </div>

                  <div className="mt-3">
                    <TextField
                      className="form-control"
                      label="Set Color"
                      name="backgroundColor"
                      type="color"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.backgroundColor}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={
                        formik.touched.start &&
                        Boolean(formik.errors.backgroundColor)
                      }
                      required
                    />
                    {formik.touched.backgroundColor &&
                    formik.errors.backgroundColor ? (
                      <p className="error">{formik.errors.backgroundColor}</p>
                    ) : null}
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
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={weekends}
            events={events}
            select={handleDateSelect}
            eventContent={renderEventContent}
            eventClick={(info) => {
              info.jsEvent.preventDefault();
              if (info.jsEvent.target.tagName == "I") {
                deleteEvent(info);
              } else if (info.event.url) {
                window.open(info.event.url, "_blank");
              }
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

export default Eschedule;
