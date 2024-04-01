/* import './Home.css'; */
import { useState } from "react"

function Home() {
  /* Declaraciones */
  const [userData, setUserData] = useState([]);
  const [morseData, setMorseData] = useState();
  let userStringArray = [];
  let translateString = "";

  /* Funciones */
  const translateFunction = () => {
    setMorseData(userData.split(' '))
   /*  userStringArray = userData.split('');
    translateString = String(userStringArray);
    console.log(translateString); */
  }

  /* Renderizado */
  return (
    <div>
      <textarea cols={50} rows={50} onChange={(e) => {
        setUserData(e.target.value);
      }} />
      <button onClick={translateFunction}>Translate</button>
      <textarea cols={50} rows={50} value={userData.split(' ')} />

    </div>
  );
}

export default Home;
