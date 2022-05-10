import React from "react";

export default (props) => (
  <tr>
    <th>{props.block.id}</th>
    <th>{props.block.name}</th>
    <th>{props.block.code}</th>
  </tr>
);
