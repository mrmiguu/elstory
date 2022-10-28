import { useMemo } from 'react'
import useAsync from 'react-use/lib/useAsync'
import { random } from './utils'

type BibleTranslation = 'en_bbe' | 'en_kjv'

type BibleJSON = {
  abbrev: string
  book: string
  chapters: string[][]
}[]

const bibleTranslationModules = import.meta.glob('./translations/*.json')

const fetchBibleTranslation = async (translation: BibleTranslation) => {
  // return (await bibleTranslationModules[`./translations/${translation}.json`]()).default

  const resp = await fetch(`https://raw.githubusercontent.com/thiagobodruk/bible/master/json/${translation}.json`)
  const json: BibleJSON = await resp.json()
  return json
}

function useBibleTranslation(translation: BibleTranslation) {
  const { value: bibleJSON } = useAsync(() => fetchBibleTranslation(translation), [translation])
  return bibleJSON
}

function useRandomBibleVerse(translation: BibleTranslation) {
  const bibleJSON = useBibleTranslation(translation)

  const bookIndex = useMemo(() => (bibleJSON ? ~~(random() * bibleJSON.length) : -1), [bibleJSON])
  const book = bibleJSON?.[bookIndex]

  const chapterIndex = useMemo(() => (book ? ~~(random() * book.chapters.length) : -1), [book])
  const chapter = book?.chapters?.[chapterIndex]

  const verseIndex = useMemo(() => (chapter ? ~~(random() * chapter.length) : -1), [chapter])
  const verse = chapter?.[verseIndex]

  return { bookIndex, book, chapterIndex, chapter, verseIndex, verse }
}

export type { BibleTranslation, BibleJSON }
export { bibleTranslationModules, fetchBibleTranslation, useBibleTranslation, useRandomBibleVerse }
