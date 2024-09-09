import ActionSelector from "../../components/shared/ActionSelector"

function JobSelectorWrapper() {

  return (
    <div className='flex flex-row justify-center'>
      <ActionSelector type="test" text='Test Units'/>
      <div className="flex flex-col flex-nowrap justify-between">
        <ActionSelector type="resistor_check" text='Resistor Check Units'/>
        <ActionSelector type="assemble" text='Assemble Units' disabled/>
      </div>
    </div>
  )
}

export default JobSelectorWrapper