/** The chrome pyramid (Uiverse loader, recoloured). */
export default function Pyramid({ scale = 0.8 }: { scale?: number }) {
  return (
    <div className="pyramid-loader" style={{ transform: `scale(${scale}) rotateX(-20deg)` }}>
      <div className="wrapper">
        <span className="side side1" />
        <span className="side side2" />
        <span className="side side3" />
        <span className="side side4" />
        <span className="shadow" />
      </div>
    </div>
  );
}
