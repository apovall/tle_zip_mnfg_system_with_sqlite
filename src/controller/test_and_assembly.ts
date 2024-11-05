import { parseDatetimeString } from '../helpers/time'
import { getSinglePCBTestDate } from '../better-sqlite3'

export function unitCanBeAssembled(pcbSerial: string): [boolean, string] {

  const timeDelta = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

  const timestamp = getSinglePCBTestDate(pcbSerial);

  if (timestamp == null) {
    return [false, "Unit not found in database or has failed its last test. Please test unit."]
  }
  
  const unitTestDatetime = parseDatetimeString(timestamp);
  const currentDateTime = new Date()

  console.log(currentDateTime.getTime(), currentDateTime)
  console.log(unitTestDatetime.getTime(), unitTestDatetime)
  console.log(currentDateTime.getTime() - unitTestDatetime.getTime() )
  console.log(timeDelta)
  console.log(currentDateTime.getTime() - unitTestDatetime.getTime() > timeDelta)

  if (currentDateTime.getTime() - unitTestDatetime.getTime() > timeDelta) {
    // Unit tested more than 2 days ago
    return [false, "Unit tested more than 48 hours ago. Please retest unit."]
  }

  return [true, ""]
}