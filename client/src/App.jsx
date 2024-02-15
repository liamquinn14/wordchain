import React from 'react'
import Splash from './comps/splash'
import Game from './comps/game'
import Results from './comps/results'

const GameContext = React.createContext()

function App() {

  const [gameState, setGameState] = React.useState("splash")
  const [playerScore, setPlayerScore] = React.useState(0)
  const [defeatReason, setDefeatReason] = React.useState("")

  return (
    <div className="bg-gray-900 flex flex-col justify-center items-center text-center w-screen h-screen overflow-hidden">
    <GameContext.Provider value={{gameState, setGameState, playerScore, setPlayerScore, defeatReason, setDefeatReason}}>
    {gameState === 'splash' && <Splash />}
    {gameState === 'game' && <Game />}
    {gameState === 'results' && <Results />}
    </GameContext.Provider>
    </div>
  )
}

export { GameContext }

export default App