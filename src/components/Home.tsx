import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();

  useEffect(() => {
    const getRoomId = async () => {
      const response = await fetch(
        "https://api.huddle01.com/api/v1/create-room",
        {
          method: "POST",
          body: JSON.stringify({
            title: "Testing",
          }),
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "Lgiukg7CvVMxgdlMRUnOGoWqzRmBv85i",
          },
        }
      );
      const data = await response.json();
      if (data) {
        navigate(`/${data.data.roomId}/lobby`);
      }
    };
    getRoomId();
  }, []);
  return (
    <></>
  )
};

export default Home;
