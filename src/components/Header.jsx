export default function Header({ onHome }) {
  return (
    <header className="site-header">
      <button className="brand-button" type="button" onClick={onHome}>
        <span className="brand-mark" aria-hidden="true" />
        <span>
          <span className="brand-title">Night Lantern</span>
          <span className="brand-subtitle">Gentle stories for sleep</span>
        </span>
      </button>
    </header>
  );
}
