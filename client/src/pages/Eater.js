import React,{useState, useEffect} from "react";
import{GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps";
import useSwr from "swr";
import { Link } from "react-router-dom";
import "../App.css";
import mapStyles from "../mapStyles";
import Nav from "../components/Nav";
// import { Button } from "react-bootstrap";
// import { render } from "react-dom";

const fetcher = (...arg)=> fetch(...arg).then(response => response.json());

const options={
  styles: mapStyles,
  // disableDefaultUI: true,
  
}

function Map(){
  const[selectedCook,setSelectedCook] = useState(null);
  const url ="/api/cooks"
  const { data, error } = useSwr(url, fetcher );
  const cookLocation = data && !error ? data.slice(0,20) : [];
  
  const [ currentPosition, setCurrentPosition ] = useState({lat: 27.994402, lng: -81.760254});
  
	const success = position => {
		const currentPosition = {
		lat: position.coords.latitude,
		lng: position.coords.longitude
		}
		setCurrentPosition(currentPosition);
	};

	useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
	},[])

  

 return(
   <>
    <div className="row">
      <div className="" id="info">
            {cookLocation.map((card,index) =>(
              <div className="card" key={index}
              onMouseOver={() => {
                
                const currentPosition = {
                lat: card.coordinates[0].lat,
                lng: card.coordinates[0].lng
                }
                setCurrentPosition(currentPosition);
              }}  
              >

                  <div className="card-body" id="sidebar">
                      <div className="row">
                        <div className="col-xs-1">
                          <img className="img-thumbnail" src={card.src} alt={card.name}/>
                        </div>
                        <div className="col-xs-2">
                        <h5>{card.dish} by {card.name}</h5>
                        <h5>{card.address}</h5>
                        </div>
                      </div>
                    
                  </div>
                    
                </div>
            ))}
      </div>
    <div>)
          <GoogleMap
    zoom={12}
    center= {currentPosition}
    options={options}
  >

    {cookLocation.map((loc) =>(
      <Marker key={loc._id}
              position={{lat: loc.coordinates[0].lat,
                        lng: loc.coordinates[0].lng}} 
                        onMouseOver={() => {
                          setSelectedCook(loc);
                        }}  

              icon={{
                url: (loc.src),
                scaledSize: new window.google.maps.Size(30,30)
              }}    
      />
     
    ))}

    {selectedCook && (
      <InfoWindow
      position={{lat: selectedCook.coordinates[0].lat,
                 lng: selectedCook.coordinates[0].lng
                }} 
                selected={()=>{
                  setSelectedCook(null); 
                }}
                onMouseOut={()=>{
                  setSelectedCook(null); 
                }}
                onCloseClick={()=>{
                  setSelectedCook(null); 
                }}
      >
        <div>
              <h3>Dish: {selectedCook.dish}</h3>
              <h5>Name: {selectedCook.name}</h5>
              <h5>{selectedCook.address}</h5>
              <Link to={"/cooks/" + selectedCook._id}>
                      <button 
                      className="btn btn-danger"
                      >
                        Go To
                      </button>
                    </Link> 
        </div>
      </InfoWindow>
    )}

  </GoogleMap>
      </div>
    </div>
    </>
 );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default function Eater(){
  return( 

      <div style={{ width: "100vw", height: "90vh" }}>
        <Nav />

        <WrappedMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCFX4fMFqcH0z5pM2gMhvX6X9Yrk__7suE`}
        loadingElement={<div style={{ height: `105%`}} />}
        containerElement={<div style={{ height: `105%` }} />}
        mapElement={<div style={{ height: `95%` }} />}
      />
      </div>
  );
}




