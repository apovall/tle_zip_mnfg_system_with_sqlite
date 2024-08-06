import React, { useEffect, useState, useRef } from "react";



function SerialComms() {
  const navigator = useRef(window.navigator);
  const textEncoder = useRef(new TextEncoderStream())
  const writer = useRef<WritableStreamDefaultWriter<string> | null>(null)
  const writableStreamClosed = useRef<Promise<void> | null>(null)
  const textDecoder = useRef(new TextDecoderStream())
  const reader = useRef<ReadableStreamDefaultReader<string> | null>(null)
  const readableStreamClosed = useRef(null)
  const terminator = "\r\n"


  const [port, setPort] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  async function readSerial() {
    let textStream = ""
    try {
      while (true) {
        const { value, done } = await reader.current.read()
  
        if (done) {
          reader.current?.releaseLock()
          break
        }
  
        if (value) {
          textStream += value;
          let lines = textStream.split(`${terminator}`);
          // console.log(lines)
          // textStream = lines.pop();
          console.log(lines)
          // console.log(lines)
        }
  
      }
    } catch (error) {
      // disconnectSerial()
      console.log("Error: ", error)
    }
  }

  function writeData() {
    let command = "< start" + terminator + "mode: 2" + terminator + ">" + terminator
    console.log(command)
    // const cmdElement = document.getElementById("command")
    // let command = cmdElement.value
    // if (command == null || command == "") {
    //   return
    // }
    // appendNewDataRow([command], 'write')
    // cmdElement.value = ""
    writer.current?.write(command)
  }

  const requestPort = async () => {
    try {
      const selectedPort = await navigator.current.serial.requestPort();
      await selectedPort.open({ baudRate: 115200 });
      setPort(selectedPort);
      setIsConnected(true);

      writableStreamClosed.current = textEncoder.current.readable.pipeTo(selectedPort.writable)
      writer.current = textEncoder.current.writable.getWriter()

      readableStreamClosed.current = selectedPort.readable.pipeTo(textDecoder.current.writable)
      reader.current = textDecoder.current.readable.getReader()

      console.log("Port opened:", selectedPort);
    } catch (error) {
      console.error("Error opening serial port:", error);
    }
  };

  // useEffect(() => {
  //   // Handler for when a serial device is connected
  //   const handleConnect = (event) => {
  //     setPort(event.target);
  //     setIsConnected(true);
  //     console.log("Serial device connected:", event.target);
  //   };

  //   // Handler for when a serial device is disconnected
  //   const handleDisconnect = (event) => {
  //     setPort(null);
  //     setIsConnected(false);
  //     console.log("Serial device disconnected:", event.target);
  //   };

  //   // Add event listeners for connect and disconnect
  //   // navigator.current.serial.addEventListener("connect", handleConnect);
  //   // navigator.current.serial.addEventListener("disconnect", handleDisconnect);

  //   // Cleanup event listeners on component unmount
  //   // return () => {
  //   //   navigator.current.serial.removeEventListener("connect", handleConnect);
  //   //   navigator.current.serial.removeEventListener(
  //   //     "disconnect",
  //   //     handleDisconnect
  //   //   );
  //   // };
  // }, []);
  
  useEffect(() => {
    if (port !== null){
      readSerial()
    }
    
  }, [port])

  return (
    <div>
      {" "}
      <h1>Serial Connection Monitor</h1>
      {isConnected ? (
        <p>Serial device connected.</p>
      ) : (
        <p>No serial device connected.</p>
      )}
      <button onClick={requestPort}>Request Serial Port</button>{" "}
      <div>
        <button onClick={writeData}> Start </button>
      </div>
    </div>
  );
}

export default SerialComms;
