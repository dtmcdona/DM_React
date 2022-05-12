import React from "react";
import "./App.css";
import Canvas from "./Canvas";
import Menu from "./Menu";
import myData from "./data.json";
import settings from "./Settings";
import Components from "./components.js";

var image_data = myData;

var action_list = [];

function Action(id, name, code) {
  var dict = {};
  dict["id"] = id;
  dict["name"] = name;
  dict["code"] = code;
  dict["component"] = "action";
  return dict;
}

const execute_action = (id) => {
  var url = "http://127.0.0.1:8002/execute-action/" + id;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);

  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (settings.logging) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    }
  };

  xhr.send();
};

const send_mouse_click = (x, y) => {
  var url = "http://127.0.0.1:8002/mouse-click/" + x + "/" + y;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);

  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (settings.logging) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    }
  };

  xhr.send();
};

const send_keypress = (key) => {
  var url = "http://127.0.0.1:8002/keypress/" + key;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);

  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (settings.logging) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    }
  };

  xhr.send();
};

const draw = (context) => {
  var img = new Image();
  if (settings.streaming && settings.screen_timer > 0) {
    settings.screen_timer--;
    img.onload = function () {
      context.drawImage(
        img,
        0,
        0,
        img.width * settings.screen_x_scale,
        img.height * settings.screen_y_scale
      );
    };
  } else if (settings.streaming) {
    let refresh_rate = settings.screen_timer_max / settings.screen_fps;
    var url = "http://127.0.0.1:8002/screenshot/";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let prefix = "data:image/png;base64,";
        let json_data = JSON.parse(xhr.responseText);
        image_data.data = prefix + json_data.data;
        if (settings.logging) {
          console.log(xhr.status);
          console.log(xhr.responseText);
          console.log(image_data.data);
        }
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
  } else {
    image_data.data =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAKnRFWHRDcmVhdGlvbiBUaW1lAFNhIDQgTWFpIDIwMDIgMjM6MjA6MzYgKzAxMDBC3wLLAAAAB3RJTUUH0gUEFRUrVURxbAAAAAlwSFlzAAAK8AAACvABQqw0mAAAAARnQU1BAACxjwv8YQUAAAAMSURBVHjaY+CQbQEAANoAqj1ML8MAAAAASUVORK5CYII=";
    img.onload = function () {
      context.drawImage(
        img,
        0,
        0,
        img.width * settings.screen_x_scale,
        img.height * settings.screen_y_scale
      );
      context.font = "40pt Sans";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.fillText(
        "Stream Paused",
        (settings.screen_x_scale * settings.screen_width) / 2,
        (settings.screen_x_scale * settings.screen_height) / 2
      );
    };
    img.src = image_data.data;
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRecord = this.handleRecord.bind(this);
    this.state = { x: 0, y: 0 };
    settings.streaming = false;
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
    if (settings.logging) {
      console.log("Mouse clicked (" + this.state.x + ", " + this.state.y + ")");
    }
    let new_action_id = 0;
    if (
      this.state.x >= 0 &&
      this.state.x <= settings.screen_width &&
      this.state.y >= 0 &&
      this.state.y <= settings.screen_height
    ) {
      if (settings.streaming && settings.recording) {
        if (settings.logging) {
          console.log("Mouse click sent to Fast API");
        }
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
        if (settings.logging) {
          console.log(input_code);
        }

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
            let json_data = JSON.parse(xhr.responseText);
            new_action_id = json_data.id;
            action_list.push(
              new Action(json_data.id, json_data.name, json_data.code)
            );
            if (settings.logging) {
              console.log(action_list);
              console.log(xhr.status);
              console.log(xhr.responseText);
            }
          }
        };

        xhr.send(data);
      }
      if (
        new_action_id !== 0 &&
        settings.streaming &&
        settings.remote_control
      ) {
        execute_action(new_action_id);
      } else if (
        new_action_id === 0 &&
        settings.streaming &&
        settings.remote_control
      ) {
        send_mouse_click(event.clientX, event.clientY);
      }
    }
  }

  handleKeyPress(event) {
    if (settings.logging) {
      console.log("Key pressed: " + event.key);
    }
    let new_action_id = 0;
    if (
      this.state.x >= 0 &&
      this.state.x <= settings.screen_width &&
      this.state.y >= 0 &&
      this.state.y <= settings.screen_height
    ) {
      if (settings.streaming && settings.recording) {
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
            let json_data = JSON.parse(xhr.responseText);
            action_list.push(
              new Action(json_data.id, json_data.name, json_data.code)
            );
            if (settings.logging) {
              console.log(xhr.status);
              console.log(xhr.responseText);
              console.log(action_list);
            }
          }
        };

        xhr.send(data);
      }
      if (
        new_action_id !== 0 &&
        settings.streaming &&
        settings.remote_control
      ) {
        execute_action(new_action_id);
      } else if (
        new_action_id === 0 &&
        settings.streaming &&
        settings.remote_control
      ) {
        send_keypress(event.key);
      }
    }
  }

  handleStream(event) {
    settings.streaming = !settings.streaming;
    if (settings.logging) {
      console.log("Streaming: " + settings.streaming);
    }
  }

  handleRecord(event) {
    settings.recording = !settings.recording;
    if (settings.logging) {
      console.log("Recording: " + settings.recording);
    }
  }

  handlePlayback(event) {
    let prev_recording = settings.recording;
    let prev_remote_control = settings.remote_control;
    settings.recording = false;
    settings.remote_control = false;
    settings.playback = true;
    for (let i = 0; i < action_list.length; i++) {
      execute_action(action_list[i].id);
    }
    settings.recording = prev_recording;
    settings.remote_control = prev_remote_control;
    settings.playback = false;
  }

  handleRemoteControl(event) {
    settings.remote_control = !settings.remote_control;
    if (settings.logging) {
      console.log("Remote Control: " + settings.remote_control);
    }
  }

  handleDeleteAction(event) {
    const id = parseInt(event.target.name, 10);
    if (settings.logging) {
      console.log("Delete action:" + id);
    }
    var temp_id = 0;
    let action_deleted = false;
    for (let i = 0; i < action_list.length; i++) {
      if (action_list[i]["id"] === id) {
        //console.log(action_list);
        action_list.splice(i, 1);
        //console.log("ID matched:" + id);
        if (action_list.length > 0 && action_list.length > i) {
          action_list[i]["id"] = id;
        }
        action_deleted = true;
        //console.log(action_list);
      } else if (action_deleted) {
        temp_id = action_list[i]["id"];
        action_list[i]["id"] = temp_id - 1;
        //console.log("After delete: " + action_list[i]["id"]);
      }
    }
    var url = "http://127.0.0.1:8002/delete-action/" + id;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (settings.logging) {
          console.log(xhr.status);
          console.log(xhr.responseText);
        }
      }
    };

    xhr.send();
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
            onClick={this.handleStream}
            className="nav--options"
          >
            Video Stream
          </button>
          <button
            type="button"
            onClick={this.handleRecord}
            className="nav--options"
          >
            Record Input
          </button>
          <button
            type="button"
            onClick={this.handleRemoteControl}
            className="nav--options"
          >
            Remote Control
          </button>
          <button
            type="button"
            onClick={this.handlePlayback}
            className="nav--options"
          >
            Play Action List
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
          <div className="actions--section">
            <h2>Action List</h2>
            <table>
              <tbody>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Delete</th>
                </tr>
                {action_list.map((block) => (
                  <Components
                    block={block}
                    delete_func={this.handleDeleteAction}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Menu />
        </div>
      </div>
    );
  }
}

export default App;
