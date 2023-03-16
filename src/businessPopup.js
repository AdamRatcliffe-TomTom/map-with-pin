import { Popup } from "maplibre-gl";
import formatDuration from "./helpers/formatDuration";
import styled from "./styled";

const businessPopup = ({ name, location, travelTimeInSeconds }) => {
  const container = styled("div")`
    padding: 4px;
  `;

  const title = styled("h3")`
    font-family: Gilroy, Arial, sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 8px;
  `;
  title.innerHTML = name;

  container.appendChild(title);

  const popupContent = styled("div")`
    color: #727c85;
    font-family: Proxima Nova, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.2;
  `;
  const text = travelTimeInSeconds
    ? `${formatDuration(travelTimeInSeconds)} from your location`
    : "No route available from your location";
  popupContent.innerHTML = text;

  container.appendChild(popupContent);

  const popup = new Popup({
    closeButton: false,
    offset: [0, -60]
  })
    .setLngLat(location)
    .setDOMContent(container);

  return popup;
};

export default businessPopup;
