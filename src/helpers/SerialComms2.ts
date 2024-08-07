let port;
let reader;
let writer;
let readableStreamClosed;
let writableStreamClosed;

let baudRate = 115200; 
let cmdTerminator = "\n";


export async function initialConnectAndRead() {
  await connectToSerialPort()

  const textEncoder = new TextEncoderStream();
  writableStreamClosed = textEncoder.readable.pipeTo(port.writable)
  writer = textEncoder.writable.getWriter()

  const textDecoder = new TextDecoderStream()
  readableStreamClosed = port.readable.pipeTo(textDecoder.writable)
  reader = textDecoder.readable.getReader()

  await readSerial()
}


async function connectToSerialPort() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: baudRate, dataBits: 8, parity: "none", stopBits: 1 });
  } catch (error) {
    console.error(error);
  }
}

export async function readSerial() {
  let textStream = ""
  try {
    while (true) {
      const { value, done } = await reader.read()

      if (done) {
        reader.releaseLock()
        break
      }

      if (value) {
        textStream += value;
        let lines = textStream.split("\n");
        textStream = lines.pop();
        appendNewDataRow(lines)
      }

    }
  } catch (error) {
    disconnectSerial()
    console.log("Error: ", error)
  }
}

export async function serialWrite(command) {
  writer.write(command + `${cmdTerminator}`)
}