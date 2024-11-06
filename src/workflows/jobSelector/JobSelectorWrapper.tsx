import ActionSelector from "../../components/shared/ActionSelector"

function JobSelectorWrapper() {

  return (
    <div className='flex flex-row justify-center'>
      <ActionSelector type="test" text='Test Units'/>
      <div className="flex flex-col flex-nowrap justify-between">
        <ActionSelector type="resistor_check" text='Resistor Check Units'/>
        <ActionSelector type="assemble" text='Assemble Units'/>
      </div>
      <div className="flex flex-col flex-nowrap justify-between">
        <ActionSelector type="fill_dispeners" text='Fill Dispensers'/>
        <ActionSelector type="6_pack" text='Box 6 Pack' disabled/>
        <ActionSelector type="72_pack" text='Box 72 Pack' disabled/>
      </div>
    </div>
  )
}

export default JobSelectorWrapper