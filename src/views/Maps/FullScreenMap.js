import React from "react";

// react-bootstrap components
import {
  Badge,
  Button,
  Form,
  InputGroup,
  Navbar,
  Nav,
  Container,
} from "react-bootstrap";

function FullScreenMap() {
  const mapRef = React.useRef(null);
  
  return (
    <>
      <div className="full-screen-map" id="map" ref={mapRef} />
    </>
  );
}

export default FullScreenMap;
