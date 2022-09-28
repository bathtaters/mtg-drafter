export type Card = {
  // Basic data
  uuid: string,
  name: String,
  setCode: string, // ref: 'Set' // +INDEX
  manaCost: string,
  type: string,
  text: string,
  footer: string, // create from power/toughness OR loyalty
  rarity: "common"|"uncommon"|"rare"|"mythic",
  colors: Array<"W"|"U"|"B"|"R"|"G">,
  types: string[],
  manaValue: number,
  monoColor: boolean,
  
  // Image data
  scryfallId: string, // identifiers.scryfallId
  multiverseId: string, // identifiers.multiverseId
  noGath: boolean, // Auto-set from: 'hasContentWarning'
  skipArt: boolean,

  // Double-faced card data
  faceName: string,
  side: "a"|"b"|null,
  otherFaceIds: string[], // ref: 'Card'
  
  // Alternate data (Variations + Printings)
  variations: string[], // ref: 'Card'
  printings: string[], // ref: 'Card'
}