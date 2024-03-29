import React from 'react'
import { promptWords } from '../prompt-words';
import { findPossibleWords } from '../possible-words';
import { GameContext } from '../App'
import { generateAIPrompt } from '../ai-prompt';
import { checkAiWord } from '../check-ai-word';
import { preventHallucination } from '../prevent-hallucination';

function Game() {

    const [promptWord, setPromptWord] = React.useState("")
    const inputRef = React.useRef(null);
    const [answer, setAnswer] = React.useState("")
    const [submittedPlayerAnswer, setSubmittedPlayerAnswer] = React.useState("")
    const [confirmedPlayerAnswer, setConfirmedPlayerAnswer] = React.useState("")
    const [validPlayerAnswer, setValidPlayerAnswer] = React.useState("")
    const [aiPromptList, setAiPromptList] = React.useState("")
    const [possibleWords, setPossibleWords] = React.useState([])
    const [loadingResponse, setLoadingResponse] = React.useState(false)
    const {setGameState, gameState, playerScore, setPlayerScore, defeatReason, setDefeatReason, timeLeft, setTimeLeft, usedWords, setUsedWords, round, setRound, setRecord, setRecordBeat} = React.useContext(GameContext)

    React.useEffect(() => {
        let newWord = promptWords[Math.floor(Math.random() * promptWords.length)].toLowerCase()
        setPromptWord(newWord)
        setUsedWords([newWord])
    }, [])

    React.useEffect(() => {
      if (loadingResponse) {
        return
      }
      if (timeLeft > 0) {
          const interval = setInterval(() => {
              setTimeLeft(timeLeft - 1);
          }, 1000);
          return () => clearInterval(interval);
      } else {
          setDefeatReason('You ran out of time.')
          setGameState('results');
      }
  }, [timeLeft, loadingResponse]);

  React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
  }, [round, loadingResponse, promptWord]);
  
  
    function handleAnswerChange(event) {
      setAnswer(event.target.value);
    }

    function handleKeyPress(event) {
      if (event.key === "Enter") {
        submit();
      }
    }

    function submit() {
      if (answer.length < 2) {
        return
      }
      setRound(prevRound => prevRound + 1)
      let playerAnswer = promptWord + answer
      setSubmittedPlayerAnswer(playerAnswer)
      let possibleWordsArray = findPossibleWords(promptWord, answer)
      setPossibleWords(possibleWordsArray)
      let aiPrompts = generateAIPrompt(playerAnswer)
      setAiPromptList(aiPrompts)
      setLoadingResponse(true)
    }

    React.useEffect(() => {
      if (!submittedPlayerAnswer) {
        return;
      }
      async function testPlayerAnswer(possibleWords) {
        await fetch(`https://wordchain-server.vercel.app/api/testPlayerAnswer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({possibleWords: possibleWords.toString()})
        })
        .then((data) => data.json())
        .then((data) => {
          console.log(data.confirmedWord);
          setConfirmedPlayerAnswer(data.confirmedWord);
        })
      }
      testPlayerAnswer(possibleWords);
    }, [submittedPlayerAnswer]);
    

  React.useEffect(() => {
    if (!confirmedPlayerAnswer) {
      return
    }
    let wordIsContained = preventHallucination(promptWord, answer, confirmedPlayerAnswer)
    if (!wordIsContained) {
      setValidPlayerAnswer("X")
      return
    }
    async function validatePlayerAnswer(confirmedPlayerAnswer) {
      await fetch(`https://wordchain-server.vercel.app/api/validatePlayerAnswer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({confirmedPlayerAnswer: confirmedPlayerAnswer})
        })
        .then((data) => {
        return data.json();
        }).then((data) => {
        if (data.isWordValid === "yes" && usedWords.indexOf(confirmedPlayerAnswer) < 0) {
        setValidPlayerAnswer(confirmedPlayerAnswer)
        setUsedWords(prevUsedWords => [...prevUsedWords, confirmedPlayerAnswer])
      } else {
        setValidPlayerAnswer("X")
      }
    })
  }
  validatePlayerAnswer(confirmedPlayerAnswer)
}, [confirmedPlayerAnswer])

React.useEffect(() => {
  if (validPlayerAnswer === 'X') {
    setDefeatReason(`We could not find a valid word from "${submittedPlayerAnswer}". If you meant '${confirmedPlayerAnswer}', then that is invalid.`)
    setGameState('results')
  } else {
    setPlayerScore(prevPlayerScore => prevPlayerScore + validPlayerAnswer.length)
    setRound(prevRound => prevRound + 1)
  }
}, [validPlayerAnswer])

