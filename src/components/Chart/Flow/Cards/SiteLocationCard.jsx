import { meetCondition } from "@/state/slices/flowReducer";
import {
  setGeoData,
  setHumanAddress,
} from "@/state/slices/geoReducer";
import { GeoCode, lookUpHumanAddress } from "@/utils/geocode";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
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
    <div>
      <h2 className="heading-card mb-1">Select Site Location</h2>
      <p className="body-muted mb-4">
        Find the location of the site by searching for an address or using your
        device&apos;s location.
      </p>

      <div className="space-y-6 bg-card/40 border border-border rounded-lg p-4 md:p-6">
        <ChooseLocation
          onUseLocSvc={handleUseDeviceLocation}
          onChooseAddr={handleChooseAddr}
        />

        {(geoData || humanAddr) && (
          <SelectedLocation humanAddr={humanAddr} geoData={geoData} />
        )}
      </div>
    </div>
  );
}

SiteLocationCard.defaultProps = {
  activeStep: { name: "" },
};

SiteLocationCard.propTypes = {
  activeStep: PropTypes.object,
};

export default SiteLocationCard;
