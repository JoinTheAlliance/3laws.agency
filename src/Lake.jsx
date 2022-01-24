import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Terminal from "terminal-in-react";
import { v4 as uuidv4 } from 'uuid';
let senderName = "Guest_" + uuidv4().substring(0, 8);

function App() {

  const [agentName, setAgentName] = useState("__morgan__");
  const terminalRef = useRef();

  const msgRef = useRef();

  useEffect(() => {
    document.getElementsByClassName("terminal-base")[0].firstChild.firstChild.style.overflow = "hidden"
  },[]);

  const handleCommand = (input, print) => {
    if (input[0].includes("/nick")) {
      terminalRef.current.
      senderName = input[1];
      print("SYSTEM" + "> " + "Set NICK to " + input[1])
      return;
    }
    // TODO: Handle sender
    const body = { sender: senderName, command: input.join(" ") };
    axios.post(`${process.env.VITE_SERVER_CONNECTION_URL}/execute`, body).then(res => {
      console.log("response is", res);
      console.log(agentName + "> " + res.data.result);
      print(agentName + "> " + res.data.result)
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        // backgroundColor: "#fff",
      }}
    >
      <Terminal
        ref={terminalRef}
        startState="maximised"
        color="orange"
        outputColor="orange"
        prompt="orange"
        hideTopBar={true}
        allowTabs={false}
        promptSymbol={senderName + ">"}
        backgroundColor="rgba(0,0,0,0)"
        barColor="black"
        style={{ margin: "auto", color: "orange", marginTop: 0, width: "100%", overflow: "hidden", height: "100%", fontWeight: "bold", fontSize: "1em", zIndex: "1000" }}
        commands={{
        }}
        description={{
        }}
        msg={
          msgRef
        }
        commandPassThrough={handleCommand}
      />
      <img src="./Lake.jpg" style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1000 }} />

    </div>
  );
}

export default App
