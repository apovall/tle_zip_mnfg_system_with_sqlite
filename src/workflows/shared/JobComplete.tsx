import { useEffect, useContext, useState } from "react";
import { FaThumbsUp, FaSpinner } from "react-icons/fa";
import GenericButton from "../../components/shared/GenericButton";
import { SystemContext } from "../../context/SystemContext";

function JobComplete() {
  const systemContext = useContext(SystemContext);
  const [thinking, setThinking] = useState<boolean>(true);

  const handleNavigate = () => {
    systemContext.setPageNumber(5);
  };

  useEffect(() => {
    const playAnimation = () => {
      setTimeout(() => {
        const thumbsUp = document.querySelector("#animated");
        thumbsUp?.classList.remove("animate-bounce");
      }, 2500);
    };

    if (!thinking) {
      setThinking(false)
      playAnimation();
    }
  }, [thinking]);

  useEffect(() => {
    const stopThinking = () => {
      setTimeout(() => {
        setThinking(false);
      }, 1000)
    }
    stopThinking();
  }, [])

  return (
    <div className="w-full h-screen ">
      {thinking ? (
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
            onClickFunction={handleNavigate}
          />
        </div>
      )}
    </div>
  );
}

export default JobComplete;
