import { createContext, FC, useState, ReactNode } from 'react';
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
});

interface SystemProviderProps {
  children: ReactNode;
}

export const SystemContextProvider:FC<SystemProviderProps> = ({children}) => {
  const [pageNumber, setPageNumber] = useState(0)
  const [activeJob, setActiveJob] = useState<"select" | "test" | "assemble">("select")
  const [isConnected, setIsConnected] = useState(false)

  return (
    <SystemContext.Provider value={{ pageNumber, setPageNumber, activeJob, setActiveJob, isConnected, setIsConnected }}>
      {children}
    </SystemContext.Provider>
  )
}

