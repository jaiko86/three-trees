import printDirectoryTree, { getProcessedLines, markLastChilds, getBranchesForLines } from './index'

const xdescribe = (...any: any[]) => {}

describe('getProcessedLines()', () => {
  const testCases = [
    {
      input: `dir 1
  dir 2
    dir 3`,
      expected: [
        { indents: 0, value: 'dir 1', branches: [], lastChild: false },
        { indents: 1, value: 'dir 2', branches: [], lastChild: false },
        { indents: 2, value: 'dir 3', branches: [], lastChild: false },
      ],
    },
    {
      input: `dir 1
  dir 2
    dir 3
dir 1
  dir 2
    dir 3`,
      expected: [
        { indents: 0, value: 'dir 1', branches: [], lastChild: false },
        { indents: 1, value: 'dir 2', branches: [], lastChild: false },
        { indents: 2, value: 'dir 3', branches: [], lastChild: false },
        { indents: 0, value: 'dir 1', branches: [], lastChild: false },
        { indents: 1, value: 'dir 2', branches: [], lastChild: false },
        { indents: 2, value: 'dir 3', branches: [], lastChild: false },
      ],
    },
    {
      input: `dir 1
dir 2
dir 3`,
      expected: [
        { indents: 0, value: 'dir 1', branches: [], lastChild: false },
        { indents: 0, value: 'dir 2', branches: [], lastChild: false },
        { indents: 0, value: 'dir 3', branches: [], lastChild: false },
      ],
    },
    {
      input: `dir 1
  dir 2
    dir 3
    dir 4
    dir 5
      dir 6`,
      expected: [
        { indents: 0, value: 'dir 1', branches: [], lastChild: false },
        { indents: 1, value: 'dir 2', branches: [], lastChild: false },
        { indents: 2, value: 'dir 3', branches: [], lastChild: false },
        { indents: 2, value: 'dir 4', branches: [], lastChild: false },
        { indents: 2, value: 'dir 5', branches: [], lastChild: false },
        { indents: 3, value: 'dir 6', branches: [], lastChild: false },
      ],
    },
    {
      input: `dir 1
  dir 2
    dir 3
  dir 4
dir 5`,
      expected: [
        { indents: 0, value: 'dir 1', branches: [], lastChild: false },
        { indents: 1, value: 'dir 2', branches: [], lastChild: false },
        { indents: 2, value: 'dir 3', branches: [], lastChild: false },
        { indents: 1, value: 'dir 4', branches: [], lastChild: false },
        { indents: 0, value: 'dir 5', branches: [], lastChild: false },
      ],
    },
  ]
  testCases.forEach(({ input, expected }, index) => {
    test(`Test case #${index + 1}`, () => {
      const result = getProcessedLines(input)
      expect(result).toEqual(expected)
    })
  })
})

