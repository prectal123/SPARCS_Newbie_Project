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
    const [ SelectedFile, setSelectedFile ] = React.useState({uploadedFile: null});
    const InputTag  = React.useRef<any>(0);

    const Login = async () => {
        try{
        const { data } = await axios.get<boolean>( SAPIBase + `/arcive/login?userID=${ GivenId }&userPW=${ GivenPw }`);
        if(data) {
            console.log(`Login complete. user ${GivenId}`);
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

    const handleSubmit = async (e: any) => {
        //e.preventDefault();
        const formData = new FormData();
        formData.append("file", e);
        console.log(e);
        await axios.post(SAPIBase+"/arcive/uploadFile", formData, {
            headers: { 'content-type': 'multipart/form-data' },
        });
    }

    const handleUpload = (e: any) => {
        e.preventDefault();
        const file = e.current.files[0];
        setSelectedFile({uploadedFile: file});
        console.log(file);
    }

    const isLogin = () => {
        if(DoneLogin) {return (
            <div>
                <div className={"File_Upload"}>
                    <form name="file" encType="multipart/form-data">
                        <input type="file" onChange={handleUpload} ref={InputTag}/>
                        <button type="button" onClick={(e)=>{
                            const targ = InputTag.current as HTMLInputElement;
                            console.log(targ);
                            if(targ.files != null) handleSubmit(targ.files[0]); else console.log("I hate Null");
                            }}>Upload</button>
                    </form>
                </div>
            </div>
        );} else {return (
            <div>
            <div className={"Login_Box"}>
                <div className={"Part_input"}>
                    ID : <input type={"text"} value={GivenId} onChange = { (e) => setGivenId(e.target.value) } />
                </div>
                <div className={"Part_input"}>
                    Password: <input type={"password"} value={GivenPw} onChange = { (e) => setGivenPw(e.target.value) } />
                </div>
                <div className={"Login_Button"} onClick={ (e) => Login() }>Login</div>
            </div>
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