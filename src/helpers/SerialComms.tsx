import React, { useContext, useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { SystemContext } from "../context/SystemContext";
import NextButton from "../components/shared/NextButton"
import { RawResults } from '@/types/interfaces'

interface SerialCommsProps {
  setRawResults: Dispatch<SetStateAction<RawResults>>;
}

function SerialComms({ setRawResults }: SerialCommsProps) {
  const { pageNumber, setPageNumber } = useContext(SystemContext);

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
  const newTest = "< start" + terminator + "mode: 2" + terminator + ">" + terminator
  const newResult = "< result" + terminator

  async function readSerial() {
    let textStream = ""

    let results

    try {
      while (true) {
        const { value, done } = await reader.current.read()

        if (done) {
          reader.current?.releaseLock()
          break
        }

        if (value) {
          // Throw away start of test and start of new results lines
          if (value == newTest || value == newResult){
            textStream = ""
          } else {
            textStream += value;
          }
        }

        results = textStream.split(`${terminator}`);

        if (results.at(-1) == "" && results.at(-2) == ">"){
          setRawResults({results})
          results = []
          textStream = ""
        }
      }
    } catch (error) {
      // TODO: disconnectSerial()
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

  function updateResults() {
    let command = terminator + "< result" + terminator + `resistance_ok: pass` + terminator + ">" + terminator
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
      const allPorts = await navigator.current.serial.getPorts();
      console.log('All Ports:', allPorts)
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
  
  useEffect(() => {
    if (port !== null){
      readSerial()
    }

    if (isConnected){
      setPageNumber(pageNumber + 1)
    }
    
  }, [port, isConnected])

  return (
    <div>
      <div className="flex flex-row">
        <button className="mt-40 w-1/2 bg-black mx-auto justify-center text-white text-2xl self-center rounded-2xl py-4 bg-gradient-to-r from-zip-light to-zip-dark hover:scale-105 uppercase  transition-transform" onClick={requestPort}>Connect tester</button>{" "}
      </div>
      {/* <div>
        <button onClick={writeData}>Start</button>
      </div>
      <div>
        <button onClick={updateResults}>Resistance OK</button>
      </div> */}
    </div>
  );
}

export default SerialComms;