import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import Header from "../components/header";

interface feedInter  { _id: string, Author: string, Title: string, Content: string, Arcive: string }
interface artInter { _id: String, Author: String, Path: String, FieldName: String, Title: String, Content: String, Thumb: String }

const whatToDoPage = (props: {}) => {
    
    return (<div></div>);
}

export default whatToDoPage;