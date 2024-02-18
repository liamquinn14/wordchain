import React from 'react'
import { GameContext } from '../App'

function Results() {

  const {setGameState, playerScore, setPlayerScore, defeatReason, setDefeatReason, setUsedWords, setTimeLeft, round, setRound, record, recordBeat, setRecordBeat} = React.useContext(GameContext)

  const [isHovered, setIsHovered] = React.useState(false);
  const [medalUrl, setMedalUrl] = React.useState("");

  React.useEffect(() => {
    if (record < 150) {
      setMedalUrl('/bronze.png')
    } else if (record < 250) {
      setMedalUrl('/silver.png')
    } else if (record < 300) {
      setMedalUrl('/gold.svg')
    }
  }, [record])

  function playAgain() {
    setPlayerScore(0)
    setTimeLeft(60)
    setRound(0)
    setUsedWords([])
    setRecordBeat(false)
    setGameState('game')
  }



  return (
    <>
      <h4 className='text-6xl tracking-wide m-8'>❌</h4>
      <h4 className='text-yellow-200 text-3xl tracking-wide m-4 w-1/2 flex flex-wrap text-center justify-center items-center'>{defeatReason}</h4>
      <h1 className='text-slate-100 text-3xl tracking-wide m-4'>You survived {Math.floor(round / 2)} round{(Math.floor(round / 2) ) === 1 ? "" : "s"} and scored...</h1>
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
    {recordBeat && (
        <h2 className="p-2 m-2 text-xl font-bolder text-green-300 tracking-wide">
          THAT'S A NEW HIGH SCORE!
        </h2>
      )}
      <h2 className="p-2 w-1/6 mx-auto text-center font-medium text-gray-100 text-2xl md:w-1/3 md:m-4 rounded-xl tracking-wide">
            Your High Score: {record}
      </h2>
      { record >= 80 && <img src={medalUrl} className='w-20 m-4'/>}
    </>
  )
}

export default Results