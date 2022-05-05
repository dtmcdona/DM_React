import React from "react";
import "./App.css";
import Canvas from "./Canvas";
import myData from "./data.json";
import settings from "./Settings";

var image_data = myData;

const draw = (context) => {
  if (settings.screenshare_timer > 0) {
    settings.screenshare_timer--;
    var img = new Image();
    img.onload = function () {
      context.drawImage(img, 0, 0, img.width / 2, img.height / 2);
    };
    img.src = image_data.data;
  } else {
    let refresh_rate = 10 / settings.screenshare_fps;
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
          context.drawImage(img, 0, 0, img.width / 2, img.height / 2);
        };
        img.src = image_data.data;
      }
    };
    xhr.send();
    settings.screenshare_timer = refresh_rate;
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
    this.setState({
      x: event.clientX * 2 - 20,
      y: event.clientY * 2 - 140,
    });
  }

  handleClick(event) {
    this.setState({
      x: event.clientX * 2 - 20,
      y: event.clientY * 2 - 140,
    });
    console.log("Mouse clicked (" + this.state.x + ", " + this.state.y + ")");
    if (
      settings.recording &&
      this.state.x >= 0 &&
      this.state.x <= 1920 &&
      this.state.y >= 0 &&
      this.state.y <= 1080
    ) {
      console.log("Keypress sent to Fast API");
      const date = new Date();
      let timestamp = date.toISOString();
      let input_code = "click(x=" + this.state.x + ", y=" + this.state.y + ")";

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
    if (settings.recording) {
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
          <Canvas draw={draw} width={960} height={540} />
          <p>
            Mouse position: ({this.state.x}, {this.state.y})
          </p>
        </div>
      </div>
    );
  }
}

export default App;
