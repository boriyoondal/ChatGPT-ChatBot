import React from "react";

function App() {
  return (
    <div className="flex">
      <section className="flex flex-col">
        <p className="text-3xl text-blue-500">abc</p>
        <div className="flex flex-col">
          <input className="border border-solid" type="text" />
          <input className="border border-solid" type="password" />
        </div>
        <button className="">btn</button>
      </section>
    </div>
  );
}

export default App;
