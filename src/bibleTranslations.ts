import { useMemo } from 'react'
import useAsync from 'react-use/lib/useAsync'
import { GlobDefaultImport } from './types'
import { random } from './utils'

type BibleTranslation = 'en_bbe' | 'en_kjv'

type BibleJSON = {
  abbrev: string
  name: string
  chapters: string[][]
}[]

const bibleTranslationModules = import.meta.glob<GlobDefaultImport<BibleJSON>>('./bible/*.json')

const fetchBibleTranslation = async (translation: BibleTranslation) =>
  (await bibleTranslationModules[`./bible/${translation}.json`]!()).default

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
export { fetchBibleTranslation, useBibleTranslation, useRandomBibleVerse }
