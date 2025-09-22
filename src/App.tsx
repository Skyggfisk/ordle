import { Header } from './components/Header';
import { Game } from './components/Game';

function App() {
  return (
    <>
      <Header />
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"> */}
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-black dark:bg-neutral-800 dark:text-white">
        <Game />
      </main>
    </>
  );
}

export default App;
