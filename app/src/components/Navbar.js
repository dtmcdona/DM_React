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
