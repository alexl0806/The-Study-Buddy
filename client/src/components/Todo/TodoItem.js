import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Collapse, makeStyles } from "@material-ui/core";
import DayJsUtils from "@date-io/dayjs";
import dayjs from "dayjs";

import { updateTodo, deleteTodo, createTodo } from "../../actions/todos";
import PrioMenu from "./PrioMenu";

import {
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import {
  IconButton,
  Button,
  Typography,
  Grid,
  Box,
  TextField,
  Divider,
  Tooltip,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import LabelIcon from "@material-ui/icons/Label";
import FlagIcon from "@material-ui/icons/Flag";

const useStyles = makeStyles((theme) => ({
  task: {
    border: "1px solid grey",
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(2),
    },
    padding: theme.spacing(1),
  },
  taskInner: {
    padding: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      direction: "row",
      flexWrap: "nowrap",
    },
    direction: "column",
    flexWrap: "wrap",
  },
  formButton: {
    marginRight: theme.spacing(1),
  },
  buttonText: {
    marginLeft: theme.spacing(1),
  },
  mobileEditIcons: {
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
    justifyContent: "center",
  },
  mobileDatePicker: {
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-start",
    },
    justifyContent: "center",
  },
  mobileIconsDisplay: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
    display: "flex",
  },
  desktopIconsDisplay: {
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
    display: "none",
  },
}));

