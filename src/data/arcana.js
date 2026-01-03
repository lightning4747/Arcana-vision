export const majorArcana = [
    { id: 0, name: "The Fool", meaning: "New beginnings, innocence, spontaneity." },
    { id: 1, name: "The Magician", meaning: "Willpower, creation, manifestation." },
    { id: 2, name: "The High Priestess", meaning: "Intuition, mystery, spirituality." },
    { id: 3, name: "The Empress", meaning: "Femininity, beauty, nature, abundance." },
    { id: 4, name: "The Emperor", meaning: "Authority, structure, control, fatherhood." },
    { id: 5, name: "The Hierophant", meaning: "Tradition, conformity, morality." },
    { id: 6, name: "The Lovers", meaning: "Love, harmony, relationships, choices." },
    { id: 7, name: "The Chariot", meaning: "Control, willpower, success, action." },
    { id: 8, name: "Strength", meaning: "Strength, courage, persuasion." },
    { id: 9, name: "The Hermit", meaning: "Soul-searching, introspection." },
    { id: 10, name: "Wheel of Fortune", meaning: "Cycles, destiny, turning point." },
    { id: 11, name: "Justice", meaning: "Fairness, truth, law, cause and effect." },
    { id: 12, name: "The Hanged Man", meaning: "Pausing, surrender, letting go." },
    { id: 13, name: "Death", meaning: "Endings, change, transformation." },
    { id: 14, name: "Temperance", meaning: "Balance, moderation, patience." },
    { id: 15, name: "The Devil", meaning: "Shadow self, attachment, addiction." },
    { id: 16, name: "The Tower", meaning: "Sudden change, upheaval, chaos." },
    { id: 17, name: "The Star", meaning: "Hope, faith, purpose, renewal." },
    { id: 18, name: "The Moon", meaning: "Illusion, fear, anxiety, intuition." },
    { id: 19, name: "The Sun", meaning: "Positivity, fun, warmth, success." },
    { id: 20, name: "Judgement", meaning: "Rebirth, inner calling, absolution." },
    { id: 21, name: "The World", meaning: "Completion, integration, accomplishment." }
];

export function shuffleDeck(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}