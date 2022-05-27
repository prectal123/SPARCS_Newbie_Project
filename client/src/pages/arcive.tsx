import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import { AsyncSleep } from "../tools/sleep";
import "./css/arcive.css";

interface ArtStruct {_id: String, Author: String, Path: String, FieldName: String, Title: String, Content: String, Thumb: String, Dated: String}

const ArcivePage = (proprs: {}) => {
    const [ DoneLogin, setDoneLogin ] = React.useState<boolean>(false);
    const [ UserId, setUserId ] = React.useState<string>("");
    const [ GivenId, setGivenId ] = React.useState<string>("");
    const [ GivenPw, setGivenPw ] = React.useState<string>("");
    const [ FileReloaded, setFileReloaded ] = React.useState<boolean>(false);
    const [ SelectedFile, setSelectedFile ] = React.useState({uploadedFile: null});
    const [ ArciveListed, setArciveListed ] = React.useState<ArtStruct[]>([]);
    const [ EmptyListed, setEmptyListed ] = React.useState<ArtStruct[]>([]);
    
    const [ GivenTitle, setGivenTitle ] = React.useState<string>("");
    const [ GivenContent, setGivenContent ] = React.useState<string>("");
    const [ ToUpdate, setToUpdate ] = React.useState<string>("false");
    const [ Refresh, setRefresh ] = React.useState<boolean>(false);

    const [ AddNew, setAddNew ] = React.useState<boolean>(false);

    const InputTag  = React.useRef<any>(0);
    const InputTag2 = React.useRef<any>(0);


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
    }, [DoneLogin, GivenId, FileReloaded, Refresh]);


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

    const handleDelete = async (id: string) => {
        await axios.post(SAPIBase + "/arcive/ArciveDelete", {id: id});
        if(Refresh){ setRefresh(false);} else {setRefresh(true);}
    }

    const handleSubmit = async (e: any) => {
        //e.preventDefault();
        const formData = new FormData();
        formData.append("file", e);
        formData.append("Title", GivenTitle );
        formData.append("Content", GivenContent);
        formData.append("IsUpdate", ToUpdate);
        formData.append("Author", GivenId);
        let Data_OB = new Date();
        formData.append("Dated", `${Data_OB.getFullYear()}년 ${Data_OB.getMonth() + 1}월 ${Data_OB.getDay()}일 ${Data_OB.getHours()}:${Data_OB.getMinutes()}:${Data_OB.getSeconds()}`)
        setToUpdate("false");
        setGivenTitle("");
        setGivenContent("");
        setSelectedFile({uploadedFile: null});
        await axios.post(SAPIBase+"/arcive/uploadFile", formData, {
            headers: { 'content-type': 'multipart/form-data' },
        });
        if(Refresh){ setRefresh(false);} else {setRefresh(true);}
        setFileReloaded(false);
        setAddNew(false);
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
                <div>
                    
                    { ToUpdate != val._id? 
                    <h3>
                        {`${val.Title ?  val.Title.length > 20? val.Title.substring(0, 20) + "..." : val.Title : `${i+1}th Post`}`}
                    </h3> : 
                    <div className={"Update_title"}> <input className={"Update_title_input_box"} type={"text"} value={GivenTitle} onChange={(e) => setGivenTitle(e.target.value)}/> </div>
                    }
                    {
                        val.Thumb === "" ? <img className={"Thumbnail"} alt={"Thumbnail of ${i+1}th Post"} src={SAPIBase+`/defaultThumb/DefaultThumb.png`} height={"200px"} width={"200px"}/>: <img className={"Thumbnail"} alt={"Thumbnail of ${i+1}th Post"} src={SAPIBase+`/ArtDB/${val.Thumb}`} height={"200px"} width={"200px"}/>
                    }

                    { ToUpdate != val._id?
                    <p className={"Contents"}>{`${ val.Content ? val.Content.length > 40? val.Content.substring(0, 40) + "..." : val.Content : 'Empty Context'}`}</p> :
                       <div className={"Update_content"}> <input className={"Update_content_input_box"} type={"text"} value={GivenContent} onChange={(e) => setGivenContent(e.target.value)}/> </div>
                    } 

                    { ToUpdate === val._id? <div className={"File_Upload"}>
                    <form className={"up_form"} name="file" encType="multipart/form-data">
                        <input className={"upload_button"} type="file" onChange={handleUpload} ref={InputTag2}/>
                        <button className={"submit_button"} type="button" onClick={(e)=>{
                            const targ = InputTag2.current as HTMLInputElement;
                            if(targ.files != null) handleSubmit(targ.files[0]);
                            }}>적용</button>
                    </form>
                    </div> : <div className={"Download_button"} onClick={(e) => DownLoad(val.FieldName)}>{val.FieldName}</div>
                   }
                    
                </div>
            

                { ToUpdate != val._id?
                <p className={"Update_Delete"}><p className={"Update_button"} onClick={(e) => { setAddNew(false); setGivenTitle(`${val.Title}`); setGivenContent(`${val.Content}`); setToUpdate(`${val._id}`)}}>업데이트</p> <p className={"Split"}>|</p> <p className={'Delete_button'} onClick={(e) => handleDelete(`${val._id}`)}>삭제</p></p> :
                <div className={"Cancel_button"} onClick={(e) => {setGivenTitle(""); setGivenContent(""); setToUpdate("false")}}>취소</div>
                }
                
                <div className={"Date"}>{val.Dated}</div>
                
               </div>
           ));
        }
