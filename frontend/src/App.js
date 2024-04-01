import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";

function App() {
return(
  /* Creamos las rutas del proyecto haciendo uso de la libreria react-router-dom, la cual nos da acceso a generar rutas
  predefinidas a nuestros componentes */
  <Routes>
    <Route path="/" element={<Home/>}/>
  </Routes>
);
}

export default App;
