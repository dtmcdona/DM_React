import React from "react";
import PropTypes from "prop-types";

const Canvas = ({ draw, width, height }) => {
  const canvas = React.useRef();
  React.useEffect(() => {
    const context = canvas.current.getContext("2d");
    draw(context);
  });
  return <canvas ref={canvas} width={width} height={height} />;
};
Canvas.propTypes = {
  draw: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};
export default Canvas;
