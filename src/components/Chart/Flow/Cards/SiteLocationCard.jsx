import { Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { meetCondition } from "../../../../state/slices/flowReducer";
import {
  setGeoData,
  setHumanAddress,
} from "../../../../state/slices/geoReducer";
import { GeoCode, lookUpHumanAddress } from "../../../../utils/geocode";
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
      const humanAddr = await lookUpHumanAddress(geoCode);
      if (humanAddr) {
        dispatch(setHumanAddress(humanAddr));
        dispatch(meetCondition(props.id));
      } else {
        dispatch(setHumanAddress(""));
      }
    }
    navigator.geolocation.getCurrentPosition(success);
  };

  return (
    <div>
      <Typography variant="h6" textAlign={"left"}>
        Select Location
      </Typography>
      <ChooseLocation
        onUseLocSvc={handleUseDeviceLocation}
        onChooseAddr={(addr) => {
          dispatch(setHumanAddress(addr?.address?.label));
          console.log(addr);
          dispatch(setGeoData(addr?.position));
        }}
        isUsingGps={isUsingGps}
      />
      <SelectedLocation humanAddr={humanAddr} geoData={geoData} />
    </div>
  );
}
