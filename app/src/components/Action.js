import React from "react";

class Action extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.block.id,
      name: props.block.name,
      function: props.block.function,
      x1: props.block.x1,
      x2: null,
      y1: props.block.y1,
      y2: null,
      images: props.block.images,
      image_conditions: [],
      variables: [],
      variable_condition: [],
      created_at: "",
      time_delay: props.block.time_delay,
      key_pressed: null,
      true_case: "conditions_true",
      false_case: "conditions_false",
      error_case: "error",
      repeat: false,
      num_repeats: 0,
      random_path: false,
      random_range: 0,
      random_delay: 0.0,
    };
  }

  update_action = () => {
    let images = "";
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
      '", ' +
      '"repeat": ' +
      this.state.repeat +
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

    let url = "http://127.0.0.1:8002/update-action/" + this.state.id;

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

  render() {
    return (
      <tr>
        <th>{this.props.block.function}</th>
        <th>
          <form onSubmit={this.handleSubmit}>
            x1:
            <input
              type="text"
              size="10"
              value={this.state.x1}
              onChange={(event) => this.setState({ x1: event.target.value })}
            />
            <br />
            y1:
            <input
              type="text"
              size="10"
              value={this.state.y1}
              onChange={(event) => this.setState({ y1: event.target.value })}
            />
            <br />
            time_delay:
            <input
              type="text"
              size="10"
              value={this.state.time_delay}
              onChange={(event) =>
                this.setState({ time_delay: event.target.value })
              }
              required
            />
            <br />
            images:
            <input
              type="text"
              value={this.state.images}
              onChange={(event) =>
                this.setState({ images: event.target.value })
              }
            />
            <br />
            <button>Update</button>
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
