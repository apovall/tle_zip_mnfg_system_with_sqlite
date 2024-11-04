import React from 'react'

interface SaveDispenserFillingButtonProps {
  text: string;
  isDisabled: boolean;
  marginOverride?: string;
  handleSave: () => void;
}

function SaveDispenserFillingButton({
  text,
  isDisabled,
  marginOverride = "mt-28",
  handleSave
}: SaveDispenserFillingButtonProps) {
  const styling = isDisabled
    ? "bg-disabled"
    : "bg-gradient-to-r from-zip-light to-zip-dark hover:scale-105";

  return (
    <button
      className={`${marginOverride} mx-auto w-1/2 text-white text-2xl self-center rounded-2xl py-4 ${styling} uppercase  transition-transform`}
      disabled={isDisabled}
      onClick={() =>{
        handleSave()
        console.log("Saved?")
      }}
    >
      {text}
    </button>
  );
}

export default SaveDispenserFillingButton;
