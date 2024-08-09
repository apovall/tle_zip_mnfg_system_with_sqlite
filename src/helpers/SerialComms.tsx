import { useContext, useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { SystemContext } from "../context/SystemContext";
import { RawResults } from '@/types/interfaces'

interface SerialCommsProps {
  setRawResults: Dispatch<SetStateAction<RawResults>>;
  writeCommand: string
  startConnection: boolean
}

function SerialComms({ setRawResults, writeCommand, startConnection}: SerialCommsProps) {
  const { isConnected, setIsConnected } = useContext(SystemContext);

  const navigator = useRef(window.navigator);
  const textEncoder = useRef(new TextEncoderStream())
  const writer = useRef<WritableStreamDefaultWriter<string> | null>(null)
  const writableStreamClosed = useRef<Promise<void> | null>(null)
  const textDecoder = useRef(new TextDecoderStream())
  const reader = useRef<ReadableStreamDefaultReader<string> | null>(null)
  const readableStreamClosed = useRef(null)
  const terminator = "\r\n"

  const [port, setPort] = useState(null);
  // const [isConnected, setIsConnected] = useState(false);

  const newTest = "< start" + terminator + "mode: 2" + terminator + ">" + terminator
  const newResult = "< result" + terminator

  async function readSerial() {
    let textStream = ""
    let results

    try {
      while (true) {
        const { value, done } = await reader.current?.read()

        if (done) {
          reader.current?.releaseLock()
          break
        }
        // console.log(value)
        if (value) {
          console.log(value)
          // Throw away start of test and start of new results lines
          if (value == newTest || value == newResult){
            textStream = ""
          } else {
            textStream += value;
            // console.log(textStream)
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
      // disconnectSerial()
      console.log("Error: ", error)
    }
  }

  async function writeData(command: string) {
    // command = "< result" + terminator + "resistance_ok: pass" + terminator + ">" + terminator
    // console.log(command)
    // console.log(writer.current)
    if (command !== ""){
      writer.current?.write(command)
    }
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

    } catch (error) {
      console.error("Error opening serial port:", error);
    }
  };
  
  useEffect(() => {
    if (port !== null){
      readSerial()
    }
    // if (isConnected){
    //   setPageNumber(pageNumber + 1)
    // }
  }, [port, isConnected])

  useEffect(() => {
    if (startConnection){
      requestPort()
    }
  }, [startConnection])

  useEffect(() => {
    writeData(writeCommand);
  }, [writeCommand]);

  return (
    <div>
      {/* <div className="flex flex-row">
        <button className="mt-40 w-1/2 bg-black mx-auto justify-center text-white text-2xl self-center rounded-2xl py-4 bg-gradient-to-r from-zip-light to-zip-dark hover:scale-105 uppercase  transition-transform" onClick={requestPort}>Connect tester</button>{" "}
      </div> */}
    </div>
  );
}

export default SerialComms;