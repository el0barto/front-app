import Departamentos from "./components/Departamentos/Departamentos";
import Puestos from "./components/Puestos/Puestos";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      {/* Elementos flotantes decorativos */}
      <div className="floating-element floating-element-1"></div>
      <div className="floating-element floating-element-2"></div>
      <div className="floating-element floating-element-3"></div>

      {/* Contenido principal */}
      <main className="app-content">
        <Departamentos />
        <Puestos />
      </main>
    </div>
  );
}