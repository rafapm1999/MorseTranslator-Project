/* import './Home.css'; */
import { useState } from "react"
import database from "../../db/morseCodeTranslator.json"

function Home() {
  /* Declaraciones */
  const [morseData, setMorseData] = useState("");
  const [morsePulse, setMorsePulse] = useState("");
  const [binaryPulse, setBinaryPulse] = useState("");
  const [speedValue, setSpeedValue] = useState(1000)
  let morseTranslation = "";
  let morsePulseArray = [];

  /* Funciones */

  /* Funcion de envio de información del usuario para su posterior procesado y traduccion a morse */
  const sendData = (e) => {
    if (e !== "") {
      let letterStringArray = e.split("");
      letterStringArray.forEach(letters => {
        let morseLetter = "";

        if (/[a-z]/.test(letters.toLowerCase())) {
          morseLetter = database.stringToMorse.letters[letters.toLowerCase()];
        } else if (/[0-9]/.test(letters)) {
          morseLetter = database.stringToMorse.numbers[letters];
        } else if (/[\ &'@)(:,=!.\-+"?/\/]/.test(letters)) {
          morseLetter = database.stringToMorse.signals[letters];
        } else {
          morseLetter = "ERROR";
        };

        if (morseLetter) {
          morseTranslation += morseLetter + " ";
        } else {
          morseTranslation += "| ";
        }
      });
      setMorseData(morseTranslation);
    } else if (e === "") {
      setMorseData("");
    }
  }

  /* Funcion con la que analizamos y limpiamos el morse para acabar obteniendo un array de pulsos */
  const readMorse = () => {
    if (morseData) {
      let morseString = morseData;
      let morsePulsesLetters = "";
      let morsePulseWordsArray = morseString.split(" ");
      morsePulseWordsArray.forEach(morseWord => {
        if (!morseWord.includes("ERROR")) {
          morsePulsesLetters += morseWord.trim().replace(/\s/g, "");
        }
      });
      morsePulseArray = morsePulsesLetters.split("")
      setMorsePulse(morsePulseArray)
    }
  }

  // Función para detener la ejecución durante un tiempo específico
  function speed(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  const lightTranslation = async () => {
    if (morsePulseArray.length !== 0) {
      for (const pulse of morsePulseArray) {
        if (pulse.includes(".")) {
          setBinaryPulse(".")
          await speed(speedValue); // Detener la ejecución durante x segundos
          setBinaryPulse("")
          await speed(speedValue/2); 
        } else if (pulse.includes("-")) {
          setBinaryPulse("-")
          await speed(speedValue * 2); // Detener la ejecución durante x segundos
          setBinaryPulse("")
          await speed(speedValue/2);
        } else if (pulse.includes("|")) {
          setBinaryPulse("")
          await speed(speedValue);
        }
      }
      setBinaryPulse("")
    }
  }

  const lightMode = () => {
    readMorse();
    lightTranslation();
  }

  /* Renderizado */
  return (
    <div>
      <textarea id="stringTextarea" name="stringTextarea" placeholder="Introduce el texto a traducir" cols={30} rows={30} onChange={(e) => {
        sendData(e.target.value);
      }} />
      <textarea id="morseTextarea" name="morseTextarea" cols={30} rows={30} value={morseData === "" ? "Introduce el texto a traducir" : morseData}/>
      <button onClick={() => lightMode()}>Light translate</button>
      <div>
        <input
          type="range" 
          id="speed" 
          name="speed" 
          min={20} 
          max={1000}
          value={speedValue}
          onChange={ e => setSpeedValue(e.target.value)} />
        <label htmlFor="speed">Speed</label>
        <label htmlFor="speed">{` (${speedValue} ${speedValue < 1000 ? "ms" : "seg"})`}</label>
      </div>
      <div style={{ height: "40vh", width: "5vw", border: "1px solid red", backgroundColor: binaryPulse !== "" ? "white" : "black"}}></div>
    </div>
  );
}

export default Home;
