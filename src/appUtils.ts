function splitByPunctuation(verse: string) {
  const partialVersesWithPunctuationAndBlanks = verse.split(/(.*?[\\.,;:\\?\\!])\s/)
  const partialVersesWithPunctuation = partialVersesWithPunctuationAndBlanks.filter(s => !!s)
  return partialVersesWithPunctuation
}

export { splitByPunctuation }
