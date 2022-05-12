import React from "react";
import settings from "./Settings";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.data = [];
    this.state = settings;
    this.handleInputChange = this.handleInputChange.bind(this);

    for (var key in settings) {
      let value = settings[key];
      let temp = key.replaceAll("_", " ");
      let captialized_key = temp.charAt(0).toUpperCase() + temp.slice(1);
      let input_type = "text";
      if (typeof value === "number") {
        input_type = "number";
      } else if (typeof value === "boolean") {
        input_type = "checkbox";
      }
      this.data.push(
        <tr>
          <th>
            <label>{captialized_key}</label>
          </th>
          <th>
            <input
              name={key}
              type={input_type}
              defaultValue={this.state[key]}
              size="12"
              onChange={this.handleInputChange}
            />
          </th>
        </tr>
      );
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const type = target.type;
    const value = target.value;
    console.log(name);
    console.log(value);
    console.log(typeof value);
    console.log(type);
    if (type === "number") {
      this.setState({
        [name]: parseFloat(value),
      });
    } else if (type === "checkbox") {
      this.setState({
        [name]: JSON.parse(value.toLowerCase()),
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
    for (var key in this.settings) {
      let value = this.settings[key];
      if (typeof value === "object") {
        for (var nested_key in value) {
          this.settings[key][nested_key] = this.state[nested_key];
        }
      } else {
        this.settings[key] = this.state[key];
      }
    }
    console.log(this.state);
  }

  render() {
    return (
      <div className="menu--section">
        <form>
          <h2>Menu</h2>
          <table>
            <tbody>{this.data}</tbody>
          </table>
        </form>
      </div>
    );
  }
}
export default Menu;
