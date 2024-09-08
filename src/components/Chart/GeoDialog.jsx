import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptTerms, setGeoData } from "../../state/slices/geoReducer";

export default function AlertDialog() {
  const dispatch = useDispatch();
  const hasAcceptedTerms = useSelector((s) => s.geo.hasAcceptedTerms);
  const [open, setOpen] = React.useState(!hasAcceptedTerms);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const geoSuccess = (geo) => {
    const { coords } = geo;
    const coordsData = { lat: coords.latitude, lng: coords.longitude };
    dispatch(setGeoData(coordsData));
  };

  const handleAccept = () => {
    dispatch(acceptTerms());
    setOpen(false);
    const currGeo = navigator.geolocation.getCurrentPosition(geoSuccess);
  };

  useEffect(() => {
    handleClickOpen();
  }, []);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleAccept} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
