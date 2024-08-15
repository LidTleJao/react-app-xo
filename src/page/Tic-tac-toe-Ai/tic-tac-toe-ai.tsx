import { useEffect, useState } from "react";
import SquarePage from "../Square/Square";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  OutlinedInput,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React from "react";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import HistoryIcon from "@mui/icons-material/History";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig/firebase";

// type Scores = {
//   [key: string]: number;
// };

// const INITIAL_SCORES: Scores = { X: 0, O: 0 };

function generateWinningCombos(size: number): number[][] {
  const combos: number[][] = [];

  // Rows
  for (let i = 0; i < size; i++) {
    const rowCombo = [];
    for (let j = 0; j < size; j++) {
      rowCombo.push(i * size + j);
    }
    combos.push(rowCombo);
  }

  // Columns
  for (let i = 0; i < size; i++) {
    const colCombo = [];
    for (let j = 0; j < size; j++) {
      colCombo.push(i + j * size);
    }
    combos.push(colCombo);
  }

  // Diagonal (Top-left to bottom-right)
  const diag1Combo = [];
  for (let i = 0; i < size; i++) {
    diag1Combo.push(i * size + i);
  }
  combos.push(diag1Combo);

  // Diagonal (Top-right to bottom-left)
  const diag2Combo = [];
  for (let i = 0; i < size; i++) {
    diag2Combo.push((i + 1) * size - (i + 1));
  }
  combos.push(diag2Combo);

  return combos;
}

type Game = {
  id: string;
  size: number;
  winner: string;
  date: Date;
};

