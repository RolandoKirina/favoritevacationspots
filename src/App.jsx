import { useRef, useState, useEffect } from 'react';
import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';




function App() {

  
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedplaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);
  const [availablePlaces,setAvailablePlaces]=useState([]);
  //TO DO, agregar una base  para almacenar los pickedplaces del user en mongo db,añadir una 
  // api sencilla con node js y express.
  const [pickedPlaces,setPickedPlaces]=useState(storedplaces);

  //paso el string de local storage a json, si no hay lugares guardados, guardo un arr vacio
  //el uso de useref me permite no renderizar de vuelta el componente
  const modal = useRef();
  const selectedPlace = useRef();


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

  //tiene la funcion de añadir si no esta en los lugares ya elegidos
  function handleSelectPlace(id){
    //prevpickedplaces es el valor del estado anterior
    setPickedPlaces((prevpickedplaces)=>{
      // some verifica si al menos un elemento del array cumple una condición
      //si hay un elemento en el array con el mismo id, devuelve el array sin modificacion(no permite duplicados)
      if(prevpickedplaces.some((place)=> place.id===id)){
        return prevpickedplaces;
      }

      let newplace = AVAILABLE_PLACES.find((place) => place.id===id)
      return [newplace,...prevpickedplaces];
    })

    //recupero los datos del local storage
    const storedids= JSON.parse(localStorage.getItem('selectedPlaces'))|| [];

    //si no existe el id en el arreglo de id guardados en el localstorage lo agrega al localstorage.
    if (storedids.indexOf(id) === -1) {
      localStorage.setItem(
        'selectedPlaces',
        JSON.stringify([id, ...storedids])
      );
    }
  }

  function handleRemovePlace(){
    //Se utiliza filter para  eliminar el id que sea igual a selectedplace.current y devolver un arr nuevo.
    setPickedPlaces((prevpickedplaces)=>{
      prevpickedplaces.filter((place) => place.id !== selectedPlace.current)
    })
    modal.current.close();

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem(
      'selectedPlaces',
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }

   return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}
export default App;
