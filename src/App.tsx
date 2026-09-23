import { GameScreen } from './components/GameScreen';

export default function App() {
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
