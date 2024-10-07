import { RawResults } from '@/types/interfaces'

function ResistorTestFeedback(resistorReadout:RawResults) {

  console.log('resistorReadout', resistorReadout)
  const text = resistorReadout['results'] ? resistorReadout['results'][0] : "No read out"

  return (
    <div className='flex flex-wrap justify-around'>
      <div className="flex flex-col flex-nowrap  justify-center text-main h-[500px]">
        <h1  className='text-center text-4xl my-4 font-light'>{resistorReadout['results'] ? "Resistance:" : "No read out"}</h1>
        <h1  className='text-center text-xl my-4 font-light'>{resistorReadout['results'] ? "" : "Connect tester and set to resistor detect mode."}</h1>
        <h1 className='text-center text-6xl capitalize'>{ text.split('resistance:')[1] }</h1>   
      </div>
      <div className='text-main text-xl my-4 font-light flex flex-col flex-nowrap  justify-center h-[500px] border-l-2 border-medium-gray px-8'>
        <h1  className='text-left text-3xl my-4 font-light'>How to use</h1>
        <ol className='list-decimal list-inside'>
          <li className='p-2'>Ensure <b className='font-bold'>tester is plugged in</b></li>
          <li className='p-2'>Ensure <b className='font-bold'>resistor detect mode</b> is selected on DIP switches</li>
          <li className='p-2'>Ensure <b className='font-bold'>a new H2 cell is fitted</b> to the unit being tested</li>
          <li className='p-2'><b className='font-bold'>Reconnect device comms</b> (top right) if necessary</li>
          <li className='p-2'><b className='font-bold'>Press</b> reset on tester</li>
          <li className='p-2'>If system shows "No read out", then <b className='font-bold'>flip test clamp</b></li>
        </ol>
      </div>

    </div>
  )
}

export default ResistorTestFeedback