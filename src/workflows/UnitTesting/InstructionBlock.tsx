function InstructionBlock({
  status,
}: {
  status: "hold" | "flip" | "pass" | "fail";
}) {
  let style;
  let text;

  switch (status) {
    case "hold":
      style = "bg-orange";
      text = "hold unit orientation";
      break;
    case "flip":
      style = "bg-lime";
      text = "flip unit";
      break;
    case "pass":
      style = "bg-acceptable-green";
      text = "passed";
      break;
    case "fail":
      style = "bg-cancel";
      text = "failed";
      break;

    default:
      break;
  }

  return (
    <div
      className={`h-[400px] w-[600px] ${style} flex flex-col justify-center`}
    >
      <h1 className="text-5xl text-center uppercase ">{text}</h1>
    </div>
  );
}

export default InstructionBlock;
