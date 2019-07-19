import { makeStyles } from "@material-ui/styles";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles({
  search: {
    padding: "8px 16px"
  },
  searchBar: {
    position: "sticky",
    background: "white",
    zIndex: 1
  },
  gridContainer: {
    marginTop: "16px"
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  searchIcon: {
    color: "lightgrey",
    marginRight: "6px"
  },
  vegOff: {
    height: "25px",
    width: "25px",
    fontSize: "12px",
    color: "white",
    backgroundColor: green[500]
  },
  vegOn: {
    height: "25px",
    width: "25px",
    fontSize: "12px",
    color: "white",
    backgroundColor: green[800]
  },
  sortDateOn: {
    color: "black"
  },
  sortDateOff: {}
});

export { useStyles };
