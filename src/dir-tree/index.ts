const INDENT = ''.padStart(2, ' ')
const INDENT_LENGTH = INDENT.length

const BRANCH_CHARS = {
  EMPTY: '    ',
  FORK: '├──',
  LAST: '└──',
  STRAIGHT: '│   ',
}

type Line = Partial<{
  value: string
  lastChild: boolean
  indents: number
  branches: string[]
}>

const getIndentCount = (str: string) => {
  let indentCount = 0
  while (str.startsWith(INDENT)) {
    str = str.substring(INDENT_LENGTH)
    indentCount++
  }
  return indentCount
}

const removeIndents = (str: string, indents: number) => {
  while (indents--) {
    str = str.substring(INDENT_LENGTH)
  }
  return str
}

export const getProcessedLines = (text: string): Line[] =>
  text
    .split('\n')
    .map((line, index) =>
      index
        ? {
            indents: getIndentCount(line),
            value: line,
          }
        : {
            indents: 0,
            value: line,
          },
    )
    .map((line, index, arr) => {
      if (!index) return { ...line, lastChild: false, branches: [] }
      const lastIndent = arr[index - 1].indents
      const indents = lastIndent + 1 < line.indents ? lastIndent : line.indents
      const value = removeIndents(line.value, indents)

      return { indents, value, lastChild: false, branches: [] }
    })

export const markLastChilds = (lines: Line[]): Line[] => {
  const lastLineByIndent = []
  let prevLine: Line = {
    indents: -1,
    value: '',
    lastChild: true,
    branches: [],
  }
  const markedLines = lines.map((line) => ({ ...line, lastChild: false }))
  markedLines.forEach((line, i, arr) => {
    prevLine = arr[i - 1] || prevLine
    if (line.indents < prevLine.indents) {
      for (let j = line.indents + 1; j < lastLineByIndent.length; j++) {
        const lineToMark = lastLineByIndent[j]
        lineToMark.lastChild = true
      }
      lastLineByIndent.length = line.indents
    }
    lastLineByIndent[line.indents] = line
  })
  lastLineByIndent.forEach((line) => (line.lastChild = true))

  return markedLines
}

const cloneToIndex = <T>(arr: T[], index: number) => arr.filter((_, i) => i < index)

const replaceLastItem = <T>(arr: T[], replacement: T) =>
  arr.map((item, i) => (i === arr.length - 1 ? replacement : item))

export const addBranches = (lines: Line[]): Line[] => {
  lines.forEach((line, i, arr) => {
    const prevLine = arr[i - 1] || { branches: [], indents: 0, lastChild: true }
    let branches = cloneToIndex(prevLine.branches, line.indents)
    if (line.indents === prevLine.indents) {
      branches = replaceLastItem(branches, line.lastChild ? BRANCH_CHARS.LAST : BRANCH_CHARS.FORK)
    } else if (line.indents > prevLine.indents) {
      branches = replaceLastItem(
        branches,
        prevLine.lastChild ? BRANCH_CHARS.EMPTY : BRANCH_CHARS.STRAIGHT,
      )
      branches.push(line.lastChild ? BRANCH_CHARS.LAST : BRANCH_CHARS.FORK)
    } else {
      branches = replaceLastItem(branches, line.lastChild ? BRANCH_CHARS.LAST : BRANCH_CHARS.FORK)
    }
    line.branches = branches
  })
  return lines
}
const printDirectoryTree = (text: string) => {
  const processedLines = getProcessedLines(text)
  const processedLines2 = markLastChilds(processedLines)
}

export default printDirectoryTree
