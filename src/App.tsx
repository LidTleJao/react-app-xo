import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import TTTPage from "./page/Tic-tac-toe/tic-tac-toe";
import TTTAIPage from "./page/Tic-tac-toe-Ai/tic-tac-toe-ai";
import HistoryPage from "./page/History/History";
import HistoryAiPage from "./page/HistoryAi/HistoryAi";

function App() {
  const routers = createBrowserRouter([
    { path: "/", element: <TTTPage/> },
    { path: "/TicTacToeAiPage", element: <TTTAIPage/> },
    { path: "/HistoryPlayerPage/:id", element: <HistoryPage/> },
    { path: `/HistoryAiPage/:id`, element: <HistoryAiPage/> },
  ]);

  return (
    <>
    <RouterProvider router={routers} />
    </>
  );
}

export default App;