describe('markLastChilds()', () => {
  const testCases = [
    {
      input: {
        lines: [
          { indents: 0, value: 'dir 1' },
          { indents: 1, value: 'dir 2' },
          { indents: 2, value: 'dir 3' },
        ],
        index: 0,
      },
      expected: [
        { indents: 0, value: 'dir 1', lastChild: true },
        { indents: 1, value: 'dir 2', lastChild: true },
        { indents: 2, value: 'dir 3', lastChild: true },
      ],
    },
    {
      input: {
        lines: [
          { indents: 0, value: 'dir 1' },
          { indents: 1, value: 'dir 2' },
          { indents: 2, value: 'dir 3' },
          { indents: 2, value: 'dir 4' },
          { indents: 2, value: 'dir 5' },
        ],
        index: 0,
      },
      expected: [
        { indents: 0, value: 'dir 1', lastChild: true },
        { indents: 1, value: 'dir 2', lastChild: true },
        { indents: 2, value: 'dir 3', lastChild: false },
        { indents: 2, value: 'dir 4', lastChild: false },
        { indents: 2, value: 'dir 5', lastChild: true },
      ],
    },
    {
      input: {
        lines: [
          { indents: 0, value: 'dir 1' },
          { indents: 1, value: 'dir 2' },
          { indents: 2, value: 'dir 3' },
          { indents: 3, value: 'dir 4' },
          { indents: 4, value: 'dir 5' },
        ],
        index: 0,
      },
      expected: [
        { indents: 0, value: 'dir 1', lastChild: true },
        { indents: 1, value: 'dir 2', lastChild: true },
        { indents: 2, value: 'dir 3', lastChild: true },
        { indents: 3, value: 'dir 4', lastChild: true },
        { indents: 4, value: 'dir 5', lastChild: true },
      ],
    },
    {
      input: {
        lines: [
          { indents: 0, value: 'dir 1' },
          { indents: 1, value: 'dir 2' },
          { indents: 2, value: 'dir 3' },
          { indents: 3, value: 'dir 4' },
          { indents: 4, value: 'dir 5' },
          { indents: 0, value: 'dir 6' },
          { indents: 0, value: 'dir 7' },
        ],
        index: 0,
      },
      expected: [
        { indents: 0, value: 'dir 1', lastChild: false },
        { indents: 1, value: 'dir 2', lastChild: true },
        { indents: 2, value: 'dir 3', lastChild: true },
        { indents: 3, value: 'dir 4', lastChild: true },
        { indents: 4, value: 'dir 5', lastChild: true },
        { indents: 0, value: 'dir 6', lastChild: false },
        { indents: 0, value: 'dir 7', lastChild: true },
      ],
    },
    {
      input: {
        lines: [
          { indents: 0, value: 'dir 1' },
          { indents: 1, value: 'dir 2' },
          { indents: 2, value: 'dir 3' },
          { indents: 3, value: 'dir 4' },
          { indents: 1, value: 'dir 5' },
          { indents: 2, value: 'dir 6' },
          { indents: 3, value: 'dir 7' },
        ],
        index: 0,
      },
      expected: [
        { indents: 0, value: 'dir 1', lastChild: true },
        { indents: 1, value: 'dir 2', lastChild: false },
        { indents: 2, value: 'dir 3', lastChild: true },
        { indents: 3, value: 'dir 4', lastChild: true },
        { indents: 1, value: 'dir 5', lastChild: true },
        { indents: 2, value: 'dir 6', lastChild: true },
        { indents: 3, value: 'dir 7', lastChild: true },
      ],
    },
    {
      input: {
        lines: [
          { indents: 0, value: 'dir 1' },
          { indents: 1, value: 'dir 2' },
          { indents: 2, value: 'dir 3' },
          { indents: 0, value: 'dir 1' },
          { indents: 1, value: 'dir 2' },
          { indents: 2, value: 'dir 3' },
        ],
        index: 0,
      },
      expected: [
        { indents: 0, value: 'dir 1', lastChild: false },
        { indents: 1, value: 'dir 2', lastChild: true },
        { indents: 2, value: 'dir 3', lastChild: true },
        { indents: 0, value: 'dir 1', lastChild: true },
        { indents: 1, value: 'dir 2', lastChild: true },
        { indents: 2, value: 'dir 3', lastChild: true },
      ],
    },
  ]
  testCases.forEach(({ input, expected }, index) => {
    test(`Test case #${index + 1}`, () => {
      const result = markLastChilds(input.lines)
      expect(result).toEqual(expected)
    })
  })
})

const BRANCH_CHARS = {
  LAST: '└──',
  FORK: '├──',
  EMPTY: '    ',
  STRAIGHT: '│   ',
}

