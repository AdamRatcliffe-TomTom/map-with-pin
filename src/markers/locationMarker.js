import { Marker } from "maplibre-gl";
import styled from "../styled";

const locationMarker = () => {
  const element = styled("div")`
    width: 24px;
    height: 24px;
    background: #1988cf;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.15);
  `;

  return new Marker({ element, anchor: "bottom" });
};

export default locationMarker;
