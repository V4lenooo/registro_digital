import './globals.css';
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      
      <body className="columna-caja">
        {/* columna izquierda */}
        <aside className="columna-estilo">
          {/* logo */}
          <Link href="/" className="nombre-caja">

            <h1 className="nombre-principal">
              REGISTRO_DIGITAL
            </h1>
          </Link>

          {/* navegación */}
          <nav className="navegador">

            <Link href="/" className="cartel-columna">
              Inicio
            </Link>

            <Link href="/materias" className="cartel-columna">
              Materias
            </Link>

            <Link href="/calendario" className="cartel-columna">
              Calendario
            </Link>

          </nav>

        </aside>
        {/* pantalla principal */}
        <main className="principal">
          {children}
        </main>

      </body>

    </html>

  );

}