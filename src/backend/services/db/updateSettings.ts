import { BulkData, BulkDataType } from 'types/scryfall.d';
import fetchJson from '../../libs/fetchJson';
import { setSettings } from '../../utils/db/settings.utils';

export type Settings = { [id: string]: any }

// -- Specialized getters/setters -- \\

const scryfallNames: { [type in BulkDataType]?: string } = { "default_cards": "image", "oracle_cards": "preferred" }

export async function updateScryfall({ id, type, download_uri, updated_at }: BulkData) {
    const name = scryfallNames[type] || "scryfall"
    await setSettings({
        [`meta.${name}.id`]: id,
        [`meta.${name}.date`]: new Date(updated_at),
        [`meta.${name}.url`]: download_uri,
        [`meta.${name}.timestamp`]: new Date(),
    })
}

export async function updateMtgJson(name: string, url: string) {
    await fetchJson(url, async (meta) => {
      if (!meta) return;
  
      await setSettings({
        [`meta.${name}.id`]: meta.version,
        [`meta.${name}.date`]: new Date(meta.date),
        [`meta.${name}.url`]: url,
        [`meta.${name}.timestamp`]: new Date(),
      })
    }, { jsonPath: "meta" })
}