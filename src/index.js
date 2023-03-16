import { GOSDKConfig } from "@anw/go-sdk-js/core";
import { GOSDKMap } from "@anw/go-sdk-js/map";
import { calculateRoute } from "@anw/go-sdk-js/services";
import { LngLatBounds } from "maplibre-gl";
import logoImage from "./images/logo.svg";
import locationMarker from "./markers/locationMarker";
import pinMarker from "./markers/pinMarker";
import businessPopup from "./businessPopup";
import cooperativeScrollZoom from "./cooperativeScrollZoom";

import "maplibre-gl/dist/maplibre-gl.css";
import "./index.css";

GOSDKConfig.instance.put({
  apiKey: process.env.API_KEY
});

const business = {
  name: "TomTom",
  location: [-121.9180605, 37.3675087],
  icon: logoImage
};

let goSDKMap;
let userLocation;
let bounds;

function initLocation() {
  navigator.geolocation.getCurrentPosition(
    ({ coords: { longitude, latitude } }) => {
      userLocation = [longitude, latitude];
      bounds = new LngLatBounds(business.location, business.location);
      bounds.extend(userLocation);

      initMap();
      showUserLocation();
      showCompanyLocation();
    }
  );
}

function initMap() {
  goSDKMap = new GOSDKMap({
    container: "map",
    zoom: 18,
    minZoom: 2,
    fitBoundsOptions: {
      padding: 100
    },
    bounds
  });
  cooperativeScrollZoom(goSDKMap.mapLibreMap, false);
}

function showUserLocation() {
  const marker = locationMarker();
  marker.setLngLat(userLocation).addTo(goSDKMap.mapLibreMap);
}

async function showCompanyLocation() {
  const marker = pinMarker({ label: business.name, icon: business.icon });
  marker.setLngLat(business.location).addTo(goSDKMap.mapLibreMap);

  let travelTimeInSeconds;

  try {
    const {
      features: [route]
    } = await calculateRoute({
      geoInputs: [userLocation, business.location]
    });
    travelTimeInSeconds = route.properties.summary.travelTimeInSeconds;
  } catch (e) {
    console.log("Unable to calculate route to user location");
  }

  const popup = businessPopup({ ...business, travelTimeInSeconds });
  marker.setPopup(popup);
}

initLocation();
