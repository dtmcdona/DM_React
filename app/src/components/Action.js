import React from "react";
import action_data from "./Action_Data";

class Action extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeFunction = this.handleChangeFunction.bind(this);
    this.handleChangeCondition = this.handleChangeCondition.bind(this);
    this.handleChangeConditionTrue = this.handleChangeConditionTrue.bind(this);
    this.handleChangeConditionFalse =
      this.handleChangeConditionFalse.bind(this);
    this.handleChangeClickType = this.handleChangeClickType.bind(this);
    this.state = {
      id: props.block.id,
      name: props.block.name,
      function: props.block.function,
      x1: props.block.x1,
      x2: props.block.x2,
      y1: props.block.y1,
      y2: props.block.y2,
      images: props.block.images,
      image_conditions: props.block.image_conditions,
      variables: props.block.variables,
      variable_condition: props.block.variable_condition,
      comparison_value: props.block.comparison_value,
      created_at: "",
      time_delay: props.block.time_delay,
      sleep_duration: props.block.sleep_duration,
      key_pressed: props.block.key_pressed,
      true_case: props.block.true_case,
      false_case: props.block.false_case,
      error_case: props.block.error_case,
      num_repeats: props.block.num_repeats,
      random_path: props.block.random_path,
      random_range: props.block.random_range,
      random_delay: props.block.random_delay,
      condition: "none",
      click_type: "point",
    };
  }

  update_action = () => {
    const base_url = "http://127.0.0.1:8003/";
    let images = "";
    if (this.state.function !== "capture_screen_data") {
      this.setState({ image_conditions: "" });
      this.setState({ variable_condition: "" });
      this.setState({ comparison_value: null });
    } else if (
      this.state.function === "capture_screen_data" ||
      this.state.function === "click_image"
    ) {
      if (this.state.condition === "if_image_present") {
        this.setState = { image_conditions: "if_image_present" };
        this.setState = { variable_condition: "" };
      } else if (this.state.condition !== "none") {
        this.setState = { image_conditions: "" };
        this.setState = { variable_condition: this.state.condition };
      }
    }
    if (String(this.state.images).length > 0)
      images = '"' + String(this.state.images).replace(",", '", "') + '"';
    let data =
      '{"id": ' +
      this.state.id +
      ", " +
      '"name": "' +
      this.state.name +
      '", ' +
      '"function": "' +
      this.state.function +
      '", ' +
      '"x1": ' +
      this.state.x1 +
      ", " +
      '"x2": ' +
      this.state.x2 +
      ", " +
      '"y1": ' +
      this.state.y1 +
      ", " +
      '"y2": ' +
      this.state.y2 +
      ", " +
      '"images": [' +
      images +
      "], " +
      '"image_conditions": [' +
      this.state.image_conditions +
      "], " +
      '"variables": [' +
      this.state.variables +
      "], " +
      '"variable_condition": [' +
      this.state.variable_condition +
      "], " +
      '"time_delay": ' +
      this.state.time_delay +
      ", " +
      '"sleep_duration": ' +
      this.state.sleep_duration +
      ", " +
      '"key_pressed": "' +
      this.state.key_pressed +
      '", ' +
      '"true_case": "' +
      this.state.true_case +
      '", ' +
      '"false_case": "' +
      this.state.false_case +
      '", ' +
      '"error_case": "' +
      this.state.error_case +
      ", " +
      '"num_repeats": ' +
      this.state.num_repeats +
      ", " +
      '"random_path": ' +
      this.state.random_path +
      ", " +
      '"random_range": ' +
      this.state.random_range +
      ", " +
      '"random_delay": ' +
      this.state.random_delay +
      "}";
    console.log(data);

    let url = base_url + "update-action/" + this.state.id;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.onreadystatechange = function () {
      console.log(xhr.status);
      console.log(xhr.responseText);
    };

    xhr.send(data);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.update_action();
  };

  handleChangeFunction(e) {
    this.setState({ function: e.target.value });
  }

  handleChangeCondition(e) {
    this.setState({ condition: e.target.value });
  }

  handleChangeConditionTrue(e) {
    this.setState({ true_case: e.target.value });
  }

  handleChangeConditionFalse(e) {
    this.setState({ false_case: e.target.value });
  }

  handleChangeClickType(e) {
    this.setState({ click_type: e.target.value });
  }

  render() {
    return (
      <tr>
        <th>
          <form onSubmit={this.handleSubmit}>
            {this.state.function === "capture_screen_data" && (
              <td>
                Condition:
                <div className="select-container">
                  <select
                    value={this.state.condition}
                    onChange={this.handleChangeCondition}
                  >
                    {action_data.conditionals.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                Comparison value:
                <div className="select-container">
                  <input
                    type="text"
                    size="10"
                    value={this.state.comparison_value}
                    onChange={(event) =>
                      this.setState({
                        comparison_value: event.target.value.split(","),
                      })
                    }
                  />
                </div>
                Condition is true:
                <div className="select-container">
                  <select
                    value={this.state.true_case}
                    onChange={this.handleChangeConditionTrue}
                  >
                    {action_data.result_functions.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                Condition is false:
                <div className="select-container">
                  <select
                    value={this.state.false_case}
                    onChange={this.handleChangeConditionFalse}
                  >
                    {action_data.result_functions.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                {(this.state.false_case === "sleep" ||
                  this.state.false_case === "sleep_and_repeat" ||
                  this.state.true_case === "sleep" ||
                  this.state.true_case === "sleep_and_repeat") && (
                  <div className="input-container">
                    Wait duration:
                    <input
                      type="text"
                      size="10"
                      value={this.state.sleep_duration}
                      onChange={(event) =>
                        this.setState({ sleep_duration: event.target.value })
                      }
                      required
                    />
                  </div>
                )}
              </td>
            )}
            <td>
              Action function:
              <div className="select-container">
                <select
                  value={this.state.function}
                  onChange={this.handleChangeFunction}
                >
                  {action_data.action_functions.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              {this.state.function === "key_pressed" && (
                <div className="input-container">
                  Keyboard
                  <input
                    type="text"
                    size="10"
                    value={this.state.key_pressed}
                    onChange={(event) =>
                      this.setState({ key_pressed: event.target.value })
                    }
                  />
                </div>
              )}
              {this.state.function !== "key_pressed" && (
                <div className="select-container">
                  <select
                    value={this.state.click_type}
                    onChange={this.handleChangeClickType}
                  >
                    {action_data.click_types.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
              {this.state.function !== "key_pressed" &&
                this.state.click_type === "point" &&
                "(x,y):"}
              {this.state.function !== "key_pressed" &&
                this.state.click_type === "region" &&
                "Top left (x,y):"}
              {this.state.function !== "key_pressed" && (
                <div className="input-container">
                  (
                  <input
                    type="text"
                    size="10"
                    value={this.state.x1}
                    onChange={(event) =>
                      this.setState({ x1: event.target.value })
                    }
                  />
                  ,
                  <input
                    type="text"
                    size="10"
                    value={this.state.y1}
                    onChange={(event) =>
                      this.setState({ y1: event.target.value })
                    }
                  />
                  )
                </div>
              )}
              {this.state.function !== "key_pressed" &&
                this.state.click_type === "region" &&
                "Bottom right (x,y):"}
              {this.state.function !== "key_pressed" &&
                this.state.click_type === "region" && (
                  <div className="input-container">
                    (
                    <input
                      type="text"
                      size="10"
                      value={this.state.x2}
                      onChange={(event) =>
                        this.setState({ x2: event.target.value })
                      }
                    />
                    ,
                    <input
                      type="text"
                      size="10"
                      value={this.state.y2}
                      onChange={(event) =>
                        this.setState({ y2: event.target.value })
                      }
                    />
                    )
                  </div>
                )}
              Time delay:
              <div className="input-container">
                <input
                  type="text"
                  size="10"
                  value={this.state.time_delay}
                  onChange={(event) =>
                    this.setState({ time_delay: event.target.value })
                  }
                  required
                />
              </div>
              {this.state.function === "click_image" &&
                "Images:"}
              {this.state.function === "click_image" && (
                <div className="input-container">
                  <input
                    type="text"
                    value={this.state.images}
                    onChange={(event) =>
                      this.setState({ images: event.target.value })
                    }
                  />
                </div>
              )}
            </td>
            <td align="right">
              <button>Update</button>
            </td>
          </form>
        </th>
        <th>
          <button name={this.props.block.id} onClick={this.props.delete_func}>
            Delete
          </button>
        </th>
      </tr>
    );
  }
}
export default Action;
