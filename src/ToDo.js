import { React, useEffect, useState } from "react";
import "./App.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
});
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
};
function ToDo({ data }) {
  //   const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [state, setState] = useState(0);
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("https://jsonplaceholder.typicode.com/posts", {
        title: event.target.title.value,
        body: event.target.desc.value,
        userId: 1,
      })
      .then((res) => {
        data.unshift(res.data);
        console.log(data);
        setState(state + 1);
      });

    console.log(data);
    handleClose();
  };
  const handleDelete = (id, arIdx) => { 
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
    delete data[arIdx];
    setState(state + 1);
    // console.log(arIdx);
  }
  useEffect(() => {
    // console.log(data)
  }, [state]);
  return (
    <div className="App">
      <div>
        <CssBaseline />
        <Paper square sx={{ pb: "50px" }}>
          <Typography
            variant="h5"
            gutterBottom
            component="div"
            className="header"
          >
            ToDos
          </Typography>
          <List sx={{ mb: 2, mt: 4 }}>
            {data.map(({ id, title, body, person }, arIdx) => (
              <div key={arIdx}>
                <div className = "todoRow">
                  <ListItem button>
                    <ListItemText primary={title} secondary={body} />
                  </ListItem>
                  <IconButton id="button1" color="inherit" onClick={() => handleDelete(id, arIdx)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
                <Divider className="divider" component="li" />
              </div>
            ))}
          </List>
        </Paper>
        <AppBar
          position="fixed"
          color="primary"
          sx={{ top: "auto", bottom: 0 }}
        >
          <Toolbar>
            <IconButton color="inherit" aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <StyledFab color="secondary" aria-label="add" onClick={handleOpen}>
              <AddIcon />
            </StyledFab>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <MoreIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Add a thing to do
          </Typography>
          <form sx={{ width: 1 }} onSubmit={handleSubmit}>
            <TextField
              sx={{ mt: 4 }}
              fullWidth
              label="Title"
              id="title"
              name="title"
            />
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              label="Description"
              id="desc"
              name="desc"
            />
            <Button sx={{ mt: 2 }} type="submit" variant="outlined">
              ADD
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default ToDo;
