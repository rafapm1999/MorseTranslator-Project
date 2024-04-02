/* import './Home.css'; */
import { useState } from "react"
import database from "../../db/morseCodeTranslator.json"

function Home() {
  /* Declaraciones */
  const [morseData, setMorseData] = useState("");
  let array = [];

  /* Funciones */
  const sendData = (e) => {
    if (e) {
      let morseTranslation = ("")
      let words = e.split("");

      words.forEach(letters => {
        array.push(letters.split(""));
      });
      array.forEach(word => {
        word.forEach(letter => {
          let morseLetter = "";

          if (/[a-z]/.test(letter.toLowerCase())) {
            morseLetter = database.stringToMorse.letters[letter.toLowerCase()];
          } else if (/[0-9]/.test(letter)) {
            morseLetter = database.stringToMorse.numbers[letter];
          } else if (/[\n&\'@)(:,=!.\-+\"?\/\ ]/.test(letter)) {
            morseLetter = database.stringToMorse.signals[letter];
          } else {
            morseLetter = "ERROR";
          };

          if (morseLetter) {
            morseTranslation += morseLetter + " ";
          } else {
            if (morseLetter === "\r") {
              morseTranslation += "";
            }
            morseTranslation += " | ";
          }
        });
      });
      setMorseData(morseTranslation);
    } else {
      setMorseData("")
    }
  }

  /* Renderizado */
  return (
    <div>
      <textarea placeholder="Introduce el texto a traducir" cols={50} rows={50} onChange={(e) => {
        sendData(e.target.value)
      }} />
      <textarea cols={50} rows={50} value={morseData === "" ? "Introduce el texto a traducir" : morseData} />
    </div>
  );
}

export default Home;
