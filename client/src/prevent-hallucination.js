function preventHallucination(prompt, answer, confirmedPlayerAnswer) {
    let validEnding = prompt.slice(prompt.length - 2)
    let minimumWord = validEnding + answer
    if (confirmedPlayerAnswer.split(minimumWord).length > 1) {
      return true
    } else return false
  }

export { preventHallucination }