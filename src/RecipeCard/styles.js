import { makeStyles } from "@material-ui/styles";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles({
    cardAction: {
      justifyContent: "flex-end"
    },
    avatar: {
      color: "white",
      backgroundColor: green[500],
      width: "25px",
      height: "25px",
      fontSize: "12px",
      marginRight: "auto",
      marginLeft: "6px"
    },
    selectedCard: {
      backgroundColor: green[100],
    },
  });

export { useStyles };
