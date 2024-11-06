interface GenericButtonProps {
  text: string;
  isDisabled: boolean;
  marginOverride?: string;
  onClickFunction: () => void;
}

function GenericButton({
  text,
  isDisabled,
  marginOverride = "mt-40",
  onClickFunction
}: GenericButtonProps) {
  const styling = isDisabled
    ? "bg-disabled"
    : "bg-gradient-to-r from-zip-light to-zip-dark hover:scale-105";

  return (
    <button
      className={`${marginOverride} w-1/2 text-white text-2xl self-center rounded-2xl py-4 ${styling} uppercase  transition-transform`}
      disabled={isDisabled}
      onClick={() =>
        onClickFunction()
      }
    >
      {text}
    </button>
  );
}

export default GenericButton;
