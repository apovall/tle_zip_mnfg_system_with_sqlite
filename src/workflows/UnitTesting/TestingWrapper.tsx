import { useContext, useEffect, useRef, useState } from "react";
import TextInput from "../../components/shared/TextInput";
import ResistorSelect from "../../components/shared/ResistorSelect";
import QRCodeInput from "../../components/shared/QRCodeInput";
import NextButton from "../../components/shared/NextButton";
import BackButton from "../../components/shared/BackButton";
import CancelButton from "../../components/shared/CancelButton";
import CompleteTestButton from "../../components/shared/CompleteTestButton";
import { SystemContext } from "../../context/SystemContext";
import TestFeedbackWrapper from "./TestFeedbackWrapper";
import { UnitDetails, RawResults } from "@/types/interfaces";
import processResults from "../../helpers/processResults";
import { saveUnitResults } from "../../better-sqlite3";
import { BrowserSerial } from "browser-serial";
import { dataCleanup } from "../../helpers/serialHelpers";
import { ipcRenderer } from "electron";
import ResistorTestFeedback from "../ResistorTesting/ResistorTestFeedback";

function TestingWrapper() {
  let componentBlock;
  let baseUnitDetails: UnitDetails = {
    batchNumber: null,
    resistorLoaded: 3600,
    qrCode: null,
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

  const deviceModeLookup: { [key: string]: string } = {
    "mode: 1": "Manual",
    "mode: 2": "Automatic",
    "mode: 3": "Resistor Detect",
  };

  const { isConnected, setIsConnected, pageNumber, serial } =
    useContext(SystemContext);
  const [rawResults, setRawResults] = useState<RawResults>({ results: null });
  const [resistorReadout, setResistorReadout] = useState<RawResults>({ results: null });
  const [unitDetails, setUnitDetails] = useState<UnitDetails>(baseUnitDetails);
  const [testingInProgress, setTestingInProgress] = useState(true);
  const [canProcessResults, setCanProcessResults] = useState(false);

  const [deviceMode, setDeviceMode] = useState("Press Reset Button");

  const connectToReader = async () => {
    serial.current
      .connect()
      .then(() => {
        setIsConnected(true);
      })
      .catch((error) => {
        console.log("Error connecting to reader: ", error);
        setIsConnected(false);
      });
  };

  const readSerial = async () => {
    // read data line by line as it comes in
    let results: Array<string> = [];
    let cleanedData;
    let lineReader = serial.current.readLineGenerator();
    let unitMode = "unknown"; // Not relying on state to be updated in time to use

    try {
      for await (let { value, done } of lineReader) {
        if (value) {
          results.push(value);

          // Start statement has been received
          if (results[0] == "< start" && results[2] == ">") {
            unitMode = results[1];
            setDeviceMode(deviceModeLookup[results[1]]);
            results = [];
          }

          // startin state
          if (unitMode == "unknown") {
            continue;
          }

          if (unitMode == "mode: 2") {
            // process results if automatic mode
            cleanedData = dataCleanup(results, 'mode: 2');

            if (cleanedData.results !== null && cleanedData.results.length > 1) {
              setRawResults(cleanedData);
              results = [];
            }
          }

          if (unitMode == "mode: 3") {
            // process results if automatic mode
            cleanedData = dataCleanup(results, 'mode: 3');
            if (cleanedData.results !== null && cleanedData.results.length == 1) {
              setResistorReadout(cleanedData);
              results = [];
            }
          }

          if (unitMode == "mode: 1" && results.at(-1) == ">") {
            // Throw away results if mode 1
            results = [];
          }
        }
        if (done === true) {
          break;
        }
      }
    } catch (error: any) {
      // Ignoring the error if it catches the port already being opened
      let errorString = error.toString();
      const pattern = new RegExp("A call to open()");
      if (errorString.search(pattern) != -1) {
        //console.log('Ignoring error - Port already opened')
        return;
      } else {
        //console.log("Error out from reader loop: \n", error)
      }
    }
  };

  const disconnect = async () => {
    // See if reader needs to be unlocked first.
    if (serial.current.port?.readable.locked == true) {
      await serial.current.reader?.cancel();
    }

    // See if writer needs to be unlocked first.
    if (serial.current.port?.writable.locked == true) {
      await serial.current.writeToStream.getWriter().close();
    }

    // Wait - as it seems that the await functions don't actually await, and is the
    // cause of most of the error messages. A value of 0 works, but being safe with 250ms.
    await new Promise((resolve) => setTimeout(resolve, 250));
    await serial.current.port?.close();

    setIsConnected(false);
    setDeviceMode("Press Reset Button");
  };

  const resetSerialComms = async () => {
    // If the port has already been disconnected, then just connect to it
    if (serial.current.port == null || serial.current.port.readable == null) {
      serial.current = new BrowserSerial();
      connectToReader();
    } else {
      serial.current
        .disconnect()
        .then(() => {
          serial.current.port?.close();
          serial.current = new BrowserSerial();
        })
        .then(() => {
          connectToReader();
        });
    }
  };

  // const queryMode = () => {
  //   serial.current.write("< mode? >");
  // }

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
          <CancelButton text="Cancel Job" disconnect={disconnect} />
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
            pageOverride={2}
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
          <BackButton
            text="Back"
            marginOverride="mt-10"
            unitDetails={unitDetails}
            baseUnitDetails={baseUnitDetails}
            setUnitDetails={setUnitDetails}
          />
        </>
      );
      break;
    case 3:
      componentBlock = (
        <>
          <ResistorTestFeedback {...resistorReadout}/>
          <CancelButton text="Cancel Job" disconnect={disconnect} />
        </>
      );
      break;
    default:
      break;
  }

  useEffect(() => {
    if (pageNumber == 1 || pageNumber == 0 || pageNumber == 3) {
      setCanProcessResults(false);
      setTestingInProgress(true);
    }

    if (pageNumber == 2) {
      setCanProcessResults(true);
    }

    return () => {};
  }, [pageNumber]);

  useEffect(() => {
    if (serial.current.port == null) {
      connectToReader();
    }

    console.log("Port has changed ==>>", serial.current.port);

    return () => {};
  }, [serial.current.port]);

  // Read Serial on Loop, clean incoming data
  useEffect(() => {
    if (isConnected == true) {
      //console.log('initial connect')
      readSerial();
    }

    return () => {};
  }, [isConnected]);

  /* Want to have more processing logic, to stop the unit from continuing to read / process data while not in a test state */
  useEffect(() => {
    const processRawResults = () => {
      // let serialCommsWrite = serialComms.writeData //TODO: will this cause issues? Yes, yes it does
      let dataToWrite = processResults(rawResults, unitDetails, {
        setUnitDetails,
      });
      serial.current.write(dataToWrite);
    };

    if (canProcessResults) {
      processRawResults();
    }

    return () => {};
  }, [rawResults]);

  // If the test has a pass or fail result
  useEffect(() => {
    const finaliseResults = () => {
      saveUnitResults(unitDetails);
      console.log(unitDetails);
    };

    if (unitDetails.result == "pass" || unitDetails.result == "fail") {
      finaliseResults();
      setTestingInProgress(false);
      setCanProcessResults(false);
    }

    return () => {};
  }, [unitDetails.result]);

  useEffect(() => {
    let isMounted = true;
    ipcRenderer.on("serial-port-removed", (event, details) => {
      //console.log('Disconnecting reader')
      setDeviceMode("Press Reset Button");
      disconnect()
      setIsConnected(false);
    });
    ipcRenderer.on("serial-port-added", (event, details) => {
      setDeviceMode("Press Reset Button");
      // connectToReader();
      //console.log('Reconnecting reader')
    });

    const handleDeviceMode = async () => {
      if (isMounted) {
        // console.log(serial.current.port);
        if (serial.current.port == null || serial.current.port.readable == null){
          setIsConnected(false)
          setDeviceMode("Press Reset Button");
          try {
            await serial.current.writeToStream.getWriter().close();
            await new Promise((resolve) => {setTimeout(resolve, 250)})
            serial.current.port?.close();
            await new Promise((resolve) => {setTimeout(resolve, 250)})
          } catch (error) {
            console.log('could not close port', error)
          }
        }
      }
    };

    const intervalId = setInterval(handleDeviceMode, 2000);

    // Clean up the listener when the component unmounts
    return () => {
      ipcRenderer.removeListener("serial-port-removed", () => {});
      ipcRenderer.removeListener("serial-port-added", () => {});
      ipcRenderer.removeListener("suspend", () => {});
      ipcRenderer.removeListener("resume", () => {});
      ipcRenderer.removeListener("lock-screen", () => {});
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center">
      <div className="text-right pb-20 px-4 absolute top-32 right-10">
        <div className="">
          Device Mode:{" "}
          <span
            className={`${
              (deviceMode == "Automatic" || deviceMode == "Resistor Detect")
                ? "text-acceptable-green"
                : "text-orange"
            }`}
          >
            {deviceMode}
          </span>
        </div>
        Device Connected:{" "}
        {isConnected ? (
          <span className="text-acceptable-green">Connected</span>
        ) : (
          <span className="text-cancel cursor-pointer hover:scale-10 font-bold">
            Disconnected
          </span>
        )}
        {!isConnected ? (
          <div
            className="text-zip-dark cursor-pointer hover:scale-105 hover:text-acceptable-green"
            onClick={async () => {
              await resetSerialComms();
            }}
          >
            Reconnect comms
          </div>
        ) : (
          <></>
        )}
        {isConnected ? (
          <div
            className="text-zip-dark cursor-pointer hover:scale-105 hover:text-orange"
            onClick={disconnect}
          >
            Manually disconnect
          </div>
        ) : (
          <></>
        )}
      </div>
      {componentBlock}
      
      {/* Testing functions */}
      {/* <button onClick={queryMode}>Query Mode</button> */}
      {/* <button onClick={disconnect}>Disconnect</button> */}
      {/* <button onClick={readPortStatus}>Read Port Status</button> */}
    </div>
  );
}

export default TestingWrapper;
