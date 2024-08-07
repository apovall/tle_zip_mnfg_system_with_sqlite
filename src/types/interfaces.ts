import { Dispatch, SetStateAction } from 'react'

export interface UnitDetails {
  qrCode: string | undefined,
  result: string | null
  batt_contact_ok: "pass" | "fail" | "unknown" | null
  batt_voltage_ok: "pass" | "fail" | "unknown" | null
  tilt_sw_opens: "pass" | "fail" | "unknown" | null
  tilt_sw_closes: "pass" | "fail" | "unknown" | null
  resistance_ok: "pass" | "fail" | "unknown" | null
  resistance: string | null
  vcell_loaded: string | number | null
  vcell_unloaded: string | number | null
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
  setInputValues:  Dispatch<SetStateAction<JobDetails>>;
  target: string;
  value: string | number | undefined;
}

export interface RawResults {
  results: Array<string> | null;
}

export interface SetUnitDetails {
  setUnitDetails: Dispatch<SetStateAction<UnitDetails>>
}

export interface TestParameters {
  text: string;
  value: string | number | null
  status: "pass" | "fail" | "unknown" | null
}

export interface SystemContextProps {
  activeJob: "select" | "test" | "assemble"
  setActiveJob: Dispatch<SetStateAction<"select" | "test" | "assemble">>
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>
}

export interface ProcessResultsProps {
  results: string[] | null
  setUnitDetails: Dispatch<SetStateAction<UnitDetails>>
}

export interface setWriteCommand {
  setWriteCommand: Dispatch<SetStateAction<string>>
}