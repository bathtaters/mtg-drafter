import type { SetFull } from 'types/setup'
import prisma from 'backend/libs/db'

export const getFullSet = (code: SetFull['code']): Promise<SetFull | null> => prisma.cardSet.findUnique({
  where: { code },
  include: { 
    boosters: { include: { sheets: true }},
    sheets: {
      include: { cards: { include: { card: true }}}
    },
  }
}).then((set) => set && ({
  ...set,
  sheets: set.sheets.reduce((sheets, sheet) =>
    Object.assign(sheets, { [sheet.name]: sheet })
  , {} as SetFull['sheets'])
}))


