const action_data = {
  action_functions: [
    {
      label: "Click mouse left here",
      value: "click",
    },
    {
      label: "Click on image",
      value: "click_image",
    },
    {
      label: "Move mouse to",
      value: "move_to",
    },
    {
      label: "Move mouse to image",
      value: "move_to_image",
    },
    {
      label: "Keyboard button pressed",
      value: "key_pressed",
    },
    {
      label: "Capture text or image",
      value: "capture_screen_data",
    },
  ],
  conditionals: [
    {
      label: "None",
      value: "none",
    },
    {
      label: "Text equals",
      value: "equals",
    },
    {
      label: "Text greater than",
      value: "greater_than",
    },
    {
      label: "Text less than",
      value: "less_than",
    },
    {
      label: "If text exists",
      value: "if",
    },
    {
      label: "If text does not exist",
      value: "if_not",
    },
    {
      label: "If image present",
      value: "if_image_present",
    },
  ],
  result_functions: [
    {
      label: "None",
      value: "none",
    },
    {
      label: "Process action",
      value: "execute_action",
    },
    {
      label: "Skip this action",
      value: "skip_action",
    },
    {
      label: "Set action name",
      value: "set_action_name",
    },
    {
      label: "Skip to action named:",
      value: "skip_to_name",
    },
    {
      label: "Wait for _ seconds",
      value: "sleep",
    },
    {
      label: "Wait _ seconds then repeat",
      value: "sleep_and_repeat",
    },
    {
      label: "Set variable to:",
      value: "set_variable",
    },
    {
      label: "Add _ to variable:",
      value: "increment_variable",
    },
    {
      label: "Subtract _ to variable:",
      value: "decrement_variable",
    },
    {
      label: "Switch to task:",
      value: "switch_task",
    },
    {
      label: "Exit task",
      value: "end_task",
    },
    {
      label: "Create task process",
      value: "spawn_process",
    },
    {
      label: "Repeats:",
      value: "repeat",
    },
  ],
  click_types: [
    {
      label: "at point",
      value: "point",
    },
    {
      label: "within region",
      value: "region",
    },
  ],
};
export default action_data;
