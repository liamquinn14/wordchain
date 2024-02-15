function checkAiWord(aiPromptList, aiWord) {
    if (aiWord.split(aiPromptList[1])[0] === "" || aiWord.split(aiPromptList[0])[0] === "") {
      return true
    } else {
      return false
    }
  }
  
export { checkAiWord }