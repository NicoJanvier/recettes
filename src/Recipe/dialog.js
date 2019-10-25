import React from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
const DeleteDialog = ({ open, setOpen, onDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogContent>
        <DialogContentText>
          {"Êtes-vous sûr de vouloir supprimer la recette ?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDelete} color="primary">SUPPRIMER</Button>
        <Button onClick={() => setOpen(false)} color="primary">ANNULER</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
