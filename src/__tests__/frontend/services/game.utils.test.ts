import { getNeighborIdx, getPlayerIdx, passingRight, getPackIdx, getHolding } from 'components/game/shared/game.utils'

const players = [{ id: 'A' },{ id: 'B' },{ id: 'C' },{ id: 'D' }]

describe('passingRight', () => {
  it('is right', () => {
    expect(passingRight({ round: 2, roundCount: 10 })).toBe(true)
    expect(passingRight({ round: 8, roundCount: 10 })).toBe(true)
    expect(passingRight({ round: 2, roundCount: 4  })).toBe(true)
    expect(passingRight({ round: 4, roundCount: 5  })).toBe(true)
  })
  it('is left', () => {
    expect(passingRight({ round: 1, roundCount: 10 })).toBe(false)
    expect(passingRight({ round: 9, roundCount: 10 })).toBe(false)
    expect(passingRight({ round: 1, roundCount: 3  })).toBe(false)
    expect(passingRight({ round: 3, roundCount: 4  })).toBe(false)
  })
  it('no direction', () => {
    expect(passingRight({})).toBeUndefined()
    expect(passingRight({ round: 0, roundCount: 10 })).toBeUndefined()
    expect(passingRight({ round: 2, roundCount: 0  })).toBeUndefined()
    expect(passingRight({ round: 2 })).toBeUndefined()
    expect(passingRight({ roundCount: 10 })).toBeUndefined()
    expect(passingRight({ round: 5,  roundCount: 4  })).toBeUndefined()
    expect(passingRight({ round: 99, roundCount: 10 })).toBeUndefined()
  })
})

describe('getPlayerIdx', () => {
  it('finds player', () => {
    expect(getPlayerIdx(players, { id: 'B' })).toBe(1)
    expect(getPlayerIdx(players, { id: 'D' })).toBe(3)
    expect(getPlayerIdx(players, { id: 'A' })).toBe(0)
  })
  it('fails to find', () => {
    expect(getPlayerIdx(players, { id: 'E' })).toBe(-1)
    expect(getPlayerIdx(players, null)).toBe(-1)
    expect(getPlayerIdx(players)).toBe(-1)
  })
})

describe('getNeighborIdx', () => {
  it('simple find', () => {
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 2)).toBe(3)
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 1)).toBe(2)
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 0)).toBe(1)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 1)).toBe(0)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 2)).toBe(1)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 3)).toBe(2)
  })
  it('wrapped find', () => {
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 3)).toBe(0)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 0)).toBe(3)
  })
  it('fails to find', () => {
    expect(getNeighborIdx(undefined, 4, 1)).toBe(-1)
    expect(getNeighborIdx({}, 4, 1)).toBe(-1)
    expect(getNeighborIdx({ round: 0, roundCount: 4 }, 4, 1)).toBe(-1)
    expect(getNeighborIdx({ round: 5, roundCount: 4 }, 4, 1)).toBe(-1)
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, -1)).toBe(-1)
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 0, 1)).toBe(-1)
  })
})

