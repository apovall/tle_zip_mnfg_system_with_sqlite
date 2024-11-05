function DispenserDetailDisplay({fills}: {serial: string | null, fills: number | null}) {

  let fillIcons = []

  for (let i = 1; i < 5; i++){
    let styling = 'w-[49px] h-[49px] border border-black rounded-md text-black flex flex-col justify-center text-center mx-1'
    if (fills == null || i <= fills + 1){
      styling += " bg-[#555555]"
    } else {
      styling += " bg-[#ffffff]"
    }

    fillIcons.push(
      <p className={`${styling}`} key={`fill-state-${i}`}>
        {i}
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-row justify-start my-8">
        <div className="basis-1/3 text-right">
          <p>Remember to record the</p>
          <p>next number on the</p>
          <p>dispenser body:</p>
        </div>
        <div className="basis-2/3 pl-8 font-roboto text-center text-3xl flex flex-row justify-start ">
        {fills !== null && 
          <div>
            <p className="mb-2" >Fill No.</p>
            <div  className="flex flex-row justify-center" key="icons-display">
            {fillIcons.map((icon, index) => {
              return (
                <span key={`fill-icon-${index}`}>{icon}</span>
                )
              })}
            </div>
          </div>
        }
        </div>
      </div>
    </>
  )
}

export default DispenserDetailDisplay