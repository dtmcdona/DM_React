import React from "react";
import "./App.css";
import Canvas from "./Canvas";

const draw = (context) => {
  var img = new Image();
  img.onload = function () {
    context.drawImage(img, 0, 0, img.width / 2, img.height / 2);
  };
  img.src = "screenshot.jpg";
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRecord = this.handleRecord.bind(this);
    this.state = { x: 0, y: 0, recording: false };
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
      self.state.recording &&
      this.state.x >= 0 &&
      this.state.x <= 1920 &&
      this.state.y >= 0 &&
      this.state.y <= 1080
    ) {
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
    if (
      self.state.recording &&
      this.state.x >= 0 &&
      this.state.x <= 1920 &&
      this.state.y >= 0 &&
      this.state.y <= 1080
    ) {
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
    this.setState({
      recording: !this.state.recording,
    });
    console.log("Recording: " + this.state.recording);
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