describe('getPackIdx', () => {
  const testPack = (round: number, pick: number, result: number[]) => () => {
    const game = { round, roundCount: 3 },
      playerPicks = players.map(({ id }) => ({ id, pick }))

    players.forEach((player, idx) => {
      expect(getPackIdx(game, playerPicks, player)).toBe(result[idx])
    })
  }

  it('pack 1 pick 1', testPack(1, 1, [0, 1, 2, 3]))
  it('pack 1 pick 2', testPack(1, 2, [1, 2, 3, 0]))
  it('pack 1 pick 3', testPack(1, 3, [2, 3, 0, 1]))
  it('pack 1 pick 4', testPack(1, 4, [3, 0, 1, 2]))
  it('pack 1 pick 5', testPack(1, 5, [0, 1, 2, 3]))
  it('pack 1 pick 6', testPack(1, 6, [1, 2, 3, 0]))
  it('pack 1 pick 7', testPack(1, 7, [2, 3, 0, 1]))
  it('pack 1 pick 8', testPack(1, 8, [3, 0, 1, 2]))
  
  it('pack 2 pick 1', testPack(2, 1, [4, 5, 6, 7]))
  it('pack 2 pick 2', testPack(2, 2, [7, 4, 5, 6]))
  it('pack 2 pick 3', testPack(2, 3, [6, 7, 4, 5]))
  it('pack 2 pick 4', testPack(2, 4, [5, 6, 7, 4]))
  it('pack 2 pick 5', testPack(2, 5, [4, 5, 6, 7]))
  it('pack 2 pick 6', testPack(2, 6, [7, 4, 5, 6]))
  it('pack 2 pick 7', testPack(2, 7, [6, 7, 4, 5]))
  it('pack 2 pick 8', testPack(2, 8, [5, 6, 7, 4]))
  it('pack 2 pick 9', testPack(2, 9, [4, 5, 6, 7]))

  it('pack 3 pick 1', testPack(3, 1, [ 8,  9, 10, 11]))
  it('pack 3 pick 2', testPack(3, 2, [ 9, 10, 11,  8]))
  it('pack 3 pick 3', testPack(3, 3, [10, 11,  8,  9]))
  it('pack 3 pick 4', testPack(3, 4, [11,  8,  9, 10]))
  it('pack 3 pick 5', testPack(3, 5, [ 8,  9, 10, 11]))
})

describe('getHolding', () => {
  const firstRound = { round: 1, roundCount: 3, packSize: 15 }
  const secondRound = { round: 1, roundCount: 3, packSize: 15 }
  const setPicks = (picks: number[]) => picks.map((pick, idx) => ({ id: players[idx]?.id, pick }))

  it('all ones', () => {
    expect(getHolding(setPicks([1,1,1,1]), firstRound)).toEqual([1,1,1,1])
    expect(getHolding(setPicks([2,2,2,2]), firstRound)).toEqual([1,1,1,1])
    expect(getHolding(setPicks([5,5,5,5]), firstRound)).toEqual([1,1,1,1])
    expect(getHolding(setPicks([1,1,1,1]), secondRound)).toEqual([1,1,1,1])
    expect(getHolding(setPicks([5,5,5,5]), secondRound)).toEqual([1,1,1,1])
  })
  it('random values', () => {
    expect(getHolding(setPicks([1,2,3,2]), firstRound)).toEqual([2,2,0,0])
    expect(getHolding(setPicks([2,1,3,3]), firstRound)).toEqual([0,3,1,0])
    expect(getHolding(setPicks([4,4,5,4]), secondRound)).toEqual([1,2,0,1])
    expect(getHolding(setPicks([14,14,14,13]), secondRound)).toEqual([1,1,0,2])
  })
  it('finshed picking', () => {
    expect(getHolding(setPicks([16,16,16,16]), firstRound)).toEqual([0,0,0,0])
    expect(getHolding(setPicks([15,16,16,16]), firstRound)).toEqual([1,0,0,0])
    expect(getHolding(setPicks([15,16,16,16]), firstRound)).toEqual([1,0,0,0])
    expect(getHolding(setPicks([16,15,15,15]), firstRound)).toEqual([0,1,1,1])
  })
  it('single player', () => {
    expect(getHolding(setPicks([1]), firstRound)).toEqual([1])
    expect(getHolding(setPicks([9]), secondRound)).toEqual([1])
    expect(getHolding(setPicks([15]), secondRound)).toEqual([1])
    expect(getHolding(setPicks([16]), secondRound)).toEqual([0])
  })
  it('empty array', () => {
    expect(getHolding([], firstRound)).toEqual([])
    expect(getHolding(setPicks([1,1,1,1]))).toEqual([])
  })
  it('before/after game', () => {
    expect(getHolding(setPicks([1,2,3,2]), { ...firstRound, round: 0 })).toEqual([0,0,0,0])
    expect(getHolding(setPicks([2,1,3,3]), { ...firstRound, round: 0 })).toEqual([0,0,0,0])
    expect(getHolding(setPicks([4,4,5,4]), { ...firstRound, round: 4 })).toEqual([0,0,0,0])
    expect(getHolding(setPicks([14,14,14,13]), { ...firstRound, round: 4 })).toEqual([0,0,0,0])
  })
})