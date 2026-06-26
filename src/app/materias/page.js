import Link from "next/link";
export default function materias(){
    return(
       <div className="contenedor-principal">
      <h2 className="titulo-principal">
        Materias
      </h2>
      
      <p className="descripcion-principal">
        Acá estan la mayoria de las materias entre el primer y tercer año de varias carreras
      </p>

      {/*  tarjetas de contenido */}
      <div className="grilla">
        <Link href="Analisis Matematico I" className="nodo">
          <h3 className="titulo-nodo">Analisis Matematico I/A</h3>
          <p className="descripcion-nodo">Derivadas e integrales indefinidas.</p>
        </Link>
        
        <Link href="Analisis Matematico II" className="nodo">
          <h3 className="titulo-nodo">Analisis Matematico II/B</h3>
          <p className="descripcion-nodo">Integrales definidas y Ecuaciones diferenciales.</p>
        </Link>
        
        <Link href="/Analisis Matematico III" className="nodo">
          <h3 className="titulo-nodo">Analisis Matematico III/C</h3>
          <p className="descripcion-nodo">Integrales triples.</p>
        </Link>
      </div>
    </div> 
    );
}