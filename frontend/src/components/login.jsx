import {Cancel, Room} from "@material-ui/icons";
import axios from "axios";
import { useState,useRef } from "react";
import "./login.css";
export default function Login({setshowLogin,myStorage,setCurrentUser}) {
    const [failure, setFailure] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const user={
            username:nameRef.current.value,
            password:passwordRef.current.value,
        }

try {
    const res=await axios.post("/users/login",user); 
    console.log(res.data.username)
    myStorage.setItem("user",res.data.username)
    setCurrentUser(res.data.username)
    setFailure(false)
    setshowLogin(false)
} catch (error) {
    setFailure(true)
}

    }
    return (
        <div className="loginContainer">
            <div className="logo">
                <Room/>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={nameRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="loginbtn">Login</button>
 {failure &&  <span className="failure">Something went wrong :(</span>}
           </form>
           <Cancel className="loginCancel" onClick={()=>setshowLogin(false)}/>
        </div>
    )
}
