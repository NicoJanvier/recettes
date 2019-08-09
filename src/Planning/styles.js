import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  appBar: {
    position: "sticky",
    background: "white",
    top: "50px",
    zIndex: 1
  },
  gridRow: {
    borderRadius: "8px",
    width: "100%"
  },
  gridRowEditing: {
    border: "2px dashed lightgrey"
  },
  gridItemDate: {},
  dateText: {
    display: "inline-block",
    paddingRight: "8px"
  },
  addBtnCard: {
    order: 1,
    display: "flex",
    justifyContent: "flex-end"
  },
  fabBox: {
    position: "sticky",
    width: "fit-content",
    bottom: "0px",
    marginLeft: "auto",
    paddingBottom: "20px",
    display: "flex",
    flexFlow: "column-reverse",
    alignItems: "center"
  },
  fab: {
    marginTop: "16px"
  },
  dialog: {
    height: "100%"
  },
  dialogContent: {
    padding: 0
  },
  dialogDividers: {
    borderTop: "none"
  },
  recipeCard: {
    width: "100%",
    marginBottom: "16px",
    position: "relative",
    "&:hover": {
      "& .MuiCard-root": {
        backgroundColor: "rgba(0, 0, 0, 0.01)"
      },
      "& button": {
        minWidth: "25px",
        minHeight: "25px",
        transform: "scale(1)"
      }
    }
  },
  rmvBtn: {
    position: "absolute",
    top: "4px",
    right: "4px",
    minHeight: "0px"
  },
  rmvBtnSize: {
    width: "25px",
    height: "25px",
    transform: "scale(0)",
    transition: "all 0.5s"
  },
  rmvIcon: {
    width: "0.8em",
    height: "0.8em"
  }
});

export { useStyles };
