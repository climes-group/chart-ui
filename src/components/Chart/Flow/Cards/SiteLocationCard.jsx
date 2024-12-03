import { Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { meetCondition } from "../../../../state/slices/flowReducer";
import {
  setGeoData,
  setHumanAddress,
} from "../../../../state/slices/geoReducer";
import { GeoCode } from "../../../../utils/geocode";
import ChooseLocation from "../../geo/ChooseLocation";
import SelectedLocation from "../../geo/SelectedLocation";

export default function SiteLocationCard(props) {
  const geoData = useSelector((s) => s.geo.geoData);

  const hasAcceptedTerms = useSelector((s) => s.geo.hasAcceptedTerms);
  const humanAddr = useSelector((s) => s.geo.humanAddress);
  const dispatch = useDispatch();

  const [isUsingGps, setIsUsingGps] = useState(false);

  const handleUseDeviceLocation = () => {
    async function success(pos) {
      setIsUsingGps(true);
      const { coords } = pos;
      const geoCode = new GeoCode(coords.latitude, coords.longitude);
      dispatch(setGeoData(geoCode.obj));
      dispatch(setHumanAddress(""));
      dispatch(meetCondition(props?.activeStep?.name));
    }
    navigator.geolocation.getCurrentPosition(success);
  };

  function handleChooseAddr(addr) {
    dispatch(setHumanAddress(addr?.address?.label));
    dispatch(setGeoData(addr?.position));
    dispatch(meetCondition(props?.activeStep?.name));
  }

  return (
    <div>
      <Typography variant="h6" textAlign={"left"}>
        Select Location
      </Typography>
      <ChooseLocation
        onUseLocSvc={handleUseDeviceLocation}
        onChooseAddr={handleChooseAddr}
        isUsingGps={isUsingGps}
      />
      <SelectedLocation humanAddr={humanAddr} geoData={geoData} />
    </div>
  );
}
