import { useContext } from 'react'
import { SystemContext } from "../../context/SystemContext";

function CancelButton({ text }: { text: string }) {

  const { setActiveJob, setPageNumber } = useContext(SystemContext);

  return (
    <button
      className="self-start mt-40 mx-8 text-white text-lg  rounded-2xl py-2 px-8 bg-cancel hover:scale-105 transition-transform"
      onClick={() => {
        setPageNumber(0)
        setActiveJob("select")
      }}
    >
      {text}
    </button>
  );
}

export default CancelButton