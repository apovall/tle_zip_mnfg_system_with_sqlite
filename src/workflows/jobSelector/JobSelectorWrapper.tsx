import ActionSelector from "../../components/shared/ActionSelector"

function JobSelectorWrapper() {

  return (
    <div className='flex flex-row justify-center'>
      <ActionSelector type="test" text='Test Units'/>
      <ActionSelector type="assemble" text='Assemble Units'/>
    </div>
  )
}

export default JobSelectorWrapper