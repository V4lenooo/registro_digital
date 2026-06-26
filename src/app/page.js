export default function home(){
  return (
    <div className="contenedor-principal">
      <h2 className="titulo-principal">
        Panel Principal
      </h2>
      
      <p className="descripcion-principal">
        Bienvenido.
      </p>

      {/* tarjetas de contenido */}
      <div className="grilla">
        <a href="https://owncloud.fi.mdp.edu.ar/index.php/s/NeycQHaro0SXsmM"
          target="_blank"
          className="nodo">
          <h3 className="titulo-nodo">Fechas de finales</h3>
          <p className="descripcion-nodo">Horarios oficiales</p>
        </a>
        
        <a href="https://owncloud.fi.mdp.edu.ar/index.php/s/etD7TaRryJYPRAd"
          target="_blank" 
          className="nodo">
          <h3 className="titulo-nodo">Horarios de cursada</h3>
          <p className="descripcion-nodo">Revisá tus cursadas.</p>
        </a>
        <div className="nodo">
          <h3 className="titulo-nodo">Ultimas noticias</h3>
          <p className="descripcion-nodo">Noticias oficiales unmdp.</p>
        </div>
      </div>
    </div>
  );
}

