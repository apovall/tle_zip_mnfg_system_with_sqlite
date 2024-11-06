import { useEffect, useState } from "react";
import { FaThumbsUp, FaSpinner } from "react-icons/fa";
import GenericButton from "../../components/shared/GenericButton";

function JobComplete({handleComplete}: {handleComplete: () => void}) {
  const [processing, setProcessing] = useState<boolean>(true);

  useEffect(() => {
    const playAnimation = () => {
      setTimeout(() => {
        const thumbsUp = document.querySelector("#animated");
        thumbsUp?.classList.remove("animate-bounce");
      }, 2500);
    };

    if (!processing) {
      setProcessing(false)
      playAnimation();
    }
  }, [processing]);

  useEffect(() => {
    const stopThinking = () => {
      setTimeout(() => {
        setProcessing(false);
      }, 1000)
    }
    stopThinking();
  }, [])

  return (
    <div className="w-full h-screen ">
      {processing ? (
        <div className="flex flex-col justify-center items-center h-full">
          <FaSpinner className="animate-spin text-5xl text-zip-dark" />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <h1 className="text-5xl font-bold zip-dark my-16">All done!</h1>
          <div className="text-acceptable-green">
            <FaThumbsUp size={120} className="animate-bounce" id="animated" />
          </div>
          <GenericButton
            text="Return to Main Menu"
            isDisabled={false}
            onClickFunction={handleComplete}
          />
        </div>
      )}
    </div>
  );
}

export default JobComplete;
