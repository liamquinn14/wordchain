function checkAiWord(aiPromptList, aiWord, usedWords) {
    console.log(usedWords)
    console.log(usedWords.indexOf(aiWord))
    console.log(aiPromptList)
    if (aiWord === undefined) {
      return false
    } else if (usedWords.indexOf(aiWord) >= 0) {
      return false
    } else if (aiWord.split(aiPromptList[2])[0] === "" || aiWord.split(aiPromptList[1])[0] === "" || aiWord.split(aiPromptList[0])[0] === "") {
      return true
    } else {
      return false
    }
  }
  
export { checkAiWord }