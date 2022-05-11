import React from "react";

export default (props) => (
  <tr>
    <th>{props.block.id}</th>
    <th>{props.block.name}</th>
    <th>{props.block.code}</th>
    <th>
      <button name={props.block.id} onClick={props.delete_func}>
        Delete
      </button>
    </th>
  </tr>
);
