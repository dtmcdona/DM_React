import React from "react";
import "./App.css";
import Canvas from "./Canvas";
import Menu from "./Menu";
import myData from "./data.json";
import settings from "./Settings";

var image_data = myData;

const draw = (context) => {
  if (settings.screen_timer > 0) {
    settings.screen_timer--;
    var img = new Image();
    img.onload = function () {
      context.drawImage(
        img,
        0,
        0,
        img.width * settings.screen_x_scale,
        img.height * settings.screen_y_scale
      );
    };
    img.src = image_data.data;
  } else {
    let refresh_rate = settings.screen_timer_max / settings.screen_fps;
    var url = "http://127.0.0.1:8002/screenshot/";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
        let prefix = "data:image/png;base64,";
        let raw_data = JSON.parse(xhr.responseText);
        image_data.data = prefix + raw_data.data;
        console.log(image_data.data);
        var img = new Image();
        img.onload = function () {
          context.drawImage(
            img,
            0,
            0,
            img.width * settings.screen_x_scale,
            img.height * settings.screen_y_scale
          );
        };
        img.src = image_data.data;
      }
    };
    xhr.send();
    settings.screen_timer = refresh_rate;
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRecord = this.handleRecord.bind(this);
    this.state = { x: 0, y: 0 };
    settings.recording = false;
  }

  handleMouseMove(event) {
    let x_offset = 10 * settings.screen_x_scale;
    let y_offset = 70 * settings.screen_y_scale;
    this.setState({
      x: event.clientX / settings.screen_x_scale - x_offset,
      y: event.clientY / settings.screen_y_scale - y_offset,
    });
  }

  handleClick(event) {
    this.setState({
      x: event.clientX / settings.screen_x_scale - 10 * settings.screen_x_scale,
      y: event.clientY / settings.screen_y_scale - 70 * settings.screen_y_scale,
    });
    console.log("Mouse clicked (" + this.state.x + ", " + this.state.y + ")");
    if (
      settings.recording &&
      this.state.x >= 0 &&
      this.state.x <= settings.screen_width &&
      this.state.y >= 0 &&
      this.state.y <= settings.screen_height
    ) {
      console.log("Mouse click sent to Fast API");
      const date = new Date();
      let timestamp = date.toISOString();
      let input_code = "click(x=" + this.state.x + ", y=" + this.state.y;
      if (settings.random_enabled) {
        if (settings.random_mouse_path) {
          let temp = input_code;
          input_code = temp + ", random_path=true";
        }
        if (settings.random_mouse_position) {
          let temp = input_code;
          input_code = temp + ", random_range=" + settings.random_mouse_range;
        }
        if (settings.random_mouse_delay) {
          let temp = input_code;
          input_code =
            temp + ", random_delay=" + settings.random_mouse_max_delay;
        }
      }
      let temp = input_code;
      input_code = temp + ")";
      console.log(input_code);

      let data =
        '{"name": "' + timestamp + '", "code": ["' + input_code + '"]}';

      var url = "http://127.0.0.1:8002/add-action/";

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log(xhr.status);
          console.log(xhr.responseText);
        }
      };

      xhr.send(data);
    }
  }

  handleKeyPress(event) {
    console.log("Key pressed: " + event.key);
    if (
      settings.recording &&
      this.state.x >= 0 &&
      this.state.x <= settings.screen_width &&
      this.state.y >= 0 &&
      this.state.y <= settings.screen_height
    ) {
      console.log("Keypress sent to Fast API");
      const date = new Date();
      let timestamp = date.toISOString();
      let input_code = "keypress(" + event.key + ")";

      let data =
        '{"name": "' + timestamp + '", "code": ["' + input_code + '"]}';

      var url = "http://127.0.0.1:8002/add-action/";

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log(xhr.status);
          console.log(xhr.responseText);
        }
      };

      xhr.send(data);
    }
  }

  handleRecord(event) {
    settings.recording = !settings.recording;
    console.log("Recording: " + settings.recording);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  render() {
    return (
      <div
        style={{
          height: "100vh",
        }}
        onMouseMove={this.handleMouseMove}
        onClick={this.handleClick}
      >
        <nav>
          <button
            type="button"
            onClick={this.handleRecord}
            className="nav--options"
          >
            Record
          </button>
          <button type="button" className="nav--options">
            Playback
          </button>
          <button type="button" className="nav--options">
            Save
          </button>
          <button type="button" className="nav--options">
            Load
          </button>
          <button type="button" className="nav--options">
            Add condition
          </button>
          <button type="button" className="nav--options">
            Export macro file
          </button>
        </nav>
        <div className="main--section">
          <Canvas
            draw={draw}
            width={settings.screen_width * settings.screen_x_scale}
            height={settings.screen_height * settings.screen_y_scale}
          />
          <Menu />
        </div>
      </div>
    );
  }
}

export default App;
