function InstructionBlock({
  status,
}: {
  status: "hold" | "flip" | "pass" | "fail";
}) {
  let style;
  let text = [""];

  switch (status) {
    case "hold":
      style = "bg-orange";
      text = ["Reset tester.", "Hold unit orientation"];
      break;
    case "flip":
      style = "bg-lime";
      text = ["flip unit"];
      break;
    case "pass":
      style = "bg-acceptable-green text-white";
      text = ["passed"];
      break;
    case "fail":
      style = "bg-cancel text-orange";
      text = ["failed"];
      break;

    default:
      break;
  }

  return (
    <div
      className={`h-[400px] w-[600px] ${style} flex flex-col justify-center`}
    >
      <h1 className="text-5xl text-center uppercase ">
        {
          text.map((item, index) => {
            return <p key={`feedback-text-${text}-${index}`}>{item}</p>
          })
        }
      </h1>
    </div>
  );
}

export default InstructionBlock;
