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
        <ActionSelector type="6-pack" text='Shipping - 6 pack' disabled/>
        <ActionSelector type="shipping" text='Shipping - box up' disabled/>
      </div>
    </div>
  )
}

export default JobSelectorWrapper