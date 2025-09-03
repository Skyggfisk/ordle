import { TopBar } from './components/TopBar';
import { ShowGameBoard } from './components/game';

function App() {
  return (
    <>
      <TopBar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <ShowGameBoard />
      </main>
    </>
  );
}

export default App;
