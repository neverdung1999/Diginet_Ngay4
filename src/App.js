import React from "react";
import ListTable from "./components/listTable/ListTable";

function App(props) {
  return (
    <div style={{ position: 'absolute',   backgroundColor: "#F6F6F9", width: "100%", height: "100%", left: 0, right: 0   }}>
      <ListTable />;
    </div>
  );
}

export default App;