React.useEffect(() => {
  if (!validPlayerAnswer) {
    return;
  }
  async function generateAIReply(aiPrompt) {
    await fetch("https://wordchain-server.vercel.app/api/generateAIReply", {
      method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({aiPrompt: aiPrompt.toString()})
    })
    .then((data) => {
      console.log(data)
      return data.json();
      }).then((data) => {
      let res = data.aiReply
      res !== undefined && res.trim()
      console.log(usedWords.indexOf(res))
      let aiSuccess = checkAiWord(aiPrompt, res, usedWords)
      if (aiSuccess && res.length > 4) {
        setPromptWord(res);
        setUsedWords(prevUsedWords => [...prevUsedWords, res])
      } else {
        console.log(`${res} is an invalid word`)
        let newRandomPrompt = promptWords[Math.floor(Math.random() * promptWords.length)].toLowerCase()
        setPromptWord(newRandomPrompt)
        setUsedWords(prevUsedWords => [...prevUsedWords, "AI DEFEATED! + 10 POINTS"])
        setUsedWords(prevUsedWords => [...prevUsedWords, newRandomPrompt])
        validPlayerAnswer !== "X" && setPlayerScore(prevPlayerScore => prevPlayerScore + 10)
      }
      setLoadingResponse(false)
      inputRef.current.focus();
      inputRef.current.scrollIntoView({behavior: "smooth"
    })
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  generateAIReply(aiPromptList);
  setAnswer("")
}, [validPlayerAnswer]);

function forfeit() {
  setGameState('results')
}

React.useEffect(() => {
  if (!localStorage.getItem('record') || Number(playerScore) > Number(localStorage.getItem('record'))) {
              localStorage.setItem('record', playerScore.toString())
              setRecordBeat(true)
          }
      setRecord(localStorage.getItem('record'))
}, [playerScore])

  return (
    <>
    <div className='rounded-full bg-yellow-200 text-gray-900 p-2 text-3xl m-4 md:m-8'>{timeLeft}</div>
    <p className='text-2xl text-gray-100'>Your score is...</p>
    <p className='text-3xl text-yellow-200 mt-2 mb-4 md:mb-6'>{playerScore}</p>
    <div className={`m-1 text-sm ${round % 2 === 0 ? "text-gray-200" : "text-yellow-200"}`}>{usedWords.length > 3 ? usedWords[usedWords.length - 4] : "your"}</div>
    <div className={`m-1 text-base ${round % 2 === 0 ? "text-yellow-200" : "text-gray-200"}`}>{usedWords.length > 2 ? usedWords[usedWords.length - 3] : "wordchain"}</div>
    <div className={`m-1 text-lg ${round % 2 === 0 ? "text-gray-200" : "text-yellow-200"}`}>{usedWords.length > 1 ? usedWords[usedWords.length - 2] : "goes"}</div>
    <div className={`m-1 text-xl ${round % 2 === 0 ? "text-yellow-200" : "text-gray-200"}`}>{usedWords.length > 1 ? usedWords[usedWords.length - 1] : "here"}</div>
    <div className="flex flex-row items-center justify-center text-center">
        <div className="text-gray-800 bg-gray-100 text-3xl m-8 tracking-wider rounded-full p-4 font-bold select-none hidden md:flex">AI</div>
        {loadingResponse ? <div className='text-gray-100 text-2xl animate-bounce tracking-wide mt-2'>the AI is thinking...</div>
        : <div className="text-gray-100 text-4xl md:text-5xl tracking-wide mx-0 mt-2 md:mt-4">
         <span className='text-gray-100 text-4xl md:text-5xl tracking-wide text-center'>{promptWord.slice(0, promptWord.length - 2)}</span><span className='text-yellow-200 text-4xl md:text-5xl tracking-wide text-center'>{promptWord.slice(promptWord.length - 2)}</span>
          </div> }
        {!loadingResponse && <input type="text" autoCapitalize="none" autoComplete="off" autoCorrect="off" className="text-4xl md:text-5xl bg-gray-900 text-yellow-200 w-min min-w-1 max-w-40 md:max-w-64 outline-none tracking-wide mx-0 mt-2 md:mt-4" ref={inputRef} onChange={handleAnswerChange} onKeyPress={handleKeyPress} value={answer}/> }
        <div className="text-gray-800 bg-yellow-200 text-3xl m-8 tracking-wider rounded-full p-4 font-bold select-none hidden md:flex">ME</div>
    </div>
    <button className='px-4 py-2 bg-yellow-200 text-gray-900 border-2 border-red-500 rounded-lg shadow-md text-2xl font-medium m-24 hover:bg-red-500 hidden md:flex' onClick={forfeit}>Forfeit</button>
    </>
  )
}

export default Game