import React from 'react'
import Splash from './comps/splash'
import Game from './comps/game'
import Results from './comps/results'

const GameContext = React.createContext()

function App() {

  const [gameState, setGameState] = React.useState("splash")
  const [playerScore, setPlayerScore] = React.useState(0)
  const [defeatReason, setDefeatReason] = React.useState("")
  const [timeLeft, setTimeLeft] = React.useState(60)
  const [usedWords, setUsedWords] = React.useState([])
  const [round, setRound] = React.useState(0)
  const [record, setRecord] = React.useState(0);
  const [recordBeat, setRecordBeat] = React.useState(false);

  React.useEffect(() => {
    if (
      !localStorage.getItem("record") ||
      Number(playerScore) > Number(localStorage.getItem("record"))
    ) {
      localStorage.setItem("record", playerScore.toString());
      setRecordBeat(true);
    }
    setRecord(localStorage.getItem("record"));
  }, [playerScore]);

  return (
    <div className="bg-gray-900 flex flex-col justify-center items-center text-center w-screen h-dvh overflow-hidden">
    <GameContext.Provider value={{gameState, setGameState, playerScore, setPlayerScore, defeatReason, setDefeatReason, timeLeft, setTimeLeft, usedWords, setUsedWords, round, setRound, record, setRecord, recordBeat, setRecordBeat}}>
    {gameState === 'splash' && <Splash />}
    {gameState === 'game' && <Game />}
    {gameState === 'results' && <Results />}
    </GameContext.Provider>
    </div>
  )
}

export { GameContext }

export default App