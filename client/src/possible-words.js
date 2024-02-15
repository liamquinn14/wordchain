function findPossibleWords(prompt, answer) {

let possibleWords = []

for (let i = 0; i < prompt.length - 1; i++) {
    possibleWords.push(prompt.slice(i) + answer)
}
console.log(possibleWords)
return possibleWords

}

export { findPossibleWords }