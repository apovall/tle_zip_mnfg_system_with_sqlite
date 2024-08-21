import { useContext, useEffect, useState } from "react";
import TextInput from "../../components/shared/TextInput";
import ResistorSelect from "../../components/shared/ResistorSelect";
import QRCodeInput from "../../components/shared/QRCodeInput";
import NextButton from "../../components/shared/NextButton";
import BackButton from "../../components/shared/BackButton";
import CancelButton from "../../components/shared/CancelButton";
import CompleteTestButton from "../../components/shared/CompleteTestButton";
import { SystemContext } from "../../context/SystemContext";
import TestFeedbackWrapper from "./TestFeedbackWrapper";
import SerialComms from "../../helpers/SerialComms";
import SerialCommsTS from "../../helpers/SerialCommsTS";
import { UnitDetails, RawResults } from "@/types/interfaces";
import processResults from "../../helpers/processResults";
import { saveUnitResults } from "../../better-sqlite3";
import { BrowserSerial } from "browser-serial";
// import { BrowserSerial } from "../../helpers/serialCopy";
import { dataCleanup } from "../../helpers/serialHelpers";

/* 
  Options: useRef instead of state for SerialComms?

*/

function TestingWrapper() {
  let componentBlock;
  let baseUnitDetails: UnitDetails = {
    batchNumber: null,
    resistorLoaded: 3600,
    qrCode: undefined,
    result: null,
    batt_contact_ok: null,
    batt_voltage_ok: null,
    tilt_sw_opens: null,
    tilt_sw_closes: null,
    resistance_ok: null,
    resistance: null,
    vcell_loaded: null,
    vcell_unloaded: null,
    action: "hold",
  };

  const { isConnected, setIsConnected, pageNumber } = useContext(SystemContext);
  const [rawResults, setRawResults] = useState<RawResults>({ results: null });
  const [unitDetails, setUnitDetails] = useState<UnitDetails>(baseUnitDetails);
  const [testingInProgress, setTestingInProgress] = useState(true);
  const [canProcessResults, setCanProcessResults] = useState(false)

  const [writeCommand, setWriteCommand] = useState("");
  const [startConnection, setStartConnection] = useState(0);
  const [portConnected, setPortConnected] = useState<Boolean>(false);
  const [serial, setSerial] = useState<BrowserSerial>(new BrowserSerial());

  const connectToReader = async () => {

    serial.connect()
        .then(() => {
          console.log("Connected to Reader");
          setIsConnected(true);
        })
        .catch((error) => {
          error = error.toString()
          const pattern = new RegExp("The port is already open")
          if (error.search(pattern) !=-1) {
            console.log('Ignoring error - The port is already open')
            return
          } else {
            console.log('Error in localSerial', error)
          }
          setIsConnected(false);
        }); 
  }

  const readSerial = async () => {
    // read data line by line as it comes in
    let results:Array<string> = []
    let cleanedData
    let lineReader = serial.readLineGenerator()

    try {
      for await (let { value, done } of lineReader) {   
        if (value) {
          results.push(value)
          // Disgusting but it works
          if (results[0] == '< start' && results[1] == 'mode: 2' && results[2] == '>'){
            results = []
          }

          // process results
          cleanedData = dataCleanup(results)
          if (cleanedData.results.length > 1){
            console.log(cleanedData)
            setRawResults(cleanedData)
            results = []
            // Once here, process the results and reset the results array.
          }
        }
        if (done === true) {
          console.log("done")
          await disconnectReader()
          break;
        }
      }
    } catch (error:any) {
      // Ignoring the error if it catches the port already being opened
      let errorString = error.toString()
      const pattern = new RegExp("A call to open()")
      if (errorString.search(pattern) !=-1) {
        console.log('Ignoring error - A call to open()')
        return
      } else {
        console.log("Error out from reader loop: \n ============")
      }

      try{
        console.log("====> Disconnecting")
        await disconnectReader()

      } catch (de){
        console.log("error disconnecting, ", de)
      }
      // try {
      //   console.log("Error ====> Forgetting")
      //   serial.port?.forget()
        
      // } catch (fe) {
      //   console.log("error forgetting, ", fe)
      // }
    }
  }

  const disconnectReader = async () => {
    serial.disconnect().then((result) => {
      console.log("Successful Disconnect executed in disconnectReader \n ===============", result)
    }).catch((e) => {
      console.log("Error Disconnecting in disconnectReader \n ===============", e)
    }).finally(() => {
      console.log('Do something in here?')
    })
    return 
  }


  switch (pageNumber) {
    case 0:
      componentBlock = (
        <>
          <ResistorSelect
            label="Resistor Loaded"
            unitDetails={unitDetails}
            setInputValues={setUnitDetails}
            target="resistorLoaded"
            value={unitDetails["resistorLoaded"]}
            autoFocus={true}
          />
          <TextInput
            label="Batch Name / Number"
            setInputValues={setUnitDetails}
            target="batchNumber"
            value={unitDetails["batchNumber"]}
          />
          <NextButton
            text="Start tests"
            isDisabled={
              unitDetails["batchNumber"] == null ||
              unitDetails["resistorLoaded"] == null
            }
          />
          <CancelButton text="Cancel Job" disconnectReader={disconnectReader} />
        </>
      );
      break;
    case 1:
      componentBlock = (
        <>
          <QRCodeInput
            label="PCB QR Code"
            setInputValues={setUnitDetails}
            target="qrCode"
            value={unitDetails["qrCode"]}
          />
          <NextButton
            text="Next"
            isDisabled={Object.values(unitDetails).includes(undefined)}
          />
          <BackButton text="Back" />
        </>
      );
      break;
    case 2:
      componentBlock = (
        <>
          <TestFeedbackWrapper details={unitDetails} />
          <CompleteTestButton
            isDisabled={testingInProgress}
            setTestingInProgress={setTestingInProgress}
            text="Save & Continue"
            pageTarget={1}
            unitDetails={unitDetails}
            baseUnitDetails={baseUnitDetails}
            setUnitDetails={setUnitDetails}
          />
          <BackButton text="Back" marginOverride="mt-10" />
        </>
      );
      break;
    default:
      break;
  }

  useEffect(() => {
    if (pageNumber == 1 || pageNumber == 0) {
      setCanProcessResults(false)
      setTestingInProgress(true);
    }

    if (pageNumber == 2) {
      setCanProcessResults(true)
    }

    return () => {}
  }, [pageNumber]);
 
  useEffect(() => {
    if (serial.port == null) {
      console.log('serial port is null, attempting connection')
      connectToReader()
    }

    return () => {}
  }, [serial.port]);

  // Read Serial on Loop, clean incoming data
  useEffect(() => {
    if (isConnected) {
      readSerial()
    }

    return () => {}

  }, [isConnected]);


  /* Want to have more processing logic, to stop the unit from continuing to read / process data while not in a test state */
  useEffect(() => {
    const processRawResults = () => {
      // let serialCommsWrite = serialComms.writeData //TODO: will this cause issues? Yes, yes it does
      let dataToWrite = processResults(
        rawResults,
        unitDetails,
        { setUnitDetails },
      );
      serial.write(dataToWrite)
    };

    if (canProcessResults){
      processRawResults();
    } else {
      console.log('cannot process results as canProcessResults is: ', canProcessResults)
    }

    return () => {};

  }, [rawResults]);

  // If the test has a pass or fail result
  useEffect(() => {
    const finaliseResults = () => {
      console.log("finalising result");
      saveUnitResults(unitDetails);
    };

    if (unitDetails.result == "pass" || unitDetails.result == "fail") {
      console.log("unitDetails.result: ", unitDetails);
      console.log(unitDetails);
      finaliseResults();
      setTestingInProgress(false);
      setCanProcessResults(false)
    }

    return () => {}

  }, [unitDetails.result]);

  return (
    <div className="w-full h-screen flex flex-col justify-center">
      <div className="text-right pb-20 px-4 absolute top-32 right-10">
        Device Connected:{" "}
        {isConnected ? (
          <span className="text-acceptable-green">Connected</span>
        ) : (
          <span className="text-orange cursor-pointer hover:scale-105 hover:text-acceptable-green" onClick={connectToReader}>Reconnect</span>
        )}
      </div>
      {/* <SerialComms
        setRawResults={setRawResults}
        writeCommand={writeCommand}
        startConnection={startConnection}
        setPortConnected={setPortConnected}
      /> */}
      {componentBlock}
    </div>
  );
}

export default TestingWrapper;







///////////////-================ Placeholder

  // useEffect(() => {
  //   // Port scan for disconnect
  //   const portScan = async () => {
  //     await new Promise(resolve => 
  //       setInterval(async () => {
  //         console.log('Checking serial is connected: ', serial.port)
  //         if (serial.port !== null && serial.port.readable == null){
  //           console.log('cannot read port')
  //           try {
  //             await serial.disconnect()
  //             await serial.port?.forget()
  //           } catch (error) {
  //             console.log('already disconnected')
  //           }
  //           setIsConnected(false)
  //         }
  //         // if (serial.port == null) {
  //         //   console.log('trying to connect')
  //         //   setSerial(new BrowserSerial())
  //         //   serial
  //         //     .connect()
  //         //     .then(() => {
  //         //       console.log("connected");
  //         //       setIsConnected(true);
  //         //     })
  //         //     .catch(() => {
  //         //       setIsConnected(false);
  //         //     }); //TODO: New - handle disconnect and reconnect
  //         //   // startComms()
  //         // }
  //       }, 2000)
  //     )
  //   }

  //   portScan()

  //   return () => {}

  // }, [])