function TTTAIPage() {
  const [size, setSize] = useState(3);
  const [tempSize, setTempSize] = useState(3);
  const [open, setOpen] = React.useState(false);
  const [openbyHistory, setOpenbyHistory] = React.useState(false);
  const [gameHistory, setGameHistory] = useState<Game[]>([]);
  const [gameState, setGameState] = useState(Array(size * size).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  // const [scores, setScores] = useState(INITIAL_SCORES);
  const [isAIGame, setIsAIGame] = useState(true);

  const navigate = useNavigate();

  function navigateToTTTPage() {
    navigate("/");
  }

  const handleItemClick = (id: string) => {
    console.log("Check here!!!!", id);
    navigate(`/HistoryAiPage/${id}`);
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    setTempSize(Number(event.target.value));
  };

  const handleClickOpenHistory = () => {
    setOpenbyHistory(true);
  };

  const handleCloseHistory = (
    event: React.SyntheticEvent<unknown>,
    reason?: string
  ) => {
    if (reason !== "backdropClick") {
      setOpenbyHistory(false);
    }
  };

  const handleOkByHistory = () => {
    // setSize(tempSize);
    setOpenbyHistory(false);
  };

  const handleClickOpenSetSize = () => {
    setTempSize(size); // Set tempSize to the current size before opening the dialog
    setOpen(true);
  };

  const handleCloseSetSize = (
    event: React.SyntheticEvent<unknown>,
    reason?: string
  ) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const handleOk = () => {
    setSize(tempSize);
    setOpen(false);
  };

  const [winningCombos, setWinningCombos] = useState(
    generateWinningCombos(size)
  );

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "history-tictactoe-ai-game")
        );
        const games = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            size: data.size,
            winner: data.winner,
          } as Game;
        }); // อธิบายว่า games ควรเป็น Game[]
        setGameHistory(games);
      } catch (error) {
        console.error("Error fetching game history: ", error);
      }
    };
    fetchGameHistory();
  }, []);

  // useEffect(() => {
  //   const storedScores = localStorage.getItem("scores");
  //   if (storedScores) {
  //     setScores(JSON.parse(storedScores));
  //   }
  // }, []);

  useEffect(() => {
    if (gameState.every((cell) => cell === "")) {
      return;
    }
    checkForWinner();
  }, [gameState]);

  useEffect(() => {
    resetBoard();
    setWinningCombos(generateWinningCombos(size));
  }, [size]);

  const resetBoard = () => setGameState(Array(size * size).fill(""));

  const handleWin = async () => {
    window.alert(`Player ${currentPlayer}! You are the winner!`);

    // const newPlayerScore = scores[currentPlayer] + 1;
    // const newScores = { ...scores };
    // newScores[currentPlayer] = newPlayerScore;
    // setScores(newScores);
    // localStorage.setItem("scores", JSON.stringify(newScores));

    // Save game data to Firestore
    await addDoc(collection(db, "history-tictactoe-ai-game"), {
      board: gameState,
      size: size,
      winner: currentPlayer,
      date: new Date(),
    });

    resetBoard();
  };

  const handleClickReset = () => {
    resetBoard();
  };

  const handleDraw = async () => {
    window.alert("The game ended in a draw");

    // Save game data to Firestore
    await addDoc(collection(db, "history-tictactoe-ai-game"), {
      board: gameState,
      size: size,
      winner: "draw",
      date: new Date(),
    });
    resetBoard();
  };

  const checkForWinner = () => {
    let roundWon = false;

    for (let i = 0; i < winningCombos.length; i++) {
      const winCombo = winningCombos[i];
      const firstValue = gameState[winCombo[0]];

      if (!firstValue) continue;

      roundWon = winCombo.every((index) => gameState[index] === firstValue);

      // if (roundWon) {
      //   break;
      // }
      if (roundWon) {
        setTimeout(() => handleWin(), 500);
        return;
      }
    }

    if (!gameState.includes("")) {
      setTimeout(() => handleDraw(), 500);
      return;
    }

    changePlayer();
  };

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

    if (currentPlayer === "X" && isAIGame) {
      setTimeout(() => aiMove(), 500);
    }
  };

  // Minimax Algorithm for optimal move
  const minimax = (
    board: string[],
    depth: number,
    isMaximizing: boolean
  ): number => {
    const scores: { [key: string]: number } = { X: -10, O: 10, draw: 0 };

    const checkWinner = (board: string[]): string => {
      for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      return board.includes("") ? "" : "draw";
    };

    const result = checkWinner(board);
    if (result) {
      return scores[result] || 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = "O";
          const score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = "X";
          const score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const bestMove = (board: string[]): number => {
    let move = -1;
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        const score = minimax(board, 0, false);
        board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const aiMove = () => {
    if (size === 3) {
      const move = bestMove(gameState);
      if (move !== -1) {
        const newValues = [...gameState];
        newValues[move] = "O";
        setGameState(newValues);
      }
    } else {
      const emptyCells = gameState
        .map((value, index) => (value === "" ? index : null))
        .filter((value) => value !== null) as number[];

      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const cellIndex = emptyCells[randomIndex];

      if (cellIndex !== undefined) {
        const newValues = [...gameState];
        newValues[cellIndex] = "O";
        setGameState(newValues);
      }
    }
  };

  const handleCellClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const cellIndex = Number(
      event.currentTarget.getAttribute("data-cell-index")
    );
    const currentValue = gameState[cellIndex];
    if (currentValue || (currentPlayer === "O" && isAIGame)) {
      return;
    }

    const newValues = [...gameState];
    newValues[cellIndex] = currentPlayer;
    setGameState(newValues);
  };

  const handleCustomSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (!isNaN(value) && value >= 3) {
      setTempSize(value);
    } else {
      window.alert("Please enter a valid number (at least 3).");
    }
  };

  return (
    <>
      <div className="min-h-screen w-full p-8 text-slate-1000 bg-gradient-to-r from-teal-600 to-blue-800">
        <h1 className="text-center text-5xl mb-4 font-display text-white">
          Tic Tac Toe Game
        </h1>
        <div>
          <div className="mb-4">
            <div>
              <div className="auto-rows-max">
                <Button
                  sx={{
                    color: "white",
                    "&:hover": {
                      background: "black",
                    },
                    background: "black",
                  }}
                  variant="contained"
                  onClick={handleClickOpenSetSize}
                >
                  Open Custom Size
                </Button>
                <Button
                  sx={{
                    marginLeft: "10px",
                    color: "white",
                    "&:hover": {
                      background: "black",
                    },
                    background: "black",
                  }}
                  variant="contained"
                  onClick={navigateToTTTPage}
                >
                  Change play game with Player
                </Button>
              </div>
              <div className="mx-auto text-left mt-5 auto-rows-max">
                <Button
                  sx={{
                    color: "white",
                    "&:hover": {
                      background: "black",
                    },
                    background: "black",
                  }}
                  variant="contained"
                  startIcon={<RotateLeftIcon />}
                  onClick={handleClickReset}
                >
                  ResetGame
                </Button>
                <Button
                  sx={{
                    marginLeft: "10px",
                    color: "white",
                    "&:hover": {
                      background: "black",
                    },
                    background: "black",
                  }}
                  variant="contained"
                  startIcon={<HistoryIcon />}
                  onClick={handleClickOpenHistory}
                >
                  History
                </Button>
              </div>
              <div className="mx-auto w-96 text-3xl text-center mt-5 font-display text-white">
                <p>
                  Next Player: <span>{currentPlayer}</span>
                </p>
                <p>Player: X</p>
                <p>AI: O</p>
              </div>
            </div>
            <Dialog
              disableEscapeKeyDown
              open={open}
              onClose={handleCloseSetSize}
            >
              <DialogTitle>Set Size Game</DialogTitle>
              <DialogContent>
                <Box
                  component="form"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                  }}
                >
                  <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="demo-dialog-select-label">Size</InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select"
                      value={tempSize.toString()} // Bind value to tempSize
                      onChange={handleChange}
                      input={<OutlinedInput label="Size" />}
                    >
                      <MenuItem value={3}>3x3</MenuItem>
                      <MenuItem value={4}>4x4</MenuItem>
                      <MenuItem value={5}>5x5</MenuItem>
                      <MenuItem value={6}>6x6</MenuItem>
                    </Select>
                  </FormControl>
                  <div>
                    <TextField
                      id="standard-basic"
                      label="Custom Size"
                      variant="standard"
                      value={tempSize}
                      onChange={handleCustomSizeChange}
                    />
                  </div>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseSetSize}>Cancel</Button>
                <Button onClick={handleOk}>Ok</Button>
              </DialogActions>
            </Dialog>
            <Dialog
              disableEscapeKeyDown
              open={openbyHistory}
              onClose={handleCloseHistory}
            >
              <DialogTitle>History</DialogTitle>
              <DialogContent>
                <Box
                  component="form"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                  }}
                >
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      maxHeight: 200,
                      bgcolor: "background.paper",
                    }}
                  >
                    {gameHistory.map((game) => (
                      <ListItem
                        key={game.id}
                        disableGutters
                        secondaryAction={
                          <IconButton
                            aria-label="details"
                            onClick={() => handleItemClick(game.id)}
                          >
                            <DashboardIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={`Size: ${game.size}, Player Winner: ${game.winner}`}
                          // secondary={`Date: ${new Date(
                          //   game.date.getTime() * 1000
                          // ).toLocaleString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseHistory}>Cancel</Button>
                <Button onClick={handleOkByHistory}>Ok</Button>
              </DialogActions>
            </Dialog>
          </div>
          <div
            className="grid gap-2 mx-auto"
            style={{
              width: Math.min(
                (90 * window.innerWidth) / 100,
                (90 * window.innerHeight) / 100
              ),
              gridTemplateColumns: `repeat(${size}, 1fr)`,
              gridTemplateRows: `repeat(${size}, 1fr)`,
            }}
          >
            {gameState.map((player, index) => (
              <SquarePage
                key={index}
                onClick={handleCellClick}
                index={index}
                player={player}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default TTTAIPage;
