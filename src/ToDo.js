import { React, useEffect, useState } from "react";
import "./App.css";
import List from "@mui/material/List";
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
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

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
  const [open, setOpen] = useState(false);
  const [searchOpen, setSeachOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainContent, setMainContent] = useState([...data])
  const [displayContent, setDisplayContent] = useState([...mainContent]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSearchOpen = () => setSeachOpen(true);
  const handleSearchClose = () => setSeachOpen(false);

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    let filteredData = mainContent.filter((item) => {
      if (event.target.value === "") {
        return true; // Show all items when no filter is selected
      }
      return item.isDone === event.target.value 
    });
    setDisplayContent([...filteredData]);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.search.value;
    setSearchQuery(query);
    let filteredData = mainContent.filter((item) => {
      if (event.target.value === "") {
        return true; // Show all items when no filter is selected
      }
      return item.title.includes(event.target.search.value) || item.body.includes(event.target.search.value) 
    });
    setDisplayContent([...filteredData]);
    handleSearchClose();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleReset = () => {
    setDisplayContent([...mainContent])
    setFilterValue("");
    setSearchQuery("");
    setIsDropdownOpen(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("https://jsonplaceholder.typicode.com/posts", {
        title: event.target.title.value,
        body: event.target.desc.value,
        userId: 1,
      })
      .then((res) => {
        let newToDo = res.data;
        newToDo.isDone = false;
        setMainContent([newToDo, ...mainContent])
        setDisplayContent([newToDo, ...mainContent])
      });

    handleClose();
  };
  const handleDelete = (id, arIdx) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    let newData = mainContent.filter((el, idx) => idx !== arIdx)
    setMainContent([...newData]);
    setDisplayContent([...newData]);
  };

  const handleDone = (index) => {
    let newData = mainContent.slice();
    newData[index].isDone = newData[index]["isDone"] === "true" ? "false" : "true";
    setMainContent([...newData]);
  };

  useEffect(() => {}, [mainContent]);

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
          <List sx={{ mb: 2, mt: 6 }} className="contentBox">
            {displayContent ? displayContent.map(({ id, title, body, isDone }, arIdx) => (
              <div key={arIdx}>
                <div className="todoRow">
                  <div className="row-part-1">
                    <h3>{arIdx + 1}.</h3>
                    <div className="ListItem" onClick={() => handleDone(arIdx)}>
                      <span
                        className={
                          isDone == "true" ? "heading strikeThrough" : "heading"
                        }
                      >
                        <h4>{" "}
                        {title}{" "}</h4>
                      </span>
                      <ListItemText secondary={body} />
                    </div>
                  </div>
                  <IconButton
                    id="button1"
                    color="inherit"
                    onClick={() => handleDelete(id, arIdx)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
                <Divider className="divider" component="li" />
              </div>
            )) : null}
          </List>
        </Paper>
        <AppBar
          position="fixed"
          sx={{ top: "auto", bottom: 0, background: "#2e2d2d" }}
        >
          <Toolbar>
            {(filterValue !== "" || searchQuery !== "") && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleReset}
              >
                <RestartAltIcon />
              </IconButton>
            )}
            <StyledFab color="secondary" aria-label="add" onClick={handleOpen}>
              <AddIcon />
            </StyledFab>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit" onClick={handleSearchOpen}>
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit" onClick={toggleDropdown}>
              <FilterAltIcon />
            </IconButton>
            {isDropdownOpen && (
              <select value={filterValue} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="true">Done</option>
                <option value="false">Not Done</option>
              </select>
            )}
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
      <Modal
        open={searchOpen}
        onClose={handleSearchClose}
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
            Search in ur ToDo List
          </Typography>
          <form sx={{ width: 1 }} onSubmit={handleSearch}>
            <TextField
              sx={{ mt: 4 }}
              fullWidth
              defaultValue={searchQuery}
              label="Search here..."
              id="search"
              name="search"
            />
            <Button sx={{ mt: 2 }} type="submit" variant="outlined">
              SEARCH
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default ToDo;
