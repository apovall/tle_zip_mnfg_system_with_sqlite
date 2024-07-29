import { createContext, Dispatch, SetStateAction, FC, useState, ReactNode } from 'react';

interface SystemContextProps {
  activeJob: "select" | "test" | "assemble"
  setActiveJob: Dispatch<SetStateAction<"select" | "test" | "assemble">>
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>
}

export const SystemContext = createContext<SystemContextProps>({
  activeJob: "select",
  setActiveJob: () => {},
  pageNumber: 0,
  setPageNumber: () => {}
});

interface SystemProviderProps {
  children: ReactNode;
}

export const SystemContextProvider:FC<SystemProviderProps> = ({children}) => {
  const [pageNumber, setPageNumber] = useState(0)
  const [activeJob, setActiveJob] = useState<"select" | "test" | "assemble">("select")

  return (
    <SystemContext.Provider value={{ pageNumber, setPageNumber, activeJob, setActiveJob }}>
      {children}
    </SystemContext.Provider>
  )
}

