import React from "react";
import GetIcon from "../../helpers/GetIcon";

interface LabelProps {
  label: string;
  value: string;
  iconName?: string;
  timesUsed?: number | null;
  staticStyling?: string;
}

function Label({ 
  label, 
  value, 
  iconName, 
  timesUsed = null, 
  staticStyling="my-4 basis-3/4 font-semibold text-3xl text-zip-dark"
 }: LabelProps) {
  let styling = "";
  let icon;

  if (iconName) {
    icon = <GetIcon status={iconName} iconSize={25} alignment="text-right" />;
  } else {
    icon = <></>;
  }

  if (timesUsed && label == "Dispenser Serial") {
    styling = timesUsed >= 4 ? "text-cancel" : "text-black";
  }

  return (
    <>
      <div className={`flex flex-row flex-nowrap w-full ${styling}`}>
        <span className={`${staticStyling}`}>
          {label}
        </span>
        <span className="my-4 basis-1/4 mx-4 font-light text-xl">{value}</span>
        {timesUsed !== null && (
           <span className="my-4 basis-1/4 mx-4 font-light text-xl">
           Uses: {timesUsed}{" "}
           <span className="text-main text-sm">
             {timesUsed !== null ? "+1" : ""}
           </span>{" "}
         </span>
        )}
        <span className="my-4 basis-1/4 font-light text-xl inline">
          {icon}
        </span>
      </div>
    </>
  );
}

export default Label;
