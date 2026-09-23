import { GameScreen } from './components/GameScreen';
import { IconGallery } from './components/IconGallery';

export default function App() {
  const isGallery = new URLSearchParams(window.location.search).has('gallery');

  if (isGallery) {
    return <IconGallery />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-header__eyebrow">EL TALLER</span>
        <h1 className="app-header__title">Saca la ficha</h1>
      </header>
      <GameScreen />
    </div>
  );
}
