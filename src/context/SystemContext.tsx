import { createContext, FC, useState, ReactNode, useRef } from 'react';
import { BrowserSerial } from "browser-serial";
import { SystemContextProps } from '@/types/interfaces';
import Database from 'better-sqlite3'
import { saveUnitResults } from '../better-sqlite3';


export const SystemContext = createContext<SystemContextProps>({
  activeJob: "select",
  setActiveJob: () => {},
  pageNumber: 0,
  setPageNumber: () => {},
  isConnected: false,
  setIsConnected: () => {},
  serial: { current: new BrowserSerial() }
});

interface SystemProviderProps {
  children: ReactNode;
}

export const SystemContextProvider:FC<SystemProviderProps> = ({children}) => {
  const [pageNumber, setPageNumber] = useState(0)
  const [activeJob, setActiveJob] = useState<"select" | "test" | "assemble">("select")
  const [isConnected, setIsConnected] = useState(false)

  const serial = useRef(new BrowserSerial())

  return (
    <SystemContext.Provider value={{ pageNumber, setPageNumber, activeJob, setActiveJob, isConnected, setIsConnected, serial }}>
      {children}
    </SystemContext.Provider>
  )
}

