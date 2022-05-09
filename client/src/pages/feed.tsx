import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import Header from "../components/header";
import "./css/feed.css";

interface IAPIResponse  { _id: string, title: string, content: string, itemViewCnt: number }

const FeedPage = (props: {}) => {
  const [ LAPIResponse, setLAPIResponse ] = React.useState<IAPIResponse[]>([]);
  const [ NPostCount, setNPostCount ] = React.useState<number>(0);
  const [ SNewPostTitle, setSNewPostTitle ] = React.useState<string>("");
  const [ SNewPostContent, setSNewPostContent ] = React.useState<string>("");
  const [ SSearchItem, setSSearchItem ] = React.useState<string>("");
  const [ SModify, setSModify ] = React.useState<boolean>(false);
  const [ IDModify, setIDModify ] = React.useState<string>("");
  const [ ModificationContent, setModificationContent ] = React.useState<string>("");
  const [ ModificationTitle, setModificationTitle ] = React.useState<string>("");

  React.useEffect( () => {
    let BComponentExited = false;
    const asyncFun = async () => {
      const { data } = await axios.get<IAPIResponse[]>( SAPIBase + `/feed/getFeed?count=${ NPostCount }&search=${ SSearchItem }`);
      console.log(data);
      // const data = [ { id: 0, title: "test1", content: "Example body" }, { id: 1, title: "test2", content: "Example body" }, { id: 2, title: "test3", content: "Example body" } ].slice(0, NPostCount);
      if (BComponentExited) return;
      setLAPIResponse(data);
    };
    asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    return () => { BComponentExited = true; }
  }, [ NPostCount, SSearchItem, IDModify ]);

  const createNewPost = () => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/feed/addFeed', { title: SNewPostTitle, content: SNewPostContent } );
      setNPostCount(NPostCount + 1);
      setSNewPostTitle("");
      setSNewPostContent("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const SelectModPost = (id: string, title: string, content: string) => {
    const asyncFun = async () => {
    setSModify(true);
    setModificationContent(content);
    setModificationTitle(title);
    setIDModify(id);
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const ModifyPost = () => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/feed/modifyFeed', { idm: IDModify, titlem: ModificationTitle, contentm : ModificationContent } );
      console.log(ModificationTitle);
      setSModify(false);
      setIDModify("");
      setModificationContent("");
      setModificationTitle("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const deletePost = (id: string) => {
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      await axios.post( SAPIBase + '/feed/deleteFeed', { id: id } );
      setNPostCount(Math.max(NPostCount - 1, 0));
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const conditionalMod = () => {
    if(SModify) return (<div><p></p><div className={"feed-item-modify"}>
    Modified Title: <input type={"text"} value={ModificationTitle} onChange={(e) => setModificationTitle(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;&nbsp;
      Content: <input type={"text"} value={ModificationContent} onChange={(e) => setModificationContent(e.target.value)}/>
      <div className={"post-add-button"} onClick={(e) => ModifyPost()}>Change Post!</div>
      </div></div>); else return (<div></div>);
  }

  return (
    <div className="Feed">
      <Header/>
      <h2>Feed</h2>
      <div className={"feed-length-input"}>
        Number of posts to show: &nbsp;&nbsp;
        <input type={"number"} value={ NPostCount } id={"post-count-input"} min={0}
               onChange={ (e) => setNPostCount( parseInt(e.target.value) ) }
        />
      </div>
      <div className={"feed-length-input"}>
        Search Keyword: &nbsp;&nbsp;
        <input type={"text"} value={ SSearchItem } id={"post-search-input"}
               onChange={ (e) => setSSearchItem( e.target.value ) }
        />
      </div>
        
      <div>
        {conditionalMod()}
      </div>

      <div className={"feed-list"}>
        { 
        LAPIResponse.map( (val, i) =>
          <div key={i} className={"feed-item"}>
            <div className={"delete-item"} onClick={(e) => deletePost(`${val._id}`)}>ⓧ</div>
            <h3 className={"feed-title"}>{ val.title }</h3>
            <p className={"feed-body"}>{ val.content }</p>
            <div className={"modify-item"} onClick={(e) => SelectModPost(`${val._id}`, `${val.title}`, `${val.content}`)}>수정</div>
          </div>

        ) }
        <div className={"feed-item-add"}>
          Title: <input type={"text"} value={SNewPostTitle} onChange={(e) => setSNewPostTitle(e.target.value)}/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          Content: <input type={"text"} value={SNewPostContent} onChange={(e) => setSNewPostContent(e.target.value)}/>
          <div className={"post-add-button"} onClick={(e) => createNewPost()}>Add Post!</div>
        </div>
      </div>
    </div>
  );
}

export default FeedPage;