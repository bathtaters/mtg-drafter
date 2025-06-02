import { BulkData, BulkDataType } from "types/scryfall.d";
import fetchJson from "../../libs/fetchJson";
import { setSettings, setSetting } from "../../utils/db/settings.utils";

export async function updateVersion(version: string, enableLog = false) {
  version = version.split(".").slice(0, -1).join(".");
  await setSetting("db.version", version);
  if (enableLog) console.log(`Set DB version to current (${version})`);
}

const scryfallNames: { [type in BulkDataType]?: string } = {
  default_cards: "image",
  oracle_cards: "preferred",
};

export async function updateScryfall({
  id,
  type,
  download_uri,
  updated_at,
}: BulkData) {
  const name = scryfallNames[type] || "scryfall";
  await setSettings({
    [`meta.${name}.id`]: id,
    [`meta.${name}.date`]: new Date(updated_at),
    [`meta.${name}.url`]: download_uri,
    [`meta.${name}.timestamp`]: new Date(),
  });
}

/** Names of Keys to treat as meta-data */
const mtgJsonKeys = ["version", "date"];
export const isMtgJsonKey = (key: string | number): key is string =>
  mtgJsonKeys.includes(key as any);

export async function updateMtgJson(
  name: string,
  key: string,
  value: any,
  url: string
) {
  if (key === "version") {
    await setSettings({
      [`meta.${name}.id`]: value,
      [`meta.${name}.url`]: url,
      [`meta.${name}.timestamp`]: new Date(),
    });
  } else if (key === "date") {
    await setSetting(`meta.${name}.date`, new Date(value));
  } else {
    console.error(
      ` >> WARNING -- Unknown meta-data found: ${name}.${key} = ${value}`
    );
  }
}
