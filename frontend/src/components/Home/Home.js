/* import './Home.css'; */
import { useState } from "react"
import database from "../../db/morseCodeTranslator.json"

function Home() {
  /* Declaraciones */
  const [morseData, setMorseData] = useState("");
  const [morsePulse, setMorsePulse] = useState("");
  const [binaryPulse, setBinaryPulse] = useState(false);
  let morseTranslation = "";
  let morsePulseArray = [];

  /* Funciones */

  /* Funcion de envio de información del usuario para su posterior procesado y traduccion a morse */
  const sendData = (e) => {
    if (e) {
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
    } else {
      setMorseData("");
    }
  }
  /* Funcion con la que analizamos y limpiamos el morse para acabar obteniendo un array de pulsos */
  const readMorse = () => {
    if (morseData !== "") {
      let morseString = morseData;
      let morsePulsesLetters = "";
      let morsePulseWordsArray = morseString.split(" | ");
      console.log(morsePulseWordsArray);
      morsePulseWordsArray.forEach(morseWord => {
        console.log(morseWord);
        if (!morseWord.includes("ERROR")) {
          morsePulsesLetters += morseWord.trim().replace(/\s/g, "");
        }
      });
      morsePulseArray = morsePulsesLetters.split("")
      setMorsePulse(morsePulseArray)
    }
  }

  const lightTranslation = () => {
    if (morsePulse !== "") {
      morsePulse.forEach(pulse => {
        console.log(pulse);
        setTimeout(() => {
          if (pulse === ".") {

            setBinaryPulse(false)

          } else if (pulse === "-") {

            setBinaryPulse(true)

          }
        }, 1);

      })
    }

  }
  async function lightMode() {
    let read = await readMorse();
    let translate = await lightTranslation();
  }

  /* Renderizado */
  return (
    <div>
      <textarea placeholder="Introduce el texto a traducir" cols={50} rows={50} onChange={(e) => {
        sendData(e.target.value)
      }} />
      <textarea cols={50} rows={50} value={morseData === "" ? "Introduce el texto a traducir" : morseData} />
      <button onClick={lightMode}>Light translate</button>
      <div style={{ height: "40vh", width: "5vw", backgroundColor: binaryPulse === true ? "white" : "black" }}></div>
    </div>
  );
}

export default Home;
