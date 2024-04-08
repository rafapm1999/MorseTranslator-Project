import './Home.css'; 
import { useState} from "react";
import database from "../../db/morseCodeTranslator.json";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faVolumeXmark, faVolumeHigh, faVolumeLow, faVolumeOff, faPause, faPlay, faStop} from "@fortawesome/free-solid-svg-icons"


function Home() {
  /* Declaraciones */
  const [morseData, setMorseData] = useState("");
  const [binaryPulse, setBinaryPulse] = useState("");
  const [speedValue, setSpeedValue] = useState(1000);
  const [pitchValue, setPitchValue] = useState(556);
  const [volumeValue, setVolumeValue] = useState(0.2);
  const [muteValue, setMuteValue] = useState(false);
  const [playValue, setPlayValue] = useState(false);
  const [stopValue, setStopValue] = useState(false);
  let morseTranslation = "";
  let morsePulseArray = [];
  let audioCtx = new AudioContext();
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = muteValue === true ? 0 : volumeValue;
  console.log(muteValue);
  /* Funciones */

  /* Funcion de envio de información del usuario para su posterior procesado y traduccion a morse */
  const inizialiceOsc = (pitchValue, stopValue) => {
    if (stopValue) {
      console.log("Stop");
    } else {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(pitchValue, audioCtx.currentTime)
      osc.connect(gainNode).connect(audioCtx.destination);
      return osc;
    }
    
  }
 
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
      morsePulseArray = morsePulsesLetters.split("");
    }
  }

  // Función para detener la ejecución durante un tiempo específico
  function speed(ms) {
    return new Promise(resolve => setTimeout(resolve, ms/2));
  }

  const translateEachPulse = async (pulse, pitchValue, stopValue) => {
    let oscillator = inizialiceOsc(pitchValue, stopValue);
        if (stopValue) {
          oscillator.stop();
          oscillator.disconnect(gainNode).disconnect(audioCtx.destination);
        } else if (pulse.includes(".")) {
          setBinaryPulse(".");
          oscillator.start();
          await speed(speedValue); // Detener la ejecución durante x segundos
          setBinaryPulse("");
          oscillator.stop();
          await speed(speedValue/2); 
        } else if (pulse.includes("-")) {
          setBinaryPulse("-");
          oscillator.start();
          await speed(speedValue * 2);
          setBinaryPulse("");
          oscillator.stop();
          await speed(speedValue/2);
        } else if (pulse.includes("|")) {
          setBinaryPulse("");
          await speed(speedValue);
        } 
  }

  const lightTranslation = async() => {
    if (morsePulseArray.length !== 0 && !stopValue) {
      for (const pulse of morsePulseArray) {
        await translateEachPulse(pulse, pitchValue, stopValue)
      }
      }
      setBinaryPulse("")
  }

  const lightMode = (stop, pitch) => {
    readMorse();
    lightTranslation(stop, pitch);
  }


  /* Renderizado */
  return (
    <div className={`${"main"}`}>
      <div className={`${"textareaMain"} ${binaryPulse !== "" ? "light" : "dark"}`}>
        <textarea className={`${"textareaStyle"} `} id="stringTextarea" name="stringTextarea" placeholder="Introduce el texto a traducir" cols={60} rows={10}  onChange={(e) => {
          sendData(e.target.value);
        }} />
        <textarea className={`${"textareaStyle"} `} id="morseTextarea" name="morseTextarea" cols={60} rows={10} value={morseData === "" ? "Introduce el texto a traducir" : morseData}/>
      </div>
      <div>
        <div className={"buttonsMain"}>
          <button 
          className={"shadow-inset-center buttonStyle"} 
          onClick={() => {
            lightMode(stopValue, pitchValue);
            if (morsePulseArray.length !== 0) {
              setPlayValue(!playValue); 
            }
            }}>
            {
              playValue ? <FontAwesomeIcon icon={faPause}/> : <FontAwesomeIcon icon={faPlay}/>
            }
          </button>
          <button 
          className={"shadow-inset-center buttonStyle"} 
          onClick={() => {setStopValue(!stopValue)}}>
            {
              stopValue ? <FontAwesomeIcon icon={faStop}/> : <FontAwesomeIcon icon={faStop}/>
            }
          </button>
          <button 
          className={"shadow-inset-center buttonStyle"} 
          onClick={() => setMuteValue(!muteValue)}>
          {
          muteValue ? <FontAwesomeIcon icon={faVolumeXmark} /> : 
          (volumeValue >= 1.5 ? <FontAwesomeIcon icon={faVolumeHigh} /> : 
          volumeValue >= 0.5 ? <FontAwesomeIcon icon={faVolumeLow} /> : <FontAwesomeIcon icon={faVolumeOff}/>) 
          }
          </button>
        </div>
        <div className={"inputRangesMain"}>
          <div className={"inputRange"}>
            <input
              type="range"
              id="speed"
              name="speed"
              min={20}
              max={1500}
              value={speedValue}
              onChange={ e => setSpeedValue(e.target.value)} />
            <label htmlFor="speed">Speed</label>
            <label htmlFor="speed">{` (${speedValue} ${speedValue < 1000 ? "ms" : "seg"})`}</label>
          </div>
          <div className={"inputRange"}>
            <input
              type="range"
              id="pitch"
              name="pitch"
              min={100}
              max={1000}
              value={pitchValue}
              onChange={ e => setPitchValue(e.target.value)} />
            <label htmlFor="pitch">Pitch</label>
            <label htmlFor="pitch">{` (${pitchValue} Hz)`}</label>
          </div>
          <div className={"inputRange"}>
            <input
              type="range"
              id="volume"
              name="volume"
              min={0}
              max={2}
              step={0.01}
              value={muteValue === true ? 0 : volumeValue}
              onChange={ e => setVolumeValue(e.target.value)} />
            <label htmlFor="volume">Volume</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
