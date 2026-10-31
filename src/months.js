const monthData = [
  ['Januar', 'January'],
  ['Februar', 'February'],
  ['März', 'March'],
  ['April', 'April'],
  ['Mai', 'May'],
  ['Juni', 'June'],
  ['Juli', 'July'],
  ['August', 'August'],
  ['September', 'September'],
  ['Oktober', 'October'],
  ['November', 'November'],
  ['Dezember', 'December'],
]

export const MONTHS = Object.fromEntries([
  ...monthData.map(([name], index) => [name, index]),
  ['Maerz', 2],
])

export const MONTH_NAMES_EN = Object.fromEntries([
  ...monthData.map(([germanName, englishName]) => [germanName, englishName]),
  ['Maerz', 'March'],
])

export const MONTHS_EN = monthData.map(([, englishName]) => englishName)
