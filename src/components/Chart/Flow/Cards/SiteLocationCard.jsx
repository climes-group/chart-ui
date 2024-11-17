import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  meetCondition,
  setConditions,
} from "../../../../state/slices/flowReducer";
import {
  setGeoData,
  setHumanAddress,
} from "../../../../state/slices/geoReducer";
import AddrSearchResults from "../../geo/AddrSearchResults";
import SelectedAddr from "../../geo/SelectedAddr";
const FlexRow = styled.div`
  display: flex;
  height: 48px;
  justify-content: space-between;
  align-items: center;

  > div {
    display: flex;
    align-items: center;
  }
`;

class GeoCode {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
  get str() {
    return `${this.lat},${this.lng}`;
  }
  get obj() {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }
}

export default function SiteLocationCard(props) {
  const geoData = useSelector((s) => s.geo.geoData);
  console.log("geoData", geoData);
  const hasAcceptedTerms = useSelector((s) => s.geo.hasAcceptedTerms);
  const humanAddr = useSelector((s) => s.geo.humanAddress);
  const { lat, lng } = geoData || {};
  const geoString = geoData ? `Latitude: ${lat}, longitude: ${lng}` : "";
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEO_API_KEY;
  const useGeoApi = import.meta.env.VITE_FF_USE_GEO_API;

  useEffect(() => {
    dispatch(setConditions([false]));
  }, []);

  async function lookUpHumanAddress(geo) {
    const { coords } = geo;

    const geoCode = new GeoCode(coords.latitude, coords.longitude);
    dispatch(setGeoData(geoCode.obj));
    dispatch(meetCondition(0));
    if (!apiKey || useGeoApi !== "true") {
      return;
    }

    const baseGeoCodeApi = `https://geocode.search.hereapi.com/v1/geocode`;

    const finalUrl = `${baseGeoCodeApi}?q=${geoCode.str}&apikey=${apiKey}`;
    console.log(finalUrl);
    try {
      const resp = await fetch(finalUrl);
      const jsonResp = await resp.json();
      console.log(jsonResp);
      if (jsonResp?.plus_code?.compound_code) {
        console.log("Setting Human Address");
        dispatch(setHumanAddress(jsonResp?.plus_code?.compound_code));
      }
    } catch (e) {
      console.error(e);
    }
  }

  const useDeviceLocation = () => {
    navigator.geolocation.getCurrentPosition(lookUpHumanAddress);
    dispatch(setHumanAddress(""));
  };

  return (
    <div>
      <Typography variant="h6" textAlign={"left"}>
        Select Location
      </Typography>
      <AddrSearchResults
        onClickUseDeviceLocation={useDeviceLocation}
        handleAddrChoose={(addr) => {
          dispatch(setHumanAddress(addr?.address?.label));
          console.log(addr);
          dispatch(setGeoData(addr?.position));
        }}
      />
      <SelectedAddr
        humanAddr={humanAddr}
        geoData={geoData}
        hasAcceptedTerms={hasAcceptedTerms}
      />
    </div>
  );
}
