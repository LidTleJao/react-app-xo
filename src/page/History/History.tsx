import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "D:/AllFileWork/react-app-xo/src/firebaseconfig/firebase.ts"; // Import Firebase config
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods
import SquarePage from "../Square/Square";

function generateWinningCombos(size: number): number[][] {
  const combos: number[][] = [];
  // Your existing winning combos code
  return combos;
}

function HistoryPage() {
  const { id } = useParams(); // Get the game ID from the URL
  const [size, setSize] = useState(3);
  const [gameState, setGameState] = useState(Array(size * size).fill(""));
  const [winningCombos, setWinningCombos] = useState(generateWinningCombos(size));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameData = async () => {
      if (id) {
        const gameDoc = doc(db, "history-tictactoe-game", id);
        const docSnap = await getDoc(gameDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSize(data.size || 3);
          setGameState(data.board || Array(size * size).fill(""));
          setWinningCombos(generateWinningCombos(data.size || 3));
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchGameData();
  }, [id]);

  const handleCellClick = (index: number) => {
    // Handle cell click if needed
  };

  const navigateToTTTPage = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full p-8 text-slate-1000 bg-gradient-to-r from-teal-600 to-blue-800">
      <h1 className="text-center text-5xl mb-4 font-display text-white">Tic Tac Toe Game</h1>
      <div className="mb-4">
        <Button
          sx={{
            color: "white",
            "&:hover": { background: "black" },
            background: "black",
          }}
          variant="contained"
          onClick={navigateToTTTPage}
        >
          Back to Main Page
        </Button>
      </div>
      <div
        className="grid gap-2 mx-auto"
        style={{
          width: `min(90vw, 90vh)`,
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {gameState.map((player, index) => (
          <SquarePage
            key={index}
            onClick={() => handleCellClick(index)}
            index={index}
            player={player}
          />
        ))}
      </div>
    </div>
  );
}

export default HistoryPage;
