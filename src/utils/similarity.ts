import { cache } from "react";

const calculateWordFrequency = cache((text: string): { [word: string]: number } => {
  const wordFrequency: { [word: string]: number } = {};
  const words = text.toLowerCase().split(/\W+/);

  for (const word of words) {
    if (word.trim() !== "") {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  }

  return wordFrequency;
})

const calculateVectorMagnitude = cache((vector: { [word: string]: number }): number => {
  let magnitude = 0;

  for (const key in vector) {
    magnitude += Math.pow(vector[key], 2);
  }

  return Math.sqrt(magnitude);
})

const similarity = cache((text1: string, text2: string): number => {
  const wordFrequency1 = calculateWordFrequency(text1);
  const wordFrequency2 = calculateWordFrequency(text2);

  const vector1: { [word: string]: number } = {};
  const vector2: { [word: string]: number } = {};

  for (const word in wordFrequency1) {
    vector1[word] = wordFrequency1[word];
  }

  for (const word in wordFrequency2) {
    vector2[word] = wordFrequency2[word];
  }

  let dotProduct = 0;
  for (const word in vector1) {
    if (vector2[word]) {
      dotProduct += vector1[word] * vector2[word];
    }
  }

  const magnitude1 = calculateVectorMagnitude(vector1);
  const magnitude2 = calculateVectorMagnitude(vector2);

  const similarity = dotProduct / (magnitude1 * magnitude2);

  return similarity;
})

export { similarity };