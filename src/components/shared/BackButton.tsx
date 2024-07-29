import { useContext } from "react";
import { SystemContext } from "../../context/SystemContext";

function BackButton({ text }: { text: string, }) {
  const { pageNumber, setPageNumber } = useContext(SystemContext);

  return (
    <button
      className={`self-start mx-4 mt-40  text-2xl border-2 border-zip-dark hover:bg-zip-light hover:text-white hover:scale-105 rounded-2xl py-2 px-8 uppercase  transition-all`}
      onClick={() => setPageNumber(pageNumber - 1)}
    >
      {text}
    </button>
  );
}

export default BackButton;
