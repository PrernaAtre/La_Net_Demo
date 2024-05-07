import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, handleClose, handleConfirm }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this document?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleConfirm} color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
