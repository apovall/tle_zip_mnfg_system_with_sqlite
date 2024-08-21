import { useContext, useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { SystemContext } from "../context/SystemContext";
import { RawResults } from '@/types/interfaces'

interface SerialCommsProps {
  setRawResults: Dispatch<SetStateAction<RawResults>>;
  writeCommand: string
  startConnection: number
  setPortConnected: Dispatch<SetStateAction<Boolean>>;
  isConnected: boolean
  setIsConnected: Dispatch<SetStateAction<boolean>>
}

class SerialCommsTS {

  private navigator: Navigator;
  private textEncoder: TextEncoderStream;
  private writer: WritableStreamDefaultWriter<string> | null = null;
  private writableStreamClosed: Promise<void> | null = null;
  private textDecoder: TextDecoderStream;
  private reader: ReadableStreamDefaultReader<string> | null = null;
  private readableStreamClosed: Promise<void> | null = null;
  private terminator: string;
  private isReadable: boolean;
  private port: SerialPort | null = null;
  private newTest: string;
  private setRawResults: Dispatch<SetStateAction<RawResults>>;
  private writeCommand: string //TODO: Technically can remove?
  private startConnection: number
  private setPortConnected: Dispatch<SetStateAction<Boolean>>;
  private isConnected: boolean //TODO: Technically can remove?
  private setIsConnected: Dispatch<SetStateAction<boolean>>

  constructor({ setRawResults, writeCommand, startConnection, setPortConnected, isConnected, setIsConnected }: SerialCommsProps) {

    this.setRawResults = setRawResults
    this.writeCommand = writeCommand
    this.startConnection = startConnection
    this.setPortConnected = setPortConnected
    this.isConnected = isConnected
    this.setIsConnected = setIsConnected

    this.navigator = window.navigator;
    this.textEncoder = new TextEncoderStream();
    this.textDecoder = new TextDecoderStream();
    this.terminator = "\r\n";
    this.isReadable = true;

    this.newTest = "< start" + this.terminator + "mode: 2" + this.terminator + ">" + this.terminator;

    // These states were previously managed by useRef and useState.
    // You can later define methods to interact with these properties.
    this.writer = null;
    this.writableStreamClosed = null;
    this.reader = null;
    this.readableStreamClosed = null;
    this.port = null;

  }

  public async requestPort(){
    try {
      const selectedPort = await this.navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 115200 });
      this.port = selectedPort;
      this.setIsConnected(true);
      this.isReadable = true

      this.writableStreamClosed = this.textEncoder.readable.pipeTo(selectedPort.writable)
      this.writer = this.textEncoder.writable.getWriter()
      console.log('In requestPort. this.writer:', this.writer)

      this.readableStreamClosed = selectedPort.readable.pipeTo(this.textDecoder.writable)
      this.reader =this.textDecoder.readable.getReader()

    } catch (error) {
      console.error("Error opening serial port:", error);
    }
  };

  public async readSerial() {
    let textStream = ""
    let results = []

    try {
      while (this.isReadable) {
        // const { value, done } = await reader.current?.read()
        const readStream = await this.reader?.read()
          console.log('readStream', readStream)
          if (readStream && !readStream.done){
            const { value } = readStream
  
            if (value) {
              textStream += value;
              console.log('textStream:', textStream)
            }
          }

          if (readStream && readStream.done) {
            this.reader?.releaseLock()
            break
          }
          // Split results based on a new test sequence being observed
          if (textStream.includes(this.newTest)){
            let split = textStream.split(this.newTest)
            textStream = split[1]
          }
         
          results = textStream.split(`${this.terminator}`);
  
          if (results.at(-1) == "" && results.at(-2) == ">"){
            console.log('Raw Results in Serial Read \n', results)
            this.setRawResults({results})
            results = []
            textStream = ""
          }
          // Yield back to the main thread periodically
          if (!readStream){
            await new Promise((resolve) => setTimeout(resolve, 0)); //TODO: I can see this breaking the serial comms quite badly
          }
      }
    } catch (error) {
      console.log("Error Error: ", error)
      this.isReadable = false
      this.setIsConnected(false)
      this.reader?.cancel()
      // setPortConnected(false)
      await this.closeConnections()
    }
  }

  public async writeData(command: string) {
    // command = "< result" + terminator + "resistance_ok: pass" + terminator + ">" + terminator
    // console.log(command)
    // console.log(writer.current)
    if (command !== ""){
      console.log('Write Command:\n', command)
      this.writer?.write(command).then(() => {
        console.log('===> write successful')
      }).catch(() => {
        console.log('===> write error?')
      })
    }
  }

  public async closeConnections(){

    try {
      if (this.reader) {
        console.log("closing reader")
        this.reader.cancel();
        console.log('Waiting for readable stream to close')
        this.readableStreamClosed?.catch(() => {
          console.log('Readable Stream Closed - done')
        });
        this.reader.releaseLock();
      }
    } catch (error) {
      console.log('Error closing reader', error)
    }

    try {
      if (this.writer) {
        console.log("closing writer")
        this.writer.close()
        console.log('Waiting for writeable stream to close')
        this.writableStreamClosed?.catch(() => {
          console.log('Writeable Stream Closed - done')
        });
        this.writer.releaseLock();
      }
    } catch (error) {
      console.log('Error closing writer', error)
    }

    try {
      if (this.port) {
        console.log("closing port =-=-=-=")
        console.log(this.port)

        await this.port.close();
        this.setIsConnected(false)
        this.port = null;
        console.log('shutting down done')
      }
    } catch (error) {
      console.log('Error closing port', error)
    }
  };
}


