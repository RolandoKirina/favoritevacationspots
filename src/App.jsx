import { useEffect, useState } from "react";
import { AVAILABLE_PLACES } from "./data";
function App() {
  const [availablePlaces,setAvailablePlaces]=useState([]);
  //TO DO, agregar una base  para almacenar los pickedplaces del user en mongo db,añadir una 
  // api sencilla con node js y express.
  const [pickedPlaces,setPickedPlaces]=useState(storedplaces);

  //paso el string de local storage a json, si no hay lugares guardados, guardo un arr vacio
  //el uso de useref me permite no renderizar de vuelta el componente
  const modal = useRef();
  const selectedPlace = useRef();
  const storedids = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
  const storedplaces = storedids.map((id) =>
    AVAILABLE_PLACES.find((place) => place.id === id)
  );

  //al cargar la primera vez, obtengo la posicion, ordeno los lugares,y seteo el arr ordenado
  useEffect(()=> {
    navigator.geolocation.getCurrentPosition((position)=>{
      const sortedplaces= sortPlacesByDistance(AVAILABLE_PLACES,
        position.coords.latitude,position.coords.longitude)
         setAvailablePlaces(sortedplaces);
    })
  })

  //el use ref tiene la propiedad current que guarda un valor aunque el componente se vuelva a renderizar
  function  handleStartRemovePlace(id){
    modal.current.open();
    selectedPlace.current=id;
  }

  function handleStopRemovePlace(){
    modal.current.close();
  }

  //tiene la funcion de modificar los lugares ya elegidos
  function handleSelectPlace(id){
    //prevpickedplaces es el valor del estado anterior
    setPickedPlaces((prevpickedplaces)=>{
      // some verifica si al menos un elemento del array cumple una condición
      //si hay un elemento en el array con el mismo id, devuelve el array sin modificacion(no permite duplicados)
      if(prevpickedplaces.some((place)=> place.id===id)){
        return prevpickedplaces;
      }

      let newplace = AVAILABLE_PLACES.find(place.id===id)
      return [newplace,...prevpickedplaces];
    })

    //recupero los datos del local storage
    const storedids= JSON.parse(localStorage.getItem('selectedPlaces'))|| [];
  
  }
}
export default App;
