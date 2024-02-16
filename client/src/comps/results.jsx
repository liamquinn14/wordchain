import React from 'react'
import { GameContext } from '../App'

function Results() {

  const {setGameState, playerScore, setPlayerScore, defeatReason, setDefeatReason, setUsedWords, setTimeLeft, round, setRound} = React.useContext(GameContext)

  const [isHovered, setIsHovered] = React.useState(false);

  function playAgain() {
    setPlayerScore(0)
    setTimeLeft(60)
    setRound(0)
    setUsedWords([])
    setGameState('game')
  }

  return (
    <>
      <h4 className='text-6xl tracking-wide m-8'>❌</h4>
      <h4 className='text-yellow-200 text-3xl tracking-wide m-4 w-1/2 flex flex-wrap text-center justify-center items-center'>{defeatReason}</h4>
      <h1 className='text-slate-100 text-3xl tracking-wide m-4'>You survived {Math.floor(round / 2) - 1} rounds and scored...</h1>
      <h3 className='text-yellow-200 text-4xl tracking-wide mt-2 mb-4'> {playerScore} points</h3>
    <div 
        className="text-gray-100 text-6xl transition-all duration-300 select-none cursor-pointer m-8"
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onClick={playAgain}
      >
      <span className={isHovered ? 'mr-2' : ''}>play</span>
      <span className="m-1 text-yellow-200">again</span>
    </div>
    </>
  )
}

export default Results