function generateAIPrompt(prompt) {
let possiblePrompts = []
for (let i = prompt.length - 3; i < prompt.length - 1; i++) {
    possiblePrompts.push(prompt.slice(i))
    }
    return possiblePrompts
}

export { generateAIPrompt }