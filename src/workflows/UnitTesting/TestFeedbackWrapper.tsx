import TestParameterFeedback from "./TestParameterFeedback";
import InstructionBlock from "./InstructionBlock";
import { UnitDetails } from "@/types/interfaces";

interface UnitDetailsProps {
  details: UnitDetails;
}
// function TestFeedbackWrapper({qrCode, result, batt_contact_ok, batt_voltage_ok, tilt_sw_opens, tilt_sw_closes, resistance_ok, resistance, vcell_loaded, vcell_unloaded}:UnitDetails) {
function TestFeedbackWrapper({ details }: UnitDetailsProps) {

  return (
    <div className="flex flex-row justify-center text-main">
      <div className="flex flex-col justify-center basis-1/3">
        <TestParameterFeedback
          text="Battery Contact OK"
          value={null}
          status={details["batt_contact_ok"]}
        />
        <TestParameterFeedback
          text="Battery Voltage OK"
          value={null}
          status={details["batt_voltage_ok"]}
          
        />
        <TestParameterFeedback
          text="Resistance OK"
          value={null}
          status={details["resistance_ok"]}
        />
        <TestParameterFeedback
          text="Tilt Switch Closes"
          value={null}
          status={details["tilt_sw_closes"]}
        />
        <TestParameterFeedback
          text="Tilt Switch Opens"
          value={null}
          status={details["tilt_sw_opens"]}
        />
        <TestParameterFeedback
          text="Vcell Loaded"
          value={details["vcell_loaded"]}
          status={null}
        />
        <TestParameterFeedback
          text="Vcell Unloaded"
          value={details["vcell_unloaded"]}
          status={null}
        />
      </div>
      <div className="border-l border-disabled h-full mx-20"></div>
      <InstructionBlock status={details["action"]} />
      {['fail', 'pass'].includes(details["action"]) ? <p className="py-8">Saving to database...</p> : <></>}
      
    </div>
  );
}

export default TestFeedbackWrapper;
