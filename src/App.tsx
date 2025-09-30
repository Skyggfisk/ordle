import { Header } from './components/header/Header';
import { Game } from './components/game/Game';

function App() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white">
        <Header />
        <div className="h-10"></div>
        <Game />
      </main>
    </>
  );
}

export default App;
