import { RawResults } from '@/types/interfaces'

function ResistorTestFeedback(resistorReadout:RawResults) {

  console.log('resistorReadout', resistorReadout)
  const text = resistorReadout['results'] ? resistorReadout['results'][0] : "No read out"

  return (
    <div className="flex flex-col flex-nowrap mx-auto justify-center text-main h-[500px]">
      <h1  className='text-center text-4xl my-4 font-light'>{resistorReadout['results'] ? "Resistance:" : "No read out"}</h1>
      <h1  className='text-center text-xl my-4 font-light'>{resistorReadout['results'] ? "" : "Connect tester and set to resistor detect mode."}</h1>
      <h1 className='text-center text-6xl capitalize'>{ text.split('resistance:')[1] }</h1>   
    </div>
  )
}

export default ResistorTestFeedback