import type { Prisma } from "@prisma/client";
import type { CardSet as JsonCard } from "../../../types/json";
import prisma from "../../libs/db";
import fetchJson from "../../libs/fetchJson";
import Batcher from "../../libs/Batcher";
import {
  adaptCardToDb,
  adaptFacesToDb,
  cardFilter,
} from "../../utils/db/card.utils";
import { isMtgJsonKey, updateMtgJson } from "./updateSettings";
import { ignoreScryfallBackIds } from "assets/urls";

export default async function updateCards(
  url: string,
  fullUpdate = false,
  enableLog = false,
  maxThreads = 1000,
  dbBatchSize = 5000,
  upsertTxLimit = 32000,
) {
  let existing: number | undefined;
  if (!fullUpdate) existing = await prisma.card.count();
  else {
    enableLog && console.log("Erasing All Cards");
    // TEMPORARY FIX UNTIL COCKRAOCH IMPLEMENTS DEFERRING CONSTRAINTS >> await prisma.card.deleteMany()
    await prisma.faceInCard.deleteMany();
    await prisma.$executeRaw`ALTER TABLE "GameCard" DROP CONSTRAINT IF EXISTS "GameCard_cardId_fkey";`;
    // TEMPORARY FIX END // NOTE: There is one more 'TEMPORARY FIX' at the end
    await prisma.card.deleteMany();
  }

  enableLog &&
    console.log(
      "Updating Cards",
      typeof existing === "number" ? `(${existing} exisiting)` : "",
    );
  enableLog && console.time("Cards");

  const cardUpdate = new Batcher(
    dbBatchSize,
    async (data: Prisma.CardCreateManyInput[]) => {
      await prisma.card.createMany({ data, skipDuplicates: !fullUpdate });
    },
  );
  const faceUpdate = new Batcher(
    2 * dbBatchSize,
    async (data: Prisma.FaceInCardCreateManyInput[]) => {
      await prisma.faceInCard.createMany({ data, skipDuplicates: !fullUpdate });
    },
  );

  const pendingFaces: Prisma.FaceInCardCreateManyInput[] = [];

  await fetchJson<JsonCard>(
    url,
    async (data, key) => {
      if (isMtgJsonKey(key)) return updateMtgJson("cards", key, data, url);
      if (!cardFilter(data)) return;

      await cardUpdate.add(adaptCardToDb(data));
      for (const face of adaptFacesToDb(data)) {
        pendingFaces.push(face); // Save for later due to potential FK issues
      }
    },
    { jsonPath: /^meta|^data/, maxThreads },
  );

  await cardUpdate.finish();

  for (const face of pendingFaces) {
    await faceUpdate.add(face);
  }
  await faceUpdate.finish();

  // Remove incorrect back IDs
  prisma.faceInCard.updateMany({
    where: { backImg: { in: ignoreScryfallBackIds } },
    data: { backImg: null },
  });

  // TEMPORARY FIX -- Can remove when above lines are removed
  //  Also, if this throws an error it is because an MTGJSON UUID has changed/disappeared.
  await prisma.$executeRaw`ALTER TABLE "GameCard" ADD CONSTRAINT IF NOT EXISTS "GameCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES public."Card"(uuid);`;

  enableLog && console.timeEnd("Cards");
  enableLog &&
    (await prisma.card
      .count()
      .then((c) => console.log("Added", c - (existing || 0), "/", c, "cards")));
}
