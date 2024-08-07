import { RawResults, SetUnitDetails, setWriteCommand } from "@/types/interfaces";

function processResults(results: RawResults, setUnitDetails: SetUnitDetails, setWriteCommand: setWriteCommand) {
  let cleanedResults = {};
  const terminator = "\r\n"

  if (results.results) {
    results.results?.forEach((item) => {
      if (!["< result", ">", ""].includes(item)) {
        let splitResult = item.split(": ");

        if (splitResult[1].includes(" mV")){
          splitResult[1] = splitResult[1].replace(" mV", "");
        }
        if (splitResult[1].includes(" ohms")){
          splitResult[1] = splitResult[1].replace(" ohms", "");
        }

        cleanedResults = {...cleanedResults, [splitResult[0]]: splitResult[1] }
      }
    });
    // // setWriteCmd.setWriteCmd("Test data being written")
    setWriteCommand.setWriteCommand("< result" + terminator + "resistance_ok: pass" + terminator + ">" + terminator)
    setWriteCommand.setWriteCommand("< result" + terminator + "batt_voltage_ok: pass" + terminator + ">" + terminator)
    setUnitDetails.setUnitDetails((prev) => {
      return {...prev, ...cleanedResults}
    })
  }

}

export default processResults;
