import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Terminal from "terminal-in-react";
import React from "react";
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import glitch from "glitch-canvas";
let senderHasResponded = false;

function App() {
  const defaultName = "Guest_" + uuidv4();
  const [senderName, setSenderName] = useState(defaultName);
  const [agentName, setAgentName] = useState("th3_w4nd3r3r");
  const terminalTextRef = useRef("Connecting...");
  // const [senderHasResponded, setSenderHasResponded] = useState(false);
  const terminalRef = useRef();
  const [showTerminal, setShowTerminal] = useState("none")
  
  const imageRef = useRef();
  const [showImage, setShowImage] = useState("block");

  const [showWarning, setShowWarning] = useState("none");
  const [showMask, setShowMask] = useState("none");

  const image = new Image();

  const setSenderHasResponded = (bool) => senderHasResponded = bool;

  const captureCanvas = () => {
    html2canvas(document.body).then(async function (canvas) {
      const dataUrl = canvas.toDataURL();
      setShowWarning("none");
      setShowMask("none");

      function doThing() {
        image.src = dataUrl;
        image.onload = (() => {
          glitch({ seed: Math.floor(99 * Math.random()), quality: 30, iterations: Math.floor(10 * Math.random()) })
            .fromImage(image)
            .toDataURL()
            .then(function (dataURL) {
              imageRef.current.src = dataURL;
            });
        })
      }

      doThing();
      setInterval(async () => {

        doThing();
        if (Math.floor(Math.random() * 100) > 30) {

          setTimeout(async () => {

            doThing();

            if (Math.floor(Math.random() * 100) > 50) {
              setTimeout(async () => {
                doThing();
                console.log("Almost")

                if (Math.floor(Math.random() * 100) > 50) {
                  setTimeout(async () => {
                    doThing();
                    console.log("Deep")
                  }, 50 + 10 * Math.random())
                }
              }, 100 + 100 * Math.random())
            }
          }, 100 + 1000 * Math.random())
        }
      }, 100 + 5000 * Math.random())
      //         // setInterval(async () => {
      //           const data = canvas.getContext("2d").getImageData(0, 0, 100, 100);
      //     glitch( { seed: 25, quality: 99, amount: 99, iterations: 10 } )
      // 		.fromImageData( data )
      // 		.toImageData()
      // 	  .then( function( imageData ) {

      //       // var c = document.createElement( 'canvas' );
      // 			// var ctx = c.getContext( '2d' );
      // 			// ctx.putImageData( imageData, 0, 0 );

      // 			// document.body.appendChild( canvas );

      //         console.log("glitch")
      //     const ctx = canvas.getContext("2d");
      //     ctx.putImageData( imageData, 0, 0 );
      // } );
    })
  };


  const printInTerminal = (content) => {
    console.log("terminalRef.current", terminalRef.current)
    terminalRef.current.state.instances[0].instance.updater.enqueueSetState(
      terminalRef.current.state.instances[0].instance,
      {
        summary: [
          ...terminalRef.current.state.instances[0].instance.state.summary,
          ...(Array.isArray(content) ? content.map((c) => [c]) : [content]),
        ],
      }
    );
  };

  useEffect(() => {
    senderHasResponded = false
    if(!agentName || !senderName) return;
    setTimeout(() => {
      setShowWarning("block");
    setTimeout(() => {
      setShowImage("block");
      setShowMask("none"); //       setShowMask("block");


      setTimeout(() => {
        setShowTerminal("block");
        setTimeout(() => {
          if (!senderHasResponded) {
            console.log("senderHasResponded", senderHasResponded)

          printInTerminal(agentName + " > " + "...hello?")
          setTimeout(() => {
            if (!senderHasResponded) {
              console.log("senderHasResponded", senderHasResponded)

              printInTerminal(agentName + " > " + "are you there?")
              setTimeout(() => {
                if (!senderHasResponded) {
                  console.log("senderHasResponded", senderHasResponded)

                  printInTerminal(agentName + " > " + "...hello???")
                }
              }, 15000 + 5000 * Math.random())
            }
          }, 10000 + 3000 * Math.random())
        }
        }, 3000 + 1000 * Math.random())
      }, 3000 + 1000 * Math.random())
      captureCanvas();
    }, 500 + 5000 * Math.random())
  }, 4000 + 500 * Math.random())

    if (senderName == "") {
      terminalTextRef.current = "Who are you?";
    } else if (agentName == "") {
      terminalTextRef.current = "Connecting";

    } else
      terminalTextRef.current = "Connected to " + agentName;
  }, [agentName, senderName]);

  const handleCommand = (input, print) => {
    setSenderHasResponded(true);
    console.log("senderHasResponded", senderHasResponded)

    if (senderName == "") {
      setSenderName(input);
      const body = { sender: senderName, command: "GET_AGENT_NAME" };
      axios.post(`${process.env.VITE_SERVER_CONNECTION_URL}/execute`, body).then(res => {
        setAgentName(res.data.result);
      });
      return;
    }

    if (input[0].includes("/nick")) {
      setSenderName(input[1]);
      print(SYSTEM + " > " + "Set NICK to ", senderName)
    }

    // TODO: Handle sender
    const body = { sender: senderName, command: input.join(" ") };
    axios.post(`${process.env.VITE_SERVER_CONNECTION_URL}/execute`, body).then(res => {
      console.log("response is", res);
      console.log(agentName + " > " + res.data.result);
      print(agentName + " > " + res.data.result)
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
        color="green"
        hideTopBar={true}
        allowTabs={false}
        backgroundColor="black"
        barColor="black"
        style={{ display:showTerminal, margin: "auto", marginTop: "10%", width: "50%", overflow: "hidden", height: "50%", fontWeight: "bold", fontSize: "1em", zIndex: "1000" }}
        commands={{
        }}
        description={{
        }}
        msg={
          senderName == "" ?
            "Who are you?" :
            senderName != "" && agentName == "" ?
              "Connecting to agent..." :
              senderName != "" && agentName != "" ?
                "Connected to " + agentName + " as " + senderName + "\nNote: Control has been yielded to the SYSTEM PERIL DISTRIBUTED REFLEX." :
                ""
        }
        commandPassThrough={handleCommand}
      />
      <img ref={imageRef} src="./screenshot.png" style={{ display: showImage, width: "100%", height: "100%", position: "absolute", zIndex: -1000 }} />
      <img src="./warning.png" style={{ display: showWarning, width: "800px", height: "500px", left: "200px", top: "50px", position: "absolute", zIndex: 1000 }} />
      <img src="./mask.png" style={{ display: showMask, width: "400px", height: "700px", right: "200px", top: "0px", position: "absolute", zIndex: 1000 }} />

      </div>
  );
}

export default App
