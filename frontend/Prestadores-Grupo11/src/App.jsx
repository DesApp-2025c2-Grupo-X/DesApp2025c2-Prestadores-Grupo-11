/*import React from "react";
import HeaderHome from "./components/HeaderHome";

function App() {
  return (
    <div>
      {/* Header */ /*}
      <HeaderHome />

      {/* Contenido de prueba *//*}
      <main className="container mt-5">
        <h1>Bienvenido a Medicina Integral</h1>
        <p>
          Aquí irá el contenido de tu sitio. Podés empezar a armar las secciones
          "Quiénes somos", "Nuestros Sanatorios", "Nuestros Planes" y
          "Servicios".
        </p>
      </main>
    </div>
  );
}

export default App;*/
import React from "react";
import HeaderHome from "./components/HeaderHome";
import HeaderLogin from "./components/HeaderLogin";

function App() {
  return (
    <div>
      {/* Header principal */}
      <HeaderHome />

      {/* Un poco de espacio */}
      <div style={{ margin: "40px 0" }}></div>

      {/* Header de login */}
      <HeaderLogin />

      {/* Contenido de prueba */}
      <main className="container mt-5">
        <h1>Bienvenido a Medicina Integral</h1>
        <p>
          Aquí podés ver los dos headers en acción. Redimensioná la ventana para 
          probar el menú hamburguesa.
        </p>
      </main>
    </div>
  );
}

export default App;
