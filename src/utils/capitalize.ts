export const capitalizeWord = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const capitalizeSentence = (sentence: string) => {
  return [capitalizeWord(sentence[0]), ...sentence.slice(1)].join("");
};

export const capitalizeWords = (sentence: string) => {
  return sentence
    .split(" ")
    .map((word) => capitalizeWord(word))
    .join(" ");
}
