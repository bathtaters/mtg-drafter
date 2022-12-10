import { getNeighborIdx, getPlayerIdx, passingRight, getPackIdx } from 'components/game/shared/game.utils'

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
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 1, false)).toBe(0)
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 2, false)).toBe(1)
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 3, false)).toBe(2)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 2, false)).toBe(3)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 1, false)).toBe(2)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 0, false)).toBe(1)
  })
  it('wrapped find', () => {
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 0, false)).toBe(3)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 3, false)).toBe(0)
  })
  it('simple inverted find', () => {
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 2, true)).toBe(3)
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 1, true)).toBe(2)
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 0, true)).toBe(1)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 1, true)).toBe(0)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 2, true)).toBe(1)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 3, true)).toBe(2)
  })
  it('wrapped inverted find', () => {
    expect(getNeighborIdx({ round: 1, roundCount: 4 }, 4, 3, true)).toBe(0)
    expect(getNeighborIdx({ round: 2, roundCount: 4 }, 4, 0, true)).toBe(3)
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
  const getGame = (round: number) => ({ round, roundCount: 3 })
  const getPlayers = (pick: number) => players.map(({ id }) => ({ id, pick }))

  it('pack 1 pick 1', () => {
    const game = getGame(1), players = getPlayers(1)
    expect(getPackIdx(game, players, { id: "A" })).toBe(0)
    expect(getPackIdx(game, players, { id: "B" })).toBe(1)
    expect(getPackIdx(game, players, { id: "C" })).toBe(2)
    expect(getPackIdx(game, players, { id: "D" })).toBe(3)
  })
  it('pack 1 pick 2', () => {
    const game = getGame(1), players = getPlayers(2)
    expect(getPackIdx(game, players, { id: "A" })).toBe(1)
    expect(getPackIdx(game, players, { id: "B" })).toBe(2)
    expect(getPackIdx(game, players, { id: "C" })).toBe(3)
    expect(getPackIdx(game, players, { id: "D" })).toBe(0)
  })
  it('pack 1 pick 3', () => {
    const game = getGame(1), players = getPlayers(3)
    expect(getPackIdx(game, players, { id: "A" })).toBe(2)
    expect(getPackIdx(game, players, { id: "B" })).toBe(3)
    expect(getPackIdx(game, players, { id: "C" })).toBe(0)
    expect(getPackIdx(game, players, { id: "D" })).toBe(1)
  })
  it('pack 1 pick 4', () => {
    const game = getGame(1), players = getPlayers(4)
    expect(getPackIdx(game, players, { id: "A" })).toBe(3)
    expect(getPackIdx(game, players, { id: "B" })).toBe(0)
    expect(getPackIdx(game, players, { id: "C" })).toBe(1)
    expect(getPackIdx(game, players, { id: "D" })).toBe(2)
  })
  it('pack 1 pick 5', () => {
    const game = getGame(1), players = getPlayers(5)
    expect(getPackIdx(game, players, { id: "A" })).toBe(0)
    expect(getPackIdx(game, players, { id: "B" })).toBe(1)
    expect(getPackIdx(game, players, { id: "C" })).toBe(2)
    expect(getPackIdx(game, players, { id: "D" })).toBe(3)
  })

  it('pack 2 pick 1', () => {
    const game = getGame(2), players = getPlayers(1)
    expect(getPackIdx(game, players, { id: "A" })).toBe(4)
    expect(getPackIdx(game, players, { id: "B" })).toBe(5)
    expect(getPackIdx(game, players, { id: "C" })).toBe(6)
    expect(getPackIdx(game, players, { id: "D" })).toBe(7)
  })
  it('pack 2 pick 2', () => {
    const game = getGame(2), players = getPlayers(2)
    expect(getPackIdx(game, players, { id: "A" })).toBe(7)
    expect(getPackIdx(game, players, { id: "B" })).toBe(4)
    expect(getPackIdx(game, players, { id: "C" })).toBe(5)
    expect(getPackIdx(game, players, { id: "D" })).toBe(6)
  })
  it('pack 2 pick 3', () => {
    const game = getGame(2), players = getPlayers(3)
    expect(getPackIdx(game, players, { id: "A" })).toBe(6)
    expect(getPackIdx(game, players, { id: "B" })).toBe(7)
    expect(getPackIdx(game, players, { id: "C" })).toBe(4)
    expect(getPackIdx(game, players, { id: "D" })).toBe(5)
  })
  it('pack 2 pick 4', () => {
    const game = getGame(2), players = getPlayers(4)
    expect(getPackIdx(game, players, { id: "A" })).toBe(5)
    expect(getPackIdx(game, players, { id: "B" })).toBe(6)
    expect(getPackIdx(game, players, { id: "C" })).toBe(7)
    expect(getPackIdx(game, players, { id: "D" })).toBe(4)
  })
  it('pack 2 pick 5', () => {
    const game = getGame(2), players = getPlayers(5)
    expect(getPackIdx(game, players, { id: "A" })).toBe(4)
    expect(getPackIdx(game, players, { id: "B" })).toBe(5)
    expect(getPackIdx(game, players, { id: "C" })).toBe(6)
    expect(getPackIdx(game, players, { id: "D" })).toBe(7)
  })
  it('pack 2 pick 6', () => {
    const game = getGame(2), players = getPlayers(6)
    expect(getPackIdx(game, players, { id: "A" })).toBe(7)
    expect(getPackIdx(game, players, { id: "B" })).toBe(4)
    expect(getPackIdx(game, players, { id: "C" })).toBe(5)
    expect(getPackIdx(game, players, { id: "D" })).toBe(6)
  })
})