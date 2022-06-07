import React from "react";

export default (props) => (
  <tr>
    <th>{props.block.time_delay}</th>
    <th>{props.block.function}</th>
    <th>{props.block.parameters}</th>
    <th>
      <button name={props.block.id} onClick={props.delete_func}>
        Delete
      </button>
    </th>
  </tr>
);