describe('getBranchesForLines()', () => {
  const testCases = [
    {
      input: [{ value: 'dir 1', indents: 0, lastChild: true }],
      expected: [''],
    },
    {
      input: [{ value: 'dir 1', indents: 0, lastChild: false }],
      expected: [''],
    },
    {
      input: [
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: true },
        { value: 'dir 3', indents: 2, lastChild: true },
      ],
      expected: ['', BRANCH_CHARS.LAST, BRANCH_CHARS.EMPTY + BRANCH_CHARS.LAST],
    },
    {
      // #3
      input: [
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: true },
        { value: 'dir 3', indents: 2, lastChild: false },
        { value: 'dir 4', indents: 2, lastChild: false },
        { value: 'dir 5', indents: 2, lastChild: true },
      ],
      expected: [
        '',
        BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.FORK,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.FORK,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.LAST,
      ],
    },
    {
      input: [
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: true },
        { value: 'dir 3', indents: 2, lastChild: true },
        { value: 'dir 4', indents: 3, lastChild: true },
        { value: 'dir 5', indents: 4, lastChild: true },
      ],
      expected: [
        '',
        BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY.repeat(2) + BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY.repeat(3) + BRANCH_CHARS.LAST,
      ],
    },
    {
      input: [
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: true },
        { value: 'dir 3', indents: 2, lastChild: true },
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: true },
        { value: 'dir 3', indents: 2, lastChild: true },
      ],
      expected: [
        '',
        BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.LAST,
        '',
        BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.LAST,
      ],
    },
    {
      input: [
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: false },
        { value: 'dir 3', indents: 2, lastChild: false },
        { value: 'dir 4', indents: 3, lastChild: true },
        { value: 'dir 5', indents: 2, lastChild: true },
        { value: 'dir 6', indents: 1, lastChild: true },
      ],
      expected: [
        '',
        BRANCH_CHARS.FORK,
        BRANCH_CHARS.STRAIGHT + BRANCH_CHARS.FORK,
        BRANCH_CHARS.STRAIGHT.repeat(2) + BRANCH_CHARS.LAST,
        BRANCH_CHARS.STRAIGHT + BRANCH_CHARS.LAST,
        BRANCH_CHARS.LAST,
      ],
    },
  ]
  testCases.forEach(({ input, expected }, index) => {
    test(`Test case #${index}`, () => {
      const result = getBranchesForLines(input).map((line) => line.branches.join(''))
      console.log(result.join('\n'))
      expect(result).toEqual(expected)
    })
  })
})

describe('printDirectoryTree()', () => {
  const testCases = [
    {
      input: [{ value: 'dir 1', indents: 0, lastChild: true }],
      expected: [''],
    },
    {
      input: [{ value: 'dir 1', indents: 0, lastChild: false }],
      expected: [''],
    },
    {
      input: [
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: true },
        { value: 'dir 3', indents: 2, lastChild: true },
      ],
      expected: ['', BRANCH_CHARS.LAST, BRANCH_CHARS.EMPTY + BRANCH_CHARS.LAST],
    },
    {
      // #3
      input: [
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: true },
        { value: 'dir 3', indents: 2, lastChild: false },
        { value: 'dir 4', indents: 2, lastChild: false },
        { value: 'dir 5', indents: 2, lastChild: true },
      ],
      expected: [
        '',
        BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.FORK,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.FORK,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.LAST,
      ],
    },
    {
      input: [
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: true },
        { value: 'dir 3', indents: 2, lastChild: true },
        { value: 'dir 4', indents: 3, lastChild: true },
        { value: 'dir 5', indents: 4, lastChild: true },
      ],
      expected: [
        '',
        BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY.repeat(2) + BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY.repeat(3) + BRANCH_CHARS.LAST,
      ],
    },
    {
      input: [
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: true },
        { value: 'dir 3', indents: 2, lastChild: true },
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: true },
        { value: 'dir 3', indents: 2, lastChild: true },
      ],
      expected: [
        '',
        BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.LAST,
        '',
        BRANCH_CHARS.LAST,
        BRANCH_CHARS.EMPTY + BRANCH_CHARS.LAST,
      ],
    },
    {
      input: [
        { value: 'dir 1', indents: 0, lastChild: true },
        { value: 'dir 2', indents: 1, lastChild: false },
        { value: 'dir 3', indents: 2, lastChild: false },
        { value: 'dir 4', indents: 3, lastChild: true },
        { value: 'dir 5', indents: 2, lastChild: true },
        { value: 'dir 6', indents: 1, lastChild: true },
      ],
      expected: [
        '',
        BRANCH_CHARS.FORK,
        BRANCH_CHARS.STRAIGHT + BRANCH_CHARS.FORK,
        BRANCH_CHARS.STRAIGHT.repeat(2) + BRANCH_CHARS.LAST,
        BRANCH_CHARS.STRAIGHT + BRANCH_CHARS.LAST,
        BRANCH_CHARS.LAST,
      ],
    },
  ]
  testCases.forEach(({ input, expected }, index) => {
    test(`Test case #${index}`, () => {
      const result = getBranchesForLines(input).map((line) => line.branches.join(''))
      console.log(result.join('\n'))
      expect(result).toEqual(expected)
    })
  })
})
