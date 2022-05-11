import React from "react";
import Action from "./components/Action";

const Components = {
  action: Action,
};

const Component = ({ block, delete_func }) => {
  if (typeof Components[block.component] !== "undefined") {
    return React.createElement(Components[block.component], {
      key: block.id,
      block: block,
      delete_func: delete_func,
    });
  }
  return React.createElement(
    () => <div>The component {block.component} has not been created yet.</div>,
    { key: block.id }
  );
};
export default Component;
