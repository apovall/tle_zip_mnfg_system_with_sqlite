import { useContext } from 'react'
import { SystemContext } from "../../context/SystemContext";

import { CancelSerialButtonProps } from "../../types/interfaces"

function CancelSerialButton({ text, disconnect }: CancelSerialButtonProps) {

  const { setActiveJob, setPageNumber } = useContext(SystemContext);

  return (
    <button
      className="self-start mt-40 mx-8 text-white text-lg  rounded-2xl py-2 px-8 bg-cancel hover:scale-105 transition-transform"
      onClick={() => {
        // disconnectReader().then(() => {
        //   console.log('Disconnecting from cancel button')
        // })
        // setPageNumber(0)
        disconnect()
        setActiveJob("select")
      }}
    >
      {text}
    </button>
  );
}

export default CancelSerialButton