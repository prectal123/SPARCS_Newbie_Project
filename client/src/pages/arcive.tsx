import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import Header from "../components/header";
import App from "../App";
//import "./css/feed.css";

interface ArtStruct {_id: String, Author: String, Path: String, FieldName: String, Title: String, Content: String}

const ArcivePage = (proprs: {}) => {
    const [ DoneLogin, setDoneLogin ] = React.useState<boolean>(false);
    const [ UserId, setUserId ] = React.useState<string>("");
    const [ GivenId, setGivenId ] = React.useState<string>("");
    const [ GivenPw, setGivenPw ] = React.useState<string>("");
    const [ FileReloaded, setFileReloaded ] = React.useState<boolean>(false);
    const [ SelectedFile, setSelectedFile ] = React.useState({uploadedFile: null});
    const [ ArciveListed, setArciveListed ] = React.useState<ArtStruct[]>([]);
    const [ EmptyListed, setEmptyListed ] = React.useState<ArtStruct[]>([]);
    const InputTag  = React.useRef<any>(0);

    React.useEffect( () => {
    let BComponentExicted = false;
    const load = async () => {
        if(DoneLogin){
            const { data } = await axios.get<ArtStruct[]>(SAPIBase + `/arcive/ArciveLoad/?author=${GivenId}`);
            setArciveListed(data);
        }
        if(BComponentExicted) return;
    };
    load();
    return () => {BComponentExicted = true;};
    }, [DoneLogin, GivenId, FileReloaded]);


    const Login = async () => {
        console.log("Login try");
        try{
        const { data } = await axios.get<boolean>( SAPIBase + `/arcive/login?userID=${ GivenId }&userPW=${ GivenPw }`);
        console.log(data);
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
        setFileReloaded(false);
        await axios.post(SAPIBase+"/arcive/uploadFile", formData, {
            headers: { 'content-type': 'multipart/form-data' },
        });
    }

    const handleUpload = async (e: any) => {
        e.preventDefault();
        setFileReloaded(true);
        const file = e.current.files[0];
        setSelectedFile({uploadedFile: file});
        console.log(file);
    }

    const DownLoad = async (name: String) => {
        const res = await axios({url: SAPIBase+`/arcive/Download?link=${name}`, method: 'GET', responseType: 'blob',}).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
        return;
    }

    const ArciveLoad = () => {
        if(ArciveListed === null) return (<div></div>);
            else return (ArciveListed.map( (val, i) => 
               <div key={i} className={"Art_item"}>
                
                <br/><div className={"doen_load"} onClick={(e) => DownLoad(val.FieldName)}>{val.FieldName} : 파일 다운</div>

               </div>
           ));
        }

    const isLogin = () => {
        if(DoneLogin) {return (
            <div>
                <div className={"File_Upload"}>
                    <form name="file" encType="multipart/form-data">
                        <input type="file" onChange={handleUpload} ref={InputTag}/>
                        <button type="button" onClick={(e)=>{
                            const targ = InputTag.current as HTMLInputElement;
                            if(targ.files != null) handleSubmit(targ.files[0]);
                            }}>Upload</button>
                    </form>
                </div>
                <div>
                    {ArciveLoad()}
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