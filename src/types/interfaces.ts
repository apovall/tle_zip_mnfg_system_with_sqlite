import { BrowserSerial } from 'browser-serial'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'

export interface UnitDetails {
  qrCode: string | null,
  batchNumber: string | null,
  resistorLoaded: number | null,
  result: "pass" | "fail" | null
  batt_contact_ok: "pass" | "fail" | "unknown" | null
  batt_voltage_ok: "pass" | "fail" | "unknown" | null
  tilt_sw_opens: "pass" | "fail" | "unknown" | null
  tilt_sw_closes: "pass" | "fail" | "unknown" | null
  resistance_ok: "pass" | "fail" | "unknown" | null
  resistance: "unknown" | "error" | number | null
  vcell_loaded: "unknown" | number | null
  vcell_unloaded: "unknown" | number | null
  action: "hold" | "flip" | "pass" | "fail";
  h2cellBatch: string | null;
}

export interface SetUnitDetails {
  setUnitDetails: Dispatch<SetStateAction<UnitDetails>>
}

export interface JobDetails {
  batchNumber: string | undefined
  resistorLoaded: number | undefined
}

interface QRCode {
  qrCode: string | undefined,
}

export interface TextInputProps {
  label: string;
  setInputValues: Dispatch<SetStateAction<any>>;
  target: string;
  value: string | null;
  autoFocus?: boolean;
  submitOverride?: boolean;
}

export interface RawResults {
  results: Array<string> | null;
}

export interface TestParameters {
  text: string;
  value: string | number | null
  status: "pass" | "fail" | "unknown" | null
}

export interface SystemContextProps {
  activeJob: "select" | "test" | "assemble" | "resistor_check" | "fill_dispeners" | "6_pack" | "12_box";
  setActiveJob: Dispatch<SetStateAction<"select" | "test" | "assemble" | "resistor_check" | "fill_dispeners" | "6_pack" | "12_box">>
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  isConnected: boolean;
  setIsConnected: Dispatch<SetStateAction<boolean>>;
  serial: MutableRefObject<BrowserSerial>;
}

export interface ProcessResultsProps {
  results: string[] | null
  setUnitDetails: Dispatch<SetStateAction<UnitDetails>>
}

export interface setWriteCommand {
  setWriteCommand: Dispatch<SetStateAction<string>>
}

export interface SerialCommsWrite {
  serialCommsWrite: (command: string) => Promise<void>
}

export interface CancelSerialButtonProps {
  text: string;    
  disconnect: () => void;
  }

export interface AssemblyJobDetails {
  batchNumber: string | null
  dispenserSerial: string | null
  pcbSerial: string | null
  unitVariant: string | null
}

export interface BatchCodesProps {
  pcbSerial: string | null,
  dispenserSerial: string | null,
}

export interface FillingJobDetails {
  jobNumber: string;
}