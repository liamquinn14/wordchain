import React from 'react'
import { GameContext } from '../App'

function Results() {

  const {setGameState, playerScore, setPlayerScore, defeatReason, setDefeatReason} = React.useContext(GameContext)

  return (
    <>
      <h4 className='text-slate-100 text-2xl tracking-wide'>Ouch. That hurt. Now you're dead.</h4>
      <h4 className='text-yellow-200 text-3xl tracking-wide m-4 w-1/2 flex flex-wrap text-center justify-center items-center'>{defeatReason}</h4>
      <h4 className='text-6xl tracking-wide m-8'>❌</h4>
      <h1 className='text-slate-100 text-3xl tracking-wide'> Your final score was... </h1>
      <h3 className='text-yellow-200 text-4xl tracking-wide m-4'> {playerScore} </h3>
    </>
  )
}

export default Results