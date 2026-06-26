export default function calendario() {
  return (
    <div className="principal-calendario">
      <div className="caja-calendario">
        <iframe
          src="/calendario_2026.pdf"
          title="Calendario"
          className="calendario-iframe"
        />
      </div>
    </div>
  );
}