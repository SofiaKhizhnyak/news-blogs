import React from "react";
import { SpinnerDotted } from "spinners-react";

//sizes: 30 - 90
//thickness: 20-180

function Spinner({ size, thickness = 100, color = "#8cbde2" }) {
  return (
    <div>
      <SpinnerDotted
        size={size}
        thickness={thickness}
        speed={100}
        color={color}
      />
    </div>
  );
}

export default Spinner;
