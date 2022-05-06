import React from "react";

export default function Navbar() {
  return (
    <nav>
      <button type="button" className="nav--options">
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
  );
}
export default function App() {
  return (
    <div className="App">
      <h1>Hello React Object Output</h1>
      {dueTimes.map(item => {
        return (
          <>
            <h4>Distance : {item.distance}</h4>
            <div>
              <h3>Start </h3>
              <p>Start Time: {item.start.time} </p>
              <p>Start address: {item.start.address} </p>
              <p>
                Start location: {item.start.location.lat} -{" "}
                {item.start.location.lng}{" "}
              </p>
            </div>
            <div>
              <h3>End </h3>
              <p>Start Time: {item.end.time} </p>
              <p>Start address: {item.end.address} </p>
              <p>
                Start location: {item.end.location.lat} -{" "}
                {item.end.location.lng}{" "}
              </p>
            </div>
            <div>
              <h3>steps </h3>
              <div>
                {item.steps.map((step, i) => {
                  return (
                    <div key={i}>
                      <p>Step mode: {step.mode}</p>
                      <p>Step Distance: {step.distance}</p>
                      <p>Step duration: {step.duration}</p>
                      {step.transit && (
                        <div>
                          <h5 style={{ background: "red", color: "white" }}>Transit</h5>
                          <p style={{ background: "yellow", color: "black" }}>Route: {step.transit?.route}</p>
                          <p style={{ background: "yellow", color: "black" }}>Type: {step.transit?.type}</p>
                          <p style={{ background: "yellow", color: "black" }}>headsign: {step.transit?.headsign}</p>
                          <p style={{ background: "yellow", color: "black" }}>dep.name: {step.transit?.dep.name}</p>
                          <p style={{ background: "yellow", color: "black" }}>dep.time: {step.transit?.dep.time}</p>
                          <p style={{ background: "yellow", color: "black" }}>arr.name: {step.transit?.arr.name}</p>
                          <p style={{ background: "yellow", color: "black" }}>arr.time: {step.transit?.arr.time}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}