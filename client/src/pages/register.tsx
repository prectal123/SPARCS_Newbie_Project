import React from "react";
import axios from "axios";
import {SAPIBase} from "../tools/api";

const RegisterPage = () => {
    const [ GivenID, setGivenID ] = React.useState<string>("");
    const [ GivenPW, setGivenPW ] = React.useState<string>("");

    const AddRegistration = async () => {
        try{
            const { data } = await axios.get<boolean>( SAPIBase + `/register/searchID?userID=${ GivenID }`);
            if(data) {
                window.alert(`User ID already existing. Please try another one.`);
                console.log("User ID already existing. Please try another one.");
                return false;
            } else {
                if(GivenID === ""){ console.log("Please Enter ID"); return false;}
                else{
                axios.post( SAPIBase + '/register/addAccount' , {id: GivenID, pw: GivenPW});
                window.alert(`Available ID, Registration Complete. Welcome user ${GivenID}`);
                console.log(`Available ID, Registration Complete. Welcome user ${GivenID}`);
                setGivenID("");
                setGivenPW("");
                return true;
                }
            }
            }
            catch {
                axios.post( SAPIBase + '/register/addAccount' , {id: GivenID, pw: GivenPW});
                window.alert(`Available ID, Registration Complete. Welcome user ${GivenID}`);
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
                window.alert(`Account Delete Complete. GoodBye user ${GivenID}`);
                console.log(`Account Delete Complete. GoodBye user ${GivenID}`);
                setGivenID("");
                setGivenPW("");
                return true;
            } else {
                window.alert(`Given ID and PW does not login. Please try again.`);
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