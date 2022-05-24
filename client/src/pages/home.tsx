import React from "react";
import axios from "axios";
import { useNavigate }  from "react-router-dom";
import { useInterval } from "../tools/interval";
import "./css/home.css";
import { SAPIBase } from "../tools/api";


const HomePage = (props: {}) => {
  const navigate = useNavigate();
  const [ BServerConnected, setBServerConnected ] = React.useState<boolean>(false);

  useInterval(()=>{
    // Note that this may not be the best practice.
    // Race condition may occur if component is unmounted after API call and before state update
    interface IStatusAPIRes { isOnline: boolean };
    const asyncFun = async () => {
      const res = await axios.get<IStatusAPIRes>(SAPIBase + "/status");
      setBServerConnected(res.data.isOnline);
    }
    asyncFun().catch((e) => setBServerConnected(false));
  }, 5000);


  return (
    <div className={"home"}>
      <div className={"home-banner"}>
        <div className={"sparcs-logo-wrapper"}>
          <span className={"sparcs-logo"}>SPARCS</span> Backend Seminar
        </div>
      </div>
      <div className={"link-wrapper"}>
        <div className={"link-options"}>
          <div className={"page-link"} onClick={ () => navigate("/arcive") }>
            <div className={"page-subtitle"}>Example #1</div>
            <div className={"page-title"}>Artwork Arcive Login & Gallery</div>
          </div>
          <div className={"page-link"} onClick={ () => navigate("/whatToDo") }>
            <div className={"page-subtitle"}>Example #2</div>
            <div className={"page-title"}>Middleware & Authorization</div>
          </div>
          <div className={"page-link"} onClick={ () => navigate("/cat-image") }>
            <div className={"page-subtitle"}>Example #3</div>
            <div className={"page-title"}>Serve *Cute* Image Files</div>
          </div>
          <div className={"page-link"} onClick={ () => navigate("/register") }>
            <div className={"page-subtitle"}>Example #4</div>
            <div className={"page-title"}>Registration page</div>
          </div>
        </div>
      </div>
      <div className={"server-status"}>
        <span className={"status-icon " + ( BServerConnected ? "status-connected" : "status-disconnected" )}>•</span>
        &nbsp;&nbsp;{ BServerConnected ? "Connected to API Server 🥳" : "Not Connected to API Server 😭" }
      </div>
    </div>
  )
};

export default HomePage;