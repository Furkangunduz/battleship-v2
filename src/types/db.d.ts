interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface Game {
  id: string;
  players: string[];
  status: "pending" | "playing" | "finished";
  board_0: string[][];
  board_1: string[][];
}
