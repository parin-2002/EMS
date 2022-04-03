import React from "react";
import { Link, Outlet } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
//icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
//css
import "./componets/Common.css";
import LogoutIcon from "@mui/icons-material/Logout";
import instance from "../others/baseUrl";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { isAuthenticated } from "../redux/auth";
import { useEffect } from "react";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function CNav({
  getDepartment,
  getDesignation,
  getCompanyProfile,
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getDepartment();
    getDesignation();
    getCompanyProfile();
  }, [0]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            EMS
          </Typography>
          <div style={{ position: "absolute", right: "20px" }}>
            <LogoutIcon
              style={{ fontSize: "24px", fontWeight: "600" }}
              onClick={async () => {
                if (confirm("Are you sure?")) {
                  await instance.get("/logout", {
                    withCredentials: true,
                  });
                  dispatch(isAuthenticated({ auth: false }));
                  navigate("/companylogin");
                }
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["home", "profile", "schedule", "emp"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                {index == 0 ? (
                  <Link
                    className="rm-td"
                    to={text == "home" ? "/company" : text}
                  >
                    <DashboardIcon />
                  </Link>
                ) : null}
                {index == 1 ? (
                  <Link
                    className=" rm-td"
                    to={text == "home" ? "/company" : text}
                  >
                    <AccountCircleIcon />
                  </Link>
                ) : null}
                {index == 2 ? (
                  <Link
                    className="rm-td"
                    to={text == "home" ? "/company" : text}
                  >
                    <DateRangeIcon />
                  </Link>
                ) : null}
                {index == 3 ? (
                  <Link
                    className=" rm-td"
                    to={text == "home" ? "/company" : text}
                  >
                    <PeopleAltIcon />
                  </Link>
                ) : null}
              </ListItemIcon>
              {/* <ListItemText primary={text} /> */}
              <Link
                className="text-dark rm-td"
                to={text == "home" ? "/company" : text}
              >
                <ListItemText>
                  {text == "emp"
                    ? "Manage employee"
                    : text.charAt(0).toUpperCase() +
                      text.substr(1).toLowerCase()}
                </ListItemText>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["attendance", "leave", "salary"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                {index == 0 ? (
                  <Link className=" rm-td" to={text}>
                    <AccessAlarmIcon />
                  </Link>
                ) : null}
                {index == 1 ? (
                  <Link className="rm-td" to={text}>
                    <NoteAltIcon />
                  </Link>
                ) : null}
                {index == 2 ? (
                  <Link className=" rm-td" to={text}>
                    <AccountBalanceIcon />
                  </Link>
                ) : null}
              </ListItemIcon>
              <Link className="text-dark rm-td" to={text}>
                <ListItemText>
                  {text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()}
                </ListItemText>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
