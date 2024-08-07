import { RawResults, SetUnitDetails } from "@/types/interfaces";

function processResults(results: RawResults, setUnitDetails: SetUnitDetails) {
  let cleanedResults = {};

  console.log(results)

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

    setUnitDetails.setUnitDetails((prev) => {
      return {...prev, ...cleanedResults}
    })
  }
}

export default processResults;
