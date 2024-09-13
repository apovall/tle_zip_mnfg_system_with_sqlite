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
        <ActionSelector type="box_packing" text='Box Up Units'/>
        <ActionSelector type="box_shipping" text='Ship Boxes' disabled/>
      </div>
    </div>
  )
}

export default JobSelectorWrapper