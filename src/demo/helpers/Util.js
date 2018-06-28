export function getRandomNumberFromLenghtOfData(data) {
    return Math.floor(Math.random() * (data.length - 1)) + 1;
}


export function getArrayOfKeywords(data) {
    let keywords = [];
    let numberOfKeywords = Math.floor(Math.random() * 10) + 1;
    for (let i = 0; i < numberOfKeywords; i++) {
        let randomNumber = getRandomNumberFromLenghtOfData(data);
        keywords.push(data[randomNumber].word);
    }
    return keywords;
}
