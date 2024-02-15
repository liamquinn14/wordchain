import React from 'react'
import { GameContext } from '../App';

function Splash() {

    const {setGameState} = React.useContext(GameContext)

    const [isHovered, setIsHovered] = React.useState(false);

    function startGame() {
        setGameState('game')
    }

  return (
    <>
    <p className="text-gray-100 text-xl italic" >click to play...</p>
    <div 
        className="text-gray-100 text-6xl transition-all duration-300 select-none cursor-pointer"
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onClick={startGame}
      >
        <span className={isHovered ? 'mr-2' : ''}>word</span>
        <span className="m-1 text-yellow-200">chain</span>
      </div>
    <p className='text-yellow-200 text-xl italic decoration-wavy m-1'>every chain comes to an end</p>
    </>
  )
}

export default Splash