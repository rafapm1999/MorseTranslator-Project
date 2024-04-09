import "./Home.css";
import { useState } from "react";
import database from "../../db/morseCodeTranslator.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeXmark,
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
  faPause,
  faPlay,
  faStop,
  faCircleStop,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  /* Declaraciones */
  // Declaraciones de useState para el manejo de valores modificables para el correcto uso de nuestro proyecto
  const [morseData, setMorseData] = useState("");
  const [binaryPulse, setBinaryPulse] = useState("");
  const [speedValue, setSpeedValue] = useState(1000);
  const [pitchValue, setPitchValue] = useState(556);
  const [volumeValue, setVolumeValue] = useState(0.2);
  const [muteValue, setMuteValue] = useState(false);
  const [playValue, setPlayValue] = useState(false);
  const [stopValue, setStopValue] = useState(false);
  // Declaraciones de variables
  let morseTranslation = "";
  let morsePulseArray = [];
  // Declaracion para el manejo de audio
  let audioCtx = new AudioContext();
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = muteValue === true ? 0 : volumeValue;

  /* Funciones */
  // Funcion para inicializar un oscilador
  const inizialiceOsc = (pitchValue, stopValue) => {
    if (stopValue !== true) {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(pitchValue, audioCtx.currentTime);
      osc.connect(gainNode).connect(audioCtx.destination);
      return osc;
    }
  };
  /* Funcion de envio de información del usuario para su posterior procesado y traduccion a morse */
  const sendData = (e) => {
    if (e !== "") {
      let letterStringArray = e.split("");
      letterStringArray.forEach((letters) => {
        let morseLetter = "";
        if (/[a-z]/.test(letters.toLowerCase())) {
          morseLetter = database.stringToMorse.letters[letters.toLowerCase()];
        } else if (/[0-9]/.test(letters)) {
          morseLetter = database.stringToMorse.numbers[letters];
        } else if (/[ &'@)(:,=!.\-+"?/]/.test(letters)) {
          morseLetter = database.stringToMorse.signals[letters];
        } else {
          morseLetter = "ERROR";
        }
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
  };

  /* Funcion con la que analizamos y limpiamos el morse para acabar obteniendo un array de pulsos */
  const readMorse = () => {
    if (morseData) {
      let morseString = morseData;
      let morsePulsesLetters = "";
      let morsePulseWordsArray = morseString.split(" ");
      morsePulseWordsArray.forEach((morseWord) => {
        if (!morseWord.includes("ERROR")) {
          morsePulsesLetters += morseWord.trim().replace(/\s/g, "");
        }
      });
      morsePulseArray = morsePulsesLetters.split("");
    }
  };

  // Función para detener la ejecución durante un tiempo específico
  function speed(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms / 2));
  }
  // Funcion para traducir cada pulse para su procesado final, tanto sonoro como visual
  const translateEachPulse = async (pulse, pitchValue, stopValue) => {
    let oscillator = inizialiceOsc(pitchValue, stopValue);
    if (stopValue === true) {
      oscillator.stop();
      oscillator.disconnect(gainNode).disconnect(audioCtx.destination);
    } else if (pulse.includes(".")) {
      setBinaryPulse(".");
      oscillator.start();
      await speed(speedValue); // Detener la ejecución durante x segundos
      setBinaryPulse("");
      oscillator.stop();
      await speed(speedValue / 2);
    } else if (pulse.includes("-")) {
      setBinaryPulse("-");
      oscillator.start();
      await speed(speedValue * 2);
      setBinaryPulse("");
      oscillator.stop();
      await speed(speedValue / 2);
    } else if (pulse.includes("|")) {
      setBinaryPulse("");
      await speed(speedValue);
    }
  };
  // Función para verificar si existe valores para traducir y si stopValue no es true
  const translate = async () => {
    if (morsePulseArray.length !== 0 && stopValue !== true) {
      for (const pulse of morsePulseArray) {
        await translateEachPulse(pulse, pitchValue, stopValue);
      }
    }
    setPlayValue(false);
    setBinaryPulse("");
  };
  // Funcion principal que maneja la inicialización de
  const startTranslateFuntion = (stop, pitch) => {
    readMorse();
    translate(stop, pitch);
  };

  /* Renderizado */
  return (
    <div className={`${"main"}`}>
      <div
        className={`${"textareaMain"} ${binaryPulse !== "" ? "light" : "dark"}`}
      >
        <textarea
          className={`${"textareaStyle"} `}
          id="stringTextarea"
          name="stringTextarea"
          placeholder="Introduce el texto a traducir"
          cols={60}
          rows={10}
          onChange={(e) => {
            sendData(e.target.value);
          }}
        />
        <textarea
          className={`${"textareaStyle"} `}
          id="morseTextarea"
          name="morseTextarea"
          cols={60}
          rows={10}
          value={morseData === "" ? "Introduce el texto a traducir" : morseData}
        />
      </div>
      <div>
        <div className={"buttonsMain"}>
          <button
            className={"shadow-inset-center buttonStyle"}
            onClick={() => {
              if (stopValue !== true && playValue !== true) {
                startTranslateFuntion(stopValue, pitchValue);
                if (morsePulseArray.length !== 0) {
                  setPlayValue(!playValue);
                }
              }
            }}
          >
            {playValue ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </button>
          <button
            className={"shadow-inset-center buttonStyle"}
            onClick={() => {
              setStopValue(!stopValue);
              if (playValue === true) {
                setPlayValue(!playValue);
              }
            }}
          >
            {stopValue ? (
              <FontAwesomeIcon icon={faCircleStop} />
            ) : (
              <FontAwesomeIcon icon={faStop} />
            )}
          </button>
          <button
            className={"shadow-inset-center buttonStyle"}
            onClick={() => setMuteValue(!muteValue)}
          >
            {muteValue ? (
              <FontAwesomeIcon icon={faVolumeXmark} />
            ) : volumeValue >= 1 ? (
              <FontAwesomeIcon icon={faVolumeHigh} />
            ) : volumeValue >= 0.2 ? (
              <FontAwesomeIcon icon={faVolumeLow} />
            ) : (
              <FontAwesomeIcon icon={faVolumeOff} />
            )}
          </button>
        </div>
        <div className={"inputRangesMain"}>
          <div className={"inputRange"}>
            <input
              className={"rangeBar"}
              type="range"
              id="speed"
              name="speed"
              min={20}
              max={1500}
              value={speedValue}
              onChange={(e) => setSpeedValue(e.target.value)}
            />
            <label htmlFor="speed">Speed</label>
            <label htmlFor="speed">{` (${speedValue} ${
              speedValue < 1000 ? "ms" : "seg"
            })`}</label>
          </div>
          <div className={"inputRange"}>
            <input
              className={"rangeBar"}
              type="range"
              id="pitch"
              name="pitch"
              min={100}
              max={1000}
              value={pitchValue}
              onChange={(e) => setPitchValue(e.target.value)}
            />
            <label htmlFor="pitch">Pitch</label>
            <label htmlFor="pitch">{` (${pitchValue} Hz)`}</label>
          </div>
          <div className={"inputRange"}>
            <input
              className={"rangeBarVolume"}
              type="range"
              id="volume"
              name="volume"
              min={0}
              max={2}
              step={0.01}
              value={muteValue === true ? 0 : volumeValue}
              onChange={(e) => setVolumeValue(e.target.value)}
            />
            <label htmlFor="volume">Volume</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