/* 
========================================================
========================================================
========================================================
*/

// function SerialCommsTS({ setRawResults, writeCommand, startConnection, setPortConnected}: SerialCommsProps) {

//   // const navigator = useRef(window.navigator);
//   // const textEncoder = useRef(new TextEncoderStream())
//   // const writer = useRef<WritableStreamDefaultWriter<string> | null>(null)
//   // const writableStreamClosed = useRef<Promise<void> | null>(null)
//   // const textDecoder = useRef(new TextDecoderStream())
//   // const reader = useRef<ReadableStreamDefaultReader<string> | null>(null)
//   // const readableStreamClosed = useRef<Promise<void> | null>(null)
//   // const terminator = "\r\n"
//   // const [isReadable, setIsReadable] = useState<boolean>(true)

//   // const [port, setPort] = useState<SerialPort | null>(null);

//   // const newTest = "< start" + terminator + "mode: 2" + terminator + ">" + terminator

//   /* ========= Copied */
//   async function readSerial() {
//     let textStream = ""
//     let results = []

//     try {
//       while (isReadable) {
//         // const { value, done } = await reader.current?.read()
//         const readStream = await reader.current?.read()

//           if (readStream && !readStream.done){
//             const { value } = readStream
  
//             if (value) {
//               textStream += value;
//             }
//           }

//           if (readStream && readStream.done) {
//             console.log("=====>> here")
//             console.log(readStream)
//             reader.current?.releaseLock()
//             break
//           }
//           // Split results based on a new test sequence being observed
//           if (textStream.includes(newTest)){
//             let split = textStream.split(newTest)
//             textStream = split[1]
//           }
         
//           results = textStream.split(`${terminator}`);
  
//           if (results.at(-1) == "" && results.at(-2) == ">"){
//             setRawResults({results})
//             results = []
//             textStream = ""
//           }
//       }
//     } catch (error) {
//       // setIsReadable(false)
//       console.log("Error Error: ", error)
//       setIsConnected(false)
//       reader.current?.cancel()
//       // setPortConnected(false)
//       await closeConnections()
//     }
//   }

//   /* ========= Copied */
//   async function writeData(command: string) {
//     // command = "< result" + terminator + "resistance_ok: pass" + terminator + ">" + terminator
//     // console.log(command)
//     // console.log(writer.current)
//     if (command !== ""){
//       writer.current?.write(command)
//     }
//   }

//   /* ========= Copied */
//   const requestPort = async () => {
//     try {
//       const selectedPort = await navigator.current.serial.requestPort();
//       await selectedPort.open({ baudRate: 115200 });
//       setPort(selectedPort);
//       setIsConnected(true);
//       setIsReadable(true)

//       writableStreamClosed.current = textEncoder.current.readable.pipeTo(selectedPort.writable)
//       writer.current = textEncoder.current.writable.getWriter()

//       readableStreamClosed.current = selectedPort.readable.pipeTo(textDecoder.current.writable)
//       reader.current = textDecoder.current.readable.getReader()


//     } catch (error) {
//       console.error("Error opening serial port:", error);
//     }
//   };

//   /* ========= Copied */
//   const closeConnections = async () => {

//     try {
//       if (reader.current) {
//         console.log("closing reader")
//         reader.current.cancel();
//         console.log('Waiting for readable stream to close')
//         readableStreamClosed.current?.catch(() => {
//           console.log('Readable Stream Closed - done')
//         });
//         reader.current.releaseLock();
//       }
//     } catch (error) {
//       console.log('Error closing reader', error)
//     }

//     try {
//       if (writer.current) {
//         console.log("closing writer")
//         writer.current.close()
//         console.log('Waiting for writeable stream to close')
//         writableStreamClosed.current?.catch(() => {
//           console.log('Writeable Stream Closed - done')
//         });
//         writer.current.releaseLock();
//       }
//     } catch (error) {
//       console.log('Error closing writer', error)
//     }

//     try {
//       if (port) {
//         console.log("closing port =-=-=-=")
//         console.log(port)

//         await port.close();
//         setIsConnected(false)
//         setPort(null);
//         console.log('shutting down done')
//         setIsConnected(false);
//       }
//     } catch (error) {
//       console.log('Error closing port', error)
//     }

//     // console.log('Waiting for readable stream to close')
//     // readableStreamClosed.current?.catch(() => {
//     //   console.log('done')
//     // });
//     // console.log('Waiting for writeable stream to close')
//     // await writableStreamClosed.current;
    


//     // console.log('shutting down done')
//     // setIsConnected(false);
//   };
  
//   useEffect(() => {
//     if (port !== null){
//       readSerial()
//       setIsConnected(true);
//       // setPortConnected(true)
//     }

//   }, [port, isConnected])

//   useEffect(() => {
//     console.log("port: ", port)
//     if (startConnection && port === null){
//       console.log('requesting new port')
//       requestPort()
//     }
//   }, [startConnection])

//   useEffect(() => {
//     writeData(writeCommand);
//   }, [writeCommand]);

//   useEffect(() => {
//     console.log('isReadable: ', isReadable)
//   },[isReadable])

// }

export default SerialCommsTS;