import React from 'react'

import { useContext, useRef } from "react";
import { SystemContext } from "../../context/SystemContext";

interface CompletePackingButtonProps {
  text: string;
  isDisabled: boolean;
  saveResults: React.MouseEventHandler<HTMLButtonElement>;
}

function CompletePackingButton({ text, isDisabled, saveResults }: CompletePackingButtonProps) {
  // const { pageNumber, setPageNumber } = useContext(SystemContext);
  const styling = isDisabled ? "bg-disabled" : "bg-gradient-to-r from-zip-light to-zip-dark hover:scale-105"

  return (
    <button
      className={`mt-20 w-1/2 text-white text-2xl self-center rounded-2xl py-4 ${styling} uppercase  transition-transform`}
      disabled={isDisabled}
      onClick={saveResults}
    >
      {text}
    </button>
  );
}

export default CompletePackingButton;
