import { makeStyles } from "@material-ui/styles";
import { green, grey } from "@material-ui/core/colors";

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
      backgroundColor: green[200],
    },
    notesFieldIcon: {
      color: grey[500],
    },
    notesFieldButton: {
      padding: "0px 0px 0px 8px",
    }
  });

export { useStyles };
