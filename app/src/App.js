import React from "react";
import "./App.css";
import Canvas from "./Canvas";
import Menu from "./Menu";
import myData from "./data.json";
import settings from "./Settings";
import canvas_data from "./Canvas_Data";
import Components from "./components.js";

var image_data = myData;

var task_id = 0;

var action_list = [];

var new_action_id = 0;

var snip_list = [];

var prompt = "";

var block_click = true;

var timestamp = Date.now();

// eslint-disable-next-line
const sleep = (seconds) => {
  let ms = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

async function execute_task() {
  let url = "http://127.0.0.1:8002/execute-task/" + task_id;
  let prev_recording = settings.recording;
  let prev_remote_control = settings.remote_control;
  settings.recording = false;
  settings.remote_control = false;
  settings.playback = true;
  try {
    const res = await fetch(url);
    console.log(res);
  } catch (err) {
    console.log(err);
  } finally {
    settings.recording = prev_recording;
    settings.remote_control = prev_remote_control;
    settings.playback = false;
  }
}

function Action(id, name, func, x1, y1, key_pressed, images, time_delay) {
  var dict = {};
  dict["id"] = id;
  dict["name"] = name;
  dict["function"] = func;
  dict["x1"] = x1;
  dict["y1"] = y1;
  dict["key_pressed"] = key_pressed;
  dict["images"] = images;
  dict["time_delay"] = time_delay;
  dict["component"] = "action";
  return dict;
}

const get_request_api = (url) => {
  let xhr = new XMLHttpRequest();
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

const reset_canvas_data = (index) => {
  canvas_data.snip_x1 = 0;
  canvas_data.snip_x2 = 0;
  canvas_data.snip_y1 = 0;
  canvas_data.snip_y2 = 0;
  canvas_data.snip_image = false;
  canvas_data.snip_prompt_index = index;
  prompt = canvas_data.snip_prompt[canvas_data.snip_prompt_index];
  console.log(prompt);
};

const execute_action = (id) => {
  let url = "http://127.0.0.1:8002/execute-action/" + id;

  let xhr = new XMLHttpRequest();
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
  let url = "http://127.0.0.1:8002/mouse-click/" + x + "/" + y;

  get_request_api(url);
};

const send_keypress = (key) => {
  let url = "http://127.0.0.1:8002/keypress/" + key;

  get_request_api(url);
};

const draw = (context) => {
  var img = new Image();
  if (canvas_data.snip_prompt_index > 0) {
    context.clearRect(
      0,
      0,
      canvas_data.screen_x_scale * canvas_data.screen_width,
      32
    );
    if (canvas_data.snip_x1 !== 0 && canvas_data.snip_y1 !== 0) {
      context.clearRect(
        0,
        0,
        canvas_data.screen_x_scale * canvas_data.screen_width,
        canvas_data.screen_y_scale * canvas_data.snip_y1
      );
      context.clearRect(
        0,
        0,
        canvas_data.screen_x_scale * canvas_data.snip_x1,
        canvas_data.screen_y_scale * canvas_data.screen_height
      );
    }
    if (canvas_data.snip_x2 !== 0 && canvas_data.snip_y2 !== 0) {
      context.clearRect(
        0,
        canvas_data.screen_y_scale * canvas_data.snip_y2,
        canvas_data.screen_x_scale * canvas_data.screen_width,
        canvas_data.screen_y_scale * canvas_data.screen_height
      );
      context.clearRect(
        canvas_data.screen_x_scale * canvas_data.snip_x2,
        0,
        canvas_data.screen_x_scale * canvas_data.screen_width,
        canvas_data.screen_y_scale * canvas_data.screen_height
      );
    }
    context.drawImage(
      img,
      0,
      0,
      img.width * canvas_data.screen_x_scale,
      img.height * canvas_data.screen_y_scale
    );
    img.src = canvas_data.snip_frame;
    context.font = "20pt Sans";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(
      prompt,
      (canvas_data.screen_x_scale * canvas_data.screen_width) / 2,
      24
    );
  } else if (settings.streaming && canvas_data.screen_timer > 0) {
    img.onload = function () {
      context.drawImage(
        img,
        0,
        0,
        img.width * canvas_data.screen_x_scale,
        img.height * canvas_data.screen_y_scale
      );
    };
    if (canvas_data.snip_prompt_index === 0) canvas_data.screen_timer--;
  } else if (settings.streaming) {
    let refresh_rate = canvas_data.screen_timer_max / canvas_data.screen_fps;
    let url = "http://127.0.0.1:8002/screenshot/";

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let json_data = JSON.parse(xhr.responseText);
        image_data.data = json_data.data;
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
            img.width * canvas_data.screen_x_scale,
            img.height * canvas_data.screen_y_scale
          );
        };
        let prefix = "data:image/png;base64,";
        img.src = prefix + image_data.data;
      }
    };
    xhr.send();
    canvas_data.screen_timer = refresh_rate;
  } else {
    image_data.data =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAKnRFWHRDcmVhdGlvbiBUaW1lAFNhIDQgTWFpIDIwMDIgMjM6MjA6MzYgKzAxMDBC3wLLAAAAB3RJTUUH0gUEFRUrVURxbAAAAAlwSFlzAAAK8AAACvABQqw0mAAAAARnQU1BAACxjwv8YQUAAAAMSURBVHjaY+CQbQEAANoAqj1ML8MAAAAASUVORK5CYII=";
    img.onload = function () {
      context.drawImage(
        img,
        0,
        0,
        img.width * canvas_data.screen_x_scale,
        img.height * canvas_data.screen_y_scale
      );
      context.font = "40pt Sans";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.fillText(
        "Stream Paused",
        (canvas_data.screen_x_scale * canvas_data.screen_width) / 2,
        (canvas_data.screen_x_scale * canvas_data.screen_height) / 2
      );
    };
    let prefix = "data:image/png;base64,";
    img.src = prefix + image_data.data;
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRecord = this.handleRecord.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = { x: 0, y: 0 };
    settings.streaming = false;
    settings.recording = false;
  }

  getTimeDelta() {
    let now = Date.now();
    let time_delta = (now - timestamp) / 1000;
    timestamp = now;
    canvas_data.time_delta = time_delta;
  }

  create_action = (action_type) => {
    this.getTimeDelta();
    const date = new Date();
    let timestamp = date.toISOString();
    let function_params = "";
    if (action_type === "click") {
      let temp = function_params;
      function_params =
        temp + ', "x1": ' + canvas_data.x + ', "y1": ' + canvas_data.y;
    } else if (
      action_type === "click_image" ||
      action_type === "move_to_image"
    ) {
      let temp = function_params;
      function_params =
        temp + ', "images": ["' + snip_list[snip_list.length - 1] + '", ""]';
    } else if (action_type === "key_pressed") {
      let temp = function_params;
      function_params =
        temp + ', "key_pressed": "' + canvas_data.key_pressed + '"';
    }
    if (settings.random_enabled) {
      if (settings.random_mouse_path) {
        let temp = function_params;
        function_params = temp + ', "random_path": true';
      }
      if (settings.random_mouse_position) {
        let temp = function_params;
        function_params =
          temp + ', "random_range": ' + settings.random_mouse_range;
      }
      if (settings.random_mouse_delay) {
        let temp = function_params;
        function_params =
          temp + ', "random_delay": ' + settings.random_mouse_max_delay;
      }
    }

    let data =
      '{"name": "' +
      timestamp +
      '", "function": "' +
      action_type +
      '"' +
      function_params +
      ', "time_delay": ' +
      canvas_data.time_delta +
      "}";
    if (settings.logging) {
      console.log(data);
    }

    let url = "http://127.0.0.1:8002/add-action/";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let json_data = JSON.parse(xhr.responseText);
        new_action_id = json_data.id;
        action_list.push(
          new Action(
            json_data.id,
            json_data.name,
            json_data.function,
            json_data.x1,
            json_data.y1,
            json_data.key_pressed,
            json_data.images,
            json_data.time_delay
          )
        );
        if (settings.logging) {
          console.log(action_list);
          console.log(xhr.status);
          console.log(xhr.responseText);
        }
      }
    };

    xhr.send(data);
  };

  handleMouseMove(event) {
    let x_offset = 10 / canvas_data.screen_x_scale;
    let y_offset = 70 / canvas_data.screen_y_scale;
    this.setState({
      x: event.clientX / canvas_data.screen_x_scale - x_offset,
      y: event.clientY / canvas_data.screen_y_scale - y_offset,
    });
    canvas_data.x = event.clientX / canvas_data.screen_x_scale - x_offset;
    canvas_data.y = event.clientY / canvas_data.screen_y_scale - y_offset;
  }

  handleSaveTask(event) {
    let url = "http://127.0.0.1:8002/add-task";
    let action_id_list = [];

    for (let i = 0; i < action_list.length; i++) {
      console.log(action_list[i].id);
      action_id_list.push(action_list[i].id);
    }

    let data =
      '{"name": "' +
      settings.task_name +
      '", "action_id_list": [' +
      action_id_list +
      "]}";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (settings.logging) {
          let json_data = JSON.parse(xhr.responseText);
          task_id = json_data.id;
        }
      }
    };

    xhr.send(data);
  }

  handleTaskName(event) {
    settings.task_name = event.target.value;
  }

  handleClick(event) {
    let x_offset = 10 / canvas_data.screen_x_scale;
    let y_offset = 70 / canvas_data.screen_y_scale;
    this.setState({
      x: event.clientX / canvas_data.screen_x_scale - x_offset,
      y: event.clientY / canvas_data.screen_y_scale - y_offset,
    });
    if (settings.logging) {
      console.log(
        "Mouse clicked (" + canvas_data.x + ", " + canvas_data.y + ")"
      );
    }
    if (block_click) {
      block_click = false;
    } else if (
      canvas_data.x >= 0 &&
      canvas_data.x <= canvas_data.screen_width &&
      canvas_data.y >= 0 &&
      canvas_data.y <= canvas_data.screen_height
    ) {
      if (canvas_data.snip_image) {
        if (canvas_data.snip_x1 === 0) {
          canvas_data.snip_x1 = canvas_data.x;
          canvas_data.snip_prompt_index = 2;
          prompt = canvas_data.snip_prompt[canvas_data.snip_prompt_index];
          image_data.data = canvas_data.snip_frame;
          console.log(prompt);
          if (settings.logging) {
            console.log("Captured x1");
          }
        } else if (canvas_data.snip_x2 === 0) {
          canvas_data.snip_x2 = canvas_data.x;
          canvas_data.snip_prompt_index = 3;
          prompt = canvas_data.snip_prompt[canvas_data.snip_prompt_index];
          image_data.data = canvas_data.snip_frame;
          console.log(prompt);
          if (settings.logging) {
            console.log("Captured x2");
          }
        }
        if (canvas_data.snip_y1 === 0) {
          canvas_data.snip_y1 = canvas_data.y;
          canvas_data.snip_prompt_index = 2;
          if (settings.logging) {
            console.log("Captured y1");
          }
        } else if (canvas_data.snip_y2 === 0) {
          canvas_data.snip_y2 = canvas_data.y;
          canvas_data.snip_prompt_index = 3;
          if (settings.logging) {
            console.log("Captured y2");
          }
        }
      } else if (settings.streaming && settings.recording) {
        this.create_action("click");
        if (settings.logging) {
          console.log("Mouse click sent to Fast API");
        }
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
        send_mouse_click(canvas_data.x, canvas_data.y);
      }
    }
  }

  handleKeyPress(event) {
    if (settings.logging) {
      console.log("Key pressed: " + event.key);
    }
    if (canvas_data.snip_prompt_index === 3) {
      if (event.key === "1") {
        canvas_data.snip_prompt_index = 4;
        prompt = canvas_data.snip_prompt[canvas_data.snip_prompt_index];
        image_data.data = canvas_data.snip_frame;
      }
      if (event.key === "1" || event.key === "2") {
        //Save image and push file name to snip_list
        if (
          canvas_data.snip_x1 !== 0 &&
          canvas_data.snip_x2 !== 0 &&
          canvas_data.snip_y1 !== 0 &&
          canvas_data.snip_y2 !== 0
        ) {
          let data = '{"base64str": "' + canvas_data.snip_frame + '"}';
          console.log(data);
          let url =
            "http://127.0.0.1:8002/screen-snip/" +
            canvas_data.snip_x1 +
            "/" +
            canvas_data.snip_y1 +
            "/" +
            canvas_data.snip_x2 +
            "/" +
            canvas_data.snip_y2 +
            "/";

          let xhr = new XMLHttpRequest();
          xhr.open("POST", url);

          xhr.setRequestHeader("Accept", "application/json");
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              let json_data = JSON.parse(xhr.responseText);
              let new_snip_file_name = json_data.id + ".png";
              snip_list.push(new_snip_file_name);
              if (settings.logging) {
                console.log(action_list);
                console.log(xhr.status);
                console.log(xhr.responseText);
              }
            }
          };

          xhr.send(data);
          if (event.key === "2") {
            reset_canvas_data(0);
          }
        } else if (settings.logging) {
          console.log("Error with snip image prompt");
        }
      } else if (event.key === "3") {
        //Restart
        reset_canvas_data(0);
      }
    } else if (canvas_data.snip_prompt_index === 4) {
      if (event.key === "1") {
        //Create click_image action
        this.create_action("click_image");
        //Clear data
        reset_canvas_data(0);
      } else if (event.key === "2") {
        //Create move_to_image action
        this.create_action("move_to_image");
        //Clear data
        reset_canvas_data(0);
      }
    } else if (
      canvas_data.x >= 0 &&
      canvas_data.x <= canvas_data.screen_width &&
      canvas_data.y >= 0 &&
      canvas_data.y <= canvas_data.screen_height
    ) {
      if (settings.streaming && settings.recording) {
        console.log("Keypress sent to Fast API");
        canvas_data.key_pressed = String(event.key);
        this.create_action("key_pressed");
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
    if (settings.streaming) {
      this.getTimeDelta();
    }
    if (settings.logging) {
      console.log("Streaming: " + settings.streaming);
    }
  }

  handleRecord(event) {
    settings.recording = !settings.recording;
    if (settings.recording) {
      this.getTimeDelta();
      block_click = true;
    }
    if (settings.logging) {
      console.log("Recording: " + settings.recording);
    }
  }

  handlePlayback(event) {
    execute_task();
  }

  handleRemoteControl(event) {
    settings.remote_control = !settings.remote_control;
    if (settings.logging) {
      console.log("Remote Control: " + settings.remote_control);
    }
  }

  handleSnipImage(event) {
    if (!canvas_data.snip_image) {
      reset_canvas_data(1);
      canvas_data.snip_frame = image_data.data;
    } else {
      canvas_data.snip_prompt_index = 0;
      prompt = canvas_data.snip_prompt[canvas_data.snip_prompt_index];
      console.log(prompt);
    }
    canvas_data.snip_image = !canvas_data.snip_image;
    if (settings.logging) {
      console.log("Snip Image: " + canvas_data.snip_image);
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
    let url = "http://127.0.0.1:8002/delete-action/" + id;

    get_request_api(url);
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
            {settings.streaming ? "Stop Stream" : "Start Stream"}
          </button>
          <button
            type="button"
            onClick={this.handleRecord}
            className="nav--options"
          >
            {settings.recording ? "Stop Recording" : "Start Recording"}
          </button>
          <button
            type="button"
            onClick={this.handleRemoteControl}
            className="nav--options"
          >
            {settings.remote_control
              ? "Remote Control On"
              : "Remote Control Off"}
          </button>
          <button
            type="button"
            onClick={this.handlePlayback}
            className="nav--options"
          >
            {settings.playback ? "Task playing" : "Start Task"}
          </button>
          <button
            type="button"
            onClick={this.handleSnipImage}
            className="nav--options"
          >
            Snip image
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
            width={canvas_data.screen_width * canvas_data.screen_x_scale}
            height={canvas_data.screen_height * canvas_data.screen_y_scale}
          />
          <div className="actions--section">
            <h2>Task</h2>
            <input
              onChange={this.handleTaskName}
              placeholder="Enter task name"
            />
            <button onClick={this.handleSaveTask}>Save</button>
            <h3>Task actions</h3>
            <table>
              <tbody>
                <tr>
                  <th>Function</th>
                  <th>Parameters</th>
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
