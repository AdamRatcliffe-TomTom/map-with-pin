import { Marker } from "maplibre-gl";
import pinImage from "../images/pin.svg";
import styled from "../styled";

const pinMarker = ({ label, icon = "" }) => {
  const container = styled("div")`
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  const marker = styled("div")`
    width: 48px;
    height: 61px;
    background-image: url(${icon}), url(${pinImage});
    background-position: center 16px, center;
    background-repeat: no-repeat;
  `;

  container.appendChild(marker);

  if (label) {
    const text = styled("div")`
      height: 20px;
      color: black;
      font-family: Proxima Nova, Arial, sans-serif;
      font-size: 14px;
      font-weight: 600;
      text-shadow: -1px -1px 0 rgba(255, 255, 255, 0.8),
        1px -1px 0 rgba(255, 255, 255, 0.8), -1px 1px 0 rgba(255, 255, 255, 0.8),
        1px 1px 0 rgba(255, 255, 255, 0.8);
      margin-top: -2px;
    `;
    text.innerHTML = label;

    container.appendChild(text);
  }

  return new Marker({ element: container, anchor: "bottom", offset: [0, 20] });
};

export default pinMarker;
