
import { RawResults } from "@/types/interfaces"

export function dataCleanup(results:Array<string>, mode:string):RawResults {

  /* 
    Take results array, iterative over it, 
    and remove any instances have characters in it we don't want
  */
  let cleanedResult:string[] = []
  let rejectValue = ["< start", mode, ">", "< result", ">"]

  // Haven't reached the end of the results stream yet
  if (results.at(-1) !== ">" || results.length == 0){
    return {results: cleanedResult}
  }

  results.forEach((line:string) => {
    if (!rejectValue.includes(line)){
      cleanedResult.push(line)
    }
  })

  return {results: cleanedResult}
  

}