const TodoItem = ({ todoData, isNew, setNew }) => {
  const classes = useStyles();

  //State of to-do item (edit mode)
  const [editing, setEditing] = useState(isNew);

  //To-do data
  const [todo, setTodo] = useState({
    title: todoData.title,
    dateDue: todoData.dateDue,
    repeatOption: todoData.repeatOption,
    dateCreated: todoData.dateCreated,
    priority: todoData.priority,
  });

  //To-do data in edit mode before being saved
  const [editTodo, setEditTodo] = useState(todo);

  //State of prio menu
  const [prioMenuIsOpen, setPrioMenuIsOpen] = useState(false);
  const [prioAnchorEl, setPrioAnchorEl] = useState(null);

  /*
  Should the to-do data be modified from outside the component,
  update the to-do item accordingly. Needed to update the default
  due date/time for the new to-do item whenever the add task button
  is pressed
  */
  useEffect(() => {
    setTodo({
      title: todoData.title,
      dateDue: todoData.dateDue,
      repeatOption: todoData.repeatOption,
      dateCreated: todoData.dateCreated,
      priority: todoData.priority,
    });
    setEditTodo({
      title: todoData.title,
      dateDue: todoData.dateDue,
      repeatOption: todoData.repeatOption,
      dateCreated: todoData.dateCreated,
      priority: todoData.priority,
    });
  }, [todoData]);

  const dispatch = useDispatch();

  //Opens to-do item edit mode
  const handleEditOpen = () => {
    setEditing(true);
  };

  //Closes to-do item edit mode
  const handleEditClose = () => {
    setEditing(false);
  };

  //Cancels changes made in edit mode
  const handleEditCancel = () => {
    setEditTodo(todo);

    if (isNew) {
      setNew(false);
    } else {
      handleEditClose();
    }
  };

  //Saves changes made in edit mode
  const handleEditSave = () => {
    if (isNew) {
      setNew(false);
      dispatch(createTodo(editTodo));
      setEditTodo(todo);
    } else {
      dispatch(updateTodo(todoData._id, editTodo));
      setTodo(editTodo);
      handleEditClose();
    }
  };

  //Open/close add menu
  const togglePrioMenu = (event) => {
    setPrioMenuIsOpen(!prioMenuIsOpen);
    setPrioAnchorEl(prioAnchorEl === null ? event.currentTarget : null);
  };

  //Deletes to-do item
  const deleteTodoItem = () => {
    dispatch(deleteTodo(todoData._id));
  };

  const prioColor = () => {
    switch (todo.priority) {
      case 1:
        return "#cc3232";
      case 2:
        return "#db7b2b";
      case 3:
        return "#e7b416";
      case 4:
        return "#2dc937";
    }
  };

  //To-do item edit mode
  const displayEdit = (
    <MuiPickersUtilsProvider utils={DayJsUtils}>
      <Box
        width={1}
        display={editing ? "box" : "none"}
        className={classes.task}
      >
        <Grid container direction="column">
          <Collapse
            in={editing}
            collapsedSize={80}
            style={{ width: "inherit" }}
          >
            <Grid
              container
              item
              alignItems="center"
              className={classes.taskInner}
            >
              <Grid item>
                <TextField
                  variant="outlined"
                  placeholder="Task Title"
                  value={editTodo.title}
                  onChange={(e) =>
                    setEditTodo({ ...editTodo, title: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Divider />
            <Grid
              container
              item
              className={classes.taskInner}
              alignItems="center"
            >
              <Grid container item className={classes.mobileDatePicker}>
                <DateTimePicker
                  variant="inline"
                  format="HH:mm - MMM DD, YYYY"
                  value={editTodo.dateDue}
                  onChange={(e) => setEditTodo({ ...editTodo, dateDue: e })}
                  label="Due Date"
                />
              </Grid>
              <Grid container item justifyContent="center">
                <ToggleButtonGroup
                  value={editTodo.repeatOption}
                  exclusive
                  onChange={(e, newRepeat) =>
                    setEditTodo({ ...editTodo, repeatOption: newRepeat })
                  }
                  size="small"
                  style={{ padding: "1rem" }}
                >
                  <ToggleButton value="None">
                    <Typography>None</Typography>
                  </ToggleButton>
                  <ToggleButton value="Daily">
                    <Typography>Daily</Typography>
                  </ToggleButton>
                  <ToggleButton value="Weekly">
                    <Typography>Weekly</Typography>
                  </ToggleButton>
                  <ToggleButton value="Monthly">
                    <Typography>Monthly</Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid container item className={classes.mobileEditIcons}>
                <Tooltip title="tags" placement="top">
                  <IconButton>
                    <LabelIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="priority" placement="top">
                  <IconButton onClick={togglePrioMenu}>
                    <FlagIcon style={{ color: `${prioColor()}` }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container item className={classes.mobileEditIcons}>
              <Grid item>
                <Button
                  className={classes.formButton}
                  onClick={handleEditSave}
                  variant="contained"
                  color="primary"
                >
                  <CheckCircleOutlineIcon />
                  <Typography className={classes.buttonText}>
                    {isNew ? "Add Task" : "Save Task"}
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  className={classes.formButton}
                  onClick={handleEditCancel}
                  variant="contained"
                  color="secondary"
                >
                  <CancelOutlinedIcon />
                  <Typography className={classes.buttonText}>Cancel</Typography>
                </Button>
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </Box>
      <PrioMenu
        isOpen={prioMenuIsOpen}
        togglePrioMenu={togglePrioMenu}
        anchor={prioAnchorEl}
        editTodo={editTodo}
        setEditTodo={setEditTodo}
      />
    </MuiPickersUtilsProvider>
  );

  return (
    <>
      <Box
        width={1}
        className={classes.task}
        style={editing ? { display: "none" } : { display: "flex" }}
      >
        <Grid container direction="column" alignItems="center" wrap="nowrap">
          <Grid
            container
            item
            alignItems="center"
            direction="row"
            wrap="nowrap"
          >
            <Grid item>
              <IconButton>
                <CheckBoxOutlineBlankIcon />
              </IconButton>
              <Tooltip title="edit" placement="top">
                <IconButton
                  onClick={handleEditOpen}
                  className={classes.mobileIconsDisplay}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="delete" placement="top">
                <IconButton
                  onClick={deleteTodoItem}
                  className={classes.mobileIconsDisplay}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid
              item
              container
              alignItems="center"
              className={classes.taskInner}
            >
              <Grid item>
                <Typography variant="h5">{todo.title}</Typography>
                <Typography noWrap variant="subtitle1">
                  {`Due Date: ${dayjs(todo.dateDue).format(
                    "HH:mm on MMM DD, YYYY"
                  )}`}
                </Typography>
              </Grid>
              <Grid
                container
                item
                justifyContent="flex-end"
                className={classes.desktopIconsDisplay}
              >
                <Tooltip title="edit" placement="top">
                  <IconButton onClick={handleEditOpen}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="delete" placement="top">
                  <IconButton onClick={deleteTodoItem}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Collapse in={editing}>
              <div style={{ height: 120 }} />
            </Collapse>
          </Grid>
        </Grid>
      </Box>
      {displayEdit}
    </>
  );
};

export default TodoItem;
