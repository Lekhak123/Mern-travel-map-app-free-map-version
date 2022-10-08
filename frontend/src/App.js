import {useEffect, useState,useRef} from 'react';
import Map, {NavigationControl, Marker, Popup} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import "./App.css";
import {Room, Stars} from "@material-ui/icons";
import axios from "axios";
import React from 'react';
import TimeAgo from 'react-timeago'
import Register from './components/register.jsx';
import Login from './components/login.jsx';
function App() {
    const myStorage = window.localStorage;
    
    const [pins,
        setPins] = useState();
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDescription] = useState(null);
    const [rating, setRating] = useState(1);
    const [showRegister, setshowRegister] = useState(false)
    const [showLogin, setshowLogin] = useState(false)
const [currentUser,setCurrentUser] =useState(myStorage.getItem("user"))

    useEffect(() => {
        const getPins = async() => {
            try {
                const res = await axios.get("/pins");
                setPins(res.data);

            } catch (error) {
                console.log(error)
            };
        };
        getPins();

    }, [])

    const handleMarkerClick= (id)=>{
        setCurrentPlaceId(id)

    }
    const handleAddClick = (e)=>{
     
        const {lat }=e.lngLat;
        const long = e.lngLat.lng
        setNewPlace({
            lat,long,
        });
    }

    const handleSubmit= async(e)=>{
        e.preventDefault();
        const newPin = {
            username:currentUser,
            title,
            desc,
            rating,
            lat:newPlace.lat,
            long:newPlace.long,
        }
        try {
            const res = await axios.post("/pins",newPin);
            setPins([...pins,res.data]);
            setNewPlace(null);
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogout =()=>{
        myStorage.removeItem("user");
        setCurrentUser(null)
    }



    return (
        <div className="App">

            <Map
            
             onDblClick={handleAddClick}
                mapLib={maplibregl}
                initialViewState={{
                longitude: 2,
                latitude: 48,
                zoom: 4
               
            }}
                style={{
                width: "100%",
                height: " calc(100vh - 77px)"
            }}
                mapStyle={`https://api.maptiler.com/maps/basic-v2/style.json?key=${process.env.REACT_APP_MAPTILER_API_KEY}`}>

                {pins && pins.map(p => ( 
                <> 
                <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
                            <Room style={{color: p.username===currentUser?"tomato":"slateblue",cursor:"pointer"}}
                            onClick={()=>handleMarkerClick(p._id)}
                            />

                        </Marker>
                    {p._id===currentPlaceId && (
                         <Popup 
                         closeButton={true}
                         closeOnClick={false}
                         onClose={()=>setCurrentPlaceId(null)}
                         longitude = {
                            p.long
                        }
                        latitude = {
                            p.lat
                        }
                        anchor = "bottom" > <div className='card'>
                            <label>Place</label>
                            <h4 className=  "place">{p.title}</h4>
                            <label>Review</label>
                            <p className='review'>{p.desc}</p>
                            <label>Rating</label>
                            <div className='stars'>
                                {Array(p?.rating).fill(<Stars className='star'/>
                                )}  

                            </div>

                            <label>Information</label>
                            <span className='username'>Created by 
                                <b> {p.username}</b>
                            </span>
                            <span className='date'><TimeAgo date={p.createdAt} /> </span>
                        </div> 
                        </Popup>
                    )
                    }                 
      </>
                    
                  
      ))}
{newPlace &&(

<Popup 
                         closeButton={true}
                         closeOnClick={false}
                         
                         longitude = {
                            newPlace.long
                        }
                        latitude = {
                            newPlace.lat
                        }
                    anchor = "bottom" 
                     onClose={()=>setNewPlace(null)}
                    >
                   <div>
                    <form onSubmit={handleSubmit}>
                        <label>Title</label>
                        <input required placeholder='Enter a Title' onChange={(e)=>setTitle(e.target.value)}/>
                        <label>Review</label>
                        <textarea required placeholder='Say something about this place' onChange={(e)=>setDescription(e.target.value)}/>
                        <label>Rating</label>
                        <select onChange={(e)=>setRating(e.target.value)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>

                        </select>
                        <button className='submitButton' type='submit'>Add Pin</button>
                    </form>
                    
                    </div>    
                    </Popup>
                    )}
                    {currentUser?(<button className='button logout' onClick={handleLogout}>Log out</button>):(<div className='buttons'>
                   <button className='button login' onClick={()=>setshowLogin(true)}>Login</button>
                   <button className='register' onClick={()=>setshowRegister(true)}>Register</button> 
                   </div>)}
                    {showRegister &&
                   <Register onClick={()=>{setshowLogin(false)}} setshowRegister={setshowRegister} /> }
                   {showLogin &&
                   <Login onClick={()=>{setshowRegister(false)}} setshowLogin={setshowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/> }
                <NavigationControl position="top-left"/>
            
            </Map>
             
        </div>
    );
}

export default App;