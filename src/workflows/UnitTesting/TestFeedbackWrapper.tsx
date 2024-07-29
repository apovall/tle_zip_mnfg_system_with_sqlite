import TestParameterFeedback from "./TestParameterFeedback";
import InstructionBlock from "./InstructionBlock";

function TestFeedbackWrapper() {
  return (
    <div className="flex flex-row justify-center text-main">
      <div className="flex flex-col justify-center">
        <TestParameterFeedback
          text="Battery Voltage OK"
          status={"ok"}
          isInTest={true}
        />
        <TestParameterFeedback
          text="Battery Voltage OK"
          status={"ok"}
          isInTest={true}
        />
        <TestParameterFeedback
          text="Battery Voltage OK"
          status={"ok"}
          isInTest={true}
        />
        <TestParameterFeedback
          text="Battery Voltage OK"
          status={"testing"}
          isInTest={true}
        />
        <TestParameterFeedback
          text="Battery Voltage OK"
          status={"fail"}
          isInTest={true}
        />

      </div>
        <div className="border-l border-disabled h-full mx-20"></div>
        <InstructionBlock text="hold unit orientation" status="hold" />
    </div>
  );
}

export default TestFeedbackWrapper;
