function InstructionBlock({
  text,
  status,
}: {
  text: string;
  status: "hold" | "flip" | "passed" | "failed";
}) {
  let style;

  switch (status) {
    case "hold":
      style = "bg-orange";
      break;
    case "flip":
      style = "bg-lime";
      break;
    case "passed":
      style = "bg-acceptable-green";
      break;
    case "failed":
      style = "bg-cancel";
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
