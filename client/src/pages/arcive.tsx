import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import Header from "../components/header";
//import "./css/feed.css";

const ArcivePage = (proprs: {}) => {
    const [ DoneLogin, setDoneLogin ] = React.useState<boolean>(false);
    const [ UserId, setUserID ] = React.useState<string>("");
    const [ GivenId, setGivenId ] = React.useState<string>("");
    const [ GivenPw, setGivenPw ] = React.useState<string>("");


    const Login = async () => {
        try{
        const { data } = await axios.get<boolean>( SAPIBase + `/arcive/login?userID=${ GivenId }&userPW=${ GivenPw }`);
        if(data) {
            setUserID(GivenId);
            console.log(`Login complete. user ${UserId}`);
            setDoneLogin(true);
            return true;
        } else {
            console.log("Login failed.");
            return false;
        }
        }
        catch {
            console.log("Login Failed. Please Try Again.");
        }
    }

    const isLogin = () => {
        if(DoneLogin) {return (
            <div>
                Wow Login
            </div>
        );} else {return (
            <div className={"Login_Box"}>
                <div className={"Part_input"}>
                    ID : <input type={"text"} value={GivenId} onChange = { (e) => setGivenId(e.target.value) } />
                </div>
                <div className={"Part_input"}>
                    Password: <input type={"password"} value={GivenPw} onChange = { (e) => setGivenPw(e.target.value) } />
                </div>
                <div className={"Login_Button"} onClick={ (e) => Login() }>Login</div>
            </div>
        );};
    }
    return (
        <div>
            {isLogin()}
        </div>
    )

}

export default ArcivePage;