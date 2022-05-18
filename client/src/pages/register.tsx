import React from "react";
import Header from "../components/header";
import axios from "axios";
import {SAPIBase} from "../tools/api";

const RegisterPage = () => {
    const [ GivenID, setGivenID ] = React.useState<string>("");
    const [ GivenPW, setGivenPW ] = React.useState<string>("");
    const [ DoneLogin, setDoneLogin ] = React.useState<boolean>(false);
    const [ UserID, setUserID ] = React.useState<string>("");
    const [ UserPW, setUserPW ] = React.useState<string>("");

    const AddRegistration = async () => {
        try{
            const { data } = await axios.get<boolean>( SAPIBase + `/register/searchID?userID=${ GivenID }`);
            if(data) {
                console.log("User ID already existing. Please try another one.");
                return false;
            } else {
                axios.post( SAPIBase + '/register/addAccount' , {id: GivenID, pw: GivenPW});
                console.log(`Available ID, Registration Complete. Welcome user ${GivenID}`);
                setGivenID("");
                setGivenPW("");
                return true;
            }
            }
            catch {
                axios.post( SAPIBase + '/register/addAccount' , {id: GivenID, pw: GivenPW});
                console.log(`Available ID, Registration Complete. Welcome user ${GivenID}`);
                setGivenID("");
                setGivenPW("");
                return true;
            }
    }

    const DeleteRegistration = async () => {
        try{
            const { data } = await axios.get<boolean>( SAPIBase + `/register/login?userID=${ GivenID }&userPW=${ GivenPW }`);
            if(data) {
                axios.post( SAPIBase + '/register/deleteAccount' , {id: GivenID, pw: GivenPW});
                console.log(`Account Delete Complete. GoodBye user ${GivenID}`);
                setGivenID("");
                setGivenPW("");
                return true;
            } else {
                console.log("Given ID and PW does not login. Please try again.");
                return false;
            }
        } catch (e) {

        }
    }
    

    return (
        <div className={"Login_Box"}>
                <div className={"Part_input"}>
                    ID : <input type={"text"} value={GivenID} onChange = { (e) => setGivenID(e.target.value) } />
                </div>
                <div className={"Part_input"}>
                    Password: <input type={"password"} value={GivenPW} onChange = { (e) => setGivenPW(e.target.value) } />
                </div>
                <div className={"Registration_Button"} onClick={ (e) => AddRegistration() }>Add Account!</div>
                <br/>
                <div className={"Delete_Button"} onClick={ (e) => DeleteRegistration() }>Delete Account...</div>
            </div>
    )

}

export default RegisterPage;