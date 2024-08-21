import { RawResults, SetUnitDetails, setWriteCommand, JobDetails, UnitDetails, SerialCommsWrite } from "@/types/interfaces";
import { Dispatch, SetStateAction } from 'react'

function processResults(
  results: RawResults, 
  unitDetails: UnitDetails,
  setUnitDetails: SetUnitDetails, 
  setWriteCommand?: setWriteCommand, //TODO: Remove?
  serialCommsWrite?: SerialCommsWrite //TODO: Remove?
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
        // console.log(splitResult)
        cleanedResults = {...cleanedResults, [splitResult[0]]: splitResult[1] }
        if (splitResult[1] == 'fail'){
          console.log('detected a fail state')
          action = 'fail'
        } 

        if (splitResult[0] == "vcell_unloaded"){
          battCheckResult = checkBattVoltage(parseInt(splitResult[1]))
          cleanedResults = {...cleanedResults, batt_voltage_ok: battCheckResult }
        }

        // }
        if (splitResult[1].includes(" ohms")){
          resCheckResult = checkResistance(unitDetails["resistorLoaded"], parseInt(splitResult[1]))
          cleanedResults = {...cleanedResults, 'resistance_ok': resCheckResult }
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

function checkResistance(loadedValue:number|null, measuredValue:number){
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
  let assessedItems = ["batt_contact_ok",  "batt_voltage_ok",  "tilt_sw_opens",  "tilt_sw_closes",  "resistance_ok"]
  let hasUnknown

  for (let key of assessedItems){
    if (cleanedResults[key] == 'fail'){
      return 'fail'
    }
    if (cleanedResults[key] == 'unknown'){
      hasUnknown = true
    }
  }
  
  return hasUnknown ? "unknown" : "pass"

  // // If all items in assessed items are 'pass', then pass entire device
  // hasPassed = Object.entries(cleanedResults).every((pair[1], value) => {

  //   // if (assessedItems.includes(pair[0])){

  //   //   return true
  //   // } 
  //   // return false
  //   // return element == 'fail' ? true : false
  // })

  // assessedItems.forEach((item) => {
  //   console.log(cleanedResults[item])
  //   if (cleanedResults[item] == "fail"){
  //     return 'fail' // Immediately return fail - as any failure fails entire unit.
  //   } else if (cleanedResults[item] == "unknown"){
  //     outcome = 'unknown'
  //   }
  // })
  // return outcome

}

async function sendResult(setWriteCommand:(command: string) => Promise<void>, target:string, result:string){
  const terminator = "\r\n"
  await new Promise(resolve => setTimeout(() => {
    setWriteCommand("< result" + terminator + `${target}: ${result}` + terminator + ">" + terminator)
  }, 100));
}
// async function sendResult(setWriteCommand:Dispatch<SetStateAction<string>>, target:string, result:string){
//   const terminator = "\r\n"
//   await new Promise(resolve => setTimeout(() => {
//     setWriteCommand("< result" + terminator + `${target}: ${result}` + terminator + ">" + terminator)
//   }, 100));
// }
