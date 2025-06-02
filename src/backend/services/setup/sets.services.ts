import type { Card } from "@prisma/client";
import type { SetBooster, BoosterBasic } from "types/setup";
import prisma from "backend/libs/db";

export const getBoosterCode = (
  set: BoosterBasic["set"],
  boosterType: BoosterBasic["boosterType"]
) => `${set.code}:${boosterType}`;

export async function getFullSet(
  boosterCode: string /* setCode:boosterType */
): Promise<SetBooster | undefined> {
  const [setCode, boosterType] = boosterCode.split(":");

  const booster = await prisma.booster.findUnique({
    where: { boosterCode: { setCode, boosterType } },
    include: { set: true },
  });

  if (!booster?.setCode || !booster.data) return undefined;

  const boosterData = booster.data as SetBooster["data"];

  const ids = Object.values(boosterData.sheets).flatMap((sheet) =>
    Object.keys(sheet.cards)
  );

  const cards = await prisma.card
    .findMany({ where: { uuid: { in: ids } } })
    .then((cards) =>
      cards.reduce(
        (dict, card) => {
          dict[card.uuid] = card;
          return dict;
        },
        {} as Record<string, Card>
      )
    );

  return {
    ...booster,
    data: boosterData,
    cards,
  };
}