/*<p>파일 업로드 혹은 업데이트 내역의 적용을 확인하고 싶다면, 반드시 새로고침을 해주십시오</p>
                <div className={"Refresh_button"} onClick={(e) => Refresh? setRefresh(false):setRefresh(true)}>새로고침</div>*/
    const isLogin = () => {
        if(DoneLogin) {return (
            <div className={"Arcive"}>
                <div className={"Upper_space"}></div>
                <h1 className={"Welcome_banner"}>Welcome to {`${GivenId}`}'s Archive</h1>
                
                <br/>
                
                <div className={"Art_list"}>
                    {ArciveLoad()}
                </div>

                {ToUpdate === "false" && AddNew?
                <div className={"Art_item"}>
                    <div className={"Contents_upload"}>
                        <div className={"Input_box_1"}>
                    제목: <input type={"text"} value={GivenTitle} onChange={(e) => setGivenTitle(e.target.value)}/> </div>
                    <br/>
                    <div className={"Input_box_2"}>
                    내용: <input type={"text"} value={GivenContent} onChange={(e) => setGivenContent(e.target.value)}/> </div>
                    </div>

                <div className={"File_upload"}>
                    <form name="file" encType="multipart/form-data">
                        <input type="file" onChange={handleUpload} ref={InputTag}/>
                        <button type="button" onClick={(e)=>{
                            setToUpdate("false");
                            const targ = InputTag.current as HTMLInputElement;
                            if(targ.files != null) handleSubmit(targ.files[0]);
                            }}>업로드</button>
                            <div className={"Add_cancel_button"} onClick={(e) => {setAddNew(false);}}>취소</div>
                    </form>
                </div></div>:<div className={"Art_item_plus"} onClick={(e) => { setGivenTitle(""); setGivenContent(""); setAddNew(true); setToUpdate("false"); }}><img src={SAPIBase+`/defaultThumb/Add.png`}/></div>
                }
                
            </div>
        );} else {return (
            <div>
                <h2 className={"Login_message"}>로그인</h2>
            <div className={"Login_Box"}>
                <div className={"Part_input"}>
                    아이디 : <input type={"text"} value={GivenId} onChange = { (e) => setGivenId(e.target.value) } />
                </div>
                <br/>
                <div className={"Part_input"}>
                    비밀번호: <input type={"password"} value={GivenPw} onChange = { (e) => setGivenPw(e.target.value) } />
                </div>
                <div className={"Login_Button"} onClick={ (e) => Login() }>Login</div>
            </div>
            </div>
        );};
    }
    return (
        <div className={"arcive_home"}>
            {isLogin()}
        </div>
        
    )

}

export default ArcivePage;