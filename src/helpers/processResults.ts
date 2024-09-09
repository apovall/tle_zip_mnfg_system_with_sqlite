import { RawResults, SetUnitDetails, UnitDetails } from "@/types/interfaces";

function processResults(
  results: RawResults, 
  unitDetails: UnitDetails,
  setUnitDetails: SetUnitDetails, 
  ) {
  let cleanedResults = {};
  let resCheckResult = "unknown"
  let battCheckResult = "unknown"
  let action = "flip"
  const terminator = "\r\n"

  if (results.results) {
    results.results?.forEach((item) => {
      if (!["< result", ">", ""].includes(item)) {
        let splitResult = item.split(": ");
        let key = splitResult[0]
        let value = splitResult[1]

        cleanedResults = {...cleanedResults, [key]: value }
        if (splitResult[1] == 'fail'){
          console.log('detected a fail state')
          action = 'fail'
        } 

        if (key == "vcell_unloaded"){
          battCheckResult = checkBattVoltage(parseInt(value))
          cleanedResults = {...cleanedResults, batt_voltage_ok: battCheckResult }
        }

        if (value.includes(" mV")){
          cleanedResults = {...cleanedResults, [key]: parseInt(splitResult[1].split(' mV')[0]) }
        }


        if (value.includes(" ohms")){
          resCheckResult = checkResistance(unitDetails["resistorLoaded"], parseInt(value))
          cleanedResults = {...cleanedResults, 'resistance_ok': resCheckResult,  [key]: parseInt(value.split(' ohms')[0]) }
        }

        if (value.includes("error")){
          resCheckResult = 'fail'
          cleanedResults = {...cleanedResults, [key]: "error", "resistance_ok": resCheckResult}
        }
      }
    });

    let finalOutcome = finalCheck(cleanedResults)

    if (finalOutcome !== 'unknown'){
      action = finalOutcome
    }

    cleanedResults = {...cleanedResults, result: finalOutcome, action: action}
    setUnitDetails.setUnitDetails((prev) => {
      return {...prev, ...cleanedResults}
    })
  }

  // return {"batt_voltage_ok": battCheckResult, "resistance_ok": resCheckResult}
  return  "< result" + terminator + 
          `batt_voltage_ok: ${battCheckResult}` + terminator +
          `resistance_ok: ${resCheckResult}` + terminator +
          ">" + terminator
}

export default processResults;

function checkResistance(loadedValue:number | null, measuredValue:number){
  const threshold = 0.05

  if (loadedValue == undefined){
    return 'unknown'
  }

  const upperRange = loadedValue + (loadedValue * threshold)
  const lowerRange = loadedValue - (loadedValue * threshold)

  if (measuredValue < lowerRange || measuredValue > upperRange){
    return 'fail'
  }
  return 'pass'
}

function checkBattVoltage(measuredCell:number | undefined){
  const vCellThreshold = 1.1
  
  if (measuredCell == undefined){
    return 'unknown'
  }
  if (measuredCell < vCellThreshold){
    return 'fail'
  }
  return 'pass'
}

function finalCheck(cleanedResults:any) {
  let assessedItems = ["batt_contact_ok",  "batt_voltage_ok",  "tilt_sw_opens",  "tilt_sw_closes",  "resistance_ok", "resistance"]
  let hasUnknown

  for (let key of assessedItems){
    if (cleanedResults[key] == 'fail' || cleanedResults[key] == "error"){
      return 'fail'
    }
    if (cleanedResults[key] == 'unknown'){
      hasUnknown = true
    }
  }
  
  return hasUnknown ? "unknown" : "pass"

}
