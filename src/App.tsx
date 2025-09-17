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
      
      {/* Header principal */}
      <header className="app-header">
        <h1 className="app-title">
          Gestión de Empresa
        </h1>
        <p className="app-subtitle">
          Sistema integral de administración de departamentos y puestos de trabajo
        </p>
      </header>

      {/* Contenido principal */}
      <main className="app-content">
        <Departamentos />
        <Puestos />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Sistema de Gestión Empresarial © 2025</p>
      </footer>
    </div>
  );
}