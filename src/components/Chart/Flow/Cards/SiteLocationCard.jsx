import { GeoCode, lookUpHumanAddress } from "@/utils/geocode";
import { Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { meetCondition } from "../../../../state/slices/flowReducer";
import {
  setGeoData,
  setHumanAddress,
} from "../../../../state/slices/geoReducer";
import ChooseLocation from "../../geo/ChooseLocation";
import SelectedLocation from "../../geo/SelectedLocation";

function SiteLocationCard(props) {
  const geoData = useSelector((s) => s.geo.geoData);
  const humanAddr = useSelector((s) => s.geo.humanAddress);
  const dispatch = useDispatch();

  const handleUseDeviceLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { coords } = pos;
      const geoCode = new GeoCode(coords.latitude, coords.longitude);
      dispatch(setGeoData(geoCode.obj));

      const addressLabel = await lookUpHumanAddress(geoCode);
      dispatch(setHumanAddress(addressLabel || "Current Location"));

      dispatch(meetCondition({ name: props?.activeStep?.name }));
    });
  };

  function handleChooseAddr(addr) {
    dispatch(setHumanAddress(addr?.address?.label));
    dispatch(setGeoData(addr?.position));
    dispatch(meetCondition({ name: props?.activeStep?.name }));
  }

  return (
    <Card variant="outlined" sx={{ border: "none", bgcolor: "transparent" }}>
      <CardContent>
        <Typography variant="h5" component="h2" textAlign={"left"} gutterBottom>
          Select Site Location
        </Typography>
        <Typography
          variant="body1"
          textAlign={"left"}
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Find the location of the site by searching for an address or using
          your device's location.
        </Typography>

        <ChooseLocation
          onUseLocSvc={handleUseDeviceLocation}
          onChooseAddr={handleChooseAddr}
        />

        {(geoData || humanAddr) && (
          <SelectedLocation humanAddr={humanAddr} geoData={geoData} />
        )}
      </CardContent>
    </Card>
  );
}

SiteLocationCard.defaultProps = {
  activeStep: { name: "" },
};

SiteLocationCard.propTypes = {
  activeStep: PropTypes.object,
};

export default SiteLocationCard;
