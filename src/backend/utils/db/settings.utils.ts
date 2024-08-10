import { DataType, Settings as DBSettings } from '@prisma/client'
import { BulkData, BulkDataType } from 'types/scryfall.d';
import prisma from '../../libs/db'
import fetchJson from '../../libs/fetchJson';

export type Settings = { [id: string]: any }

// -- Specialized getters/setters -- \\

const scryfallNames: { [type in BulkDataType]?: string } = { "default_cards": "image", "oracle_cards": "preferred" }

export async function updateScryfall({ id, type, download_uri, updated_at }: BulkData) {
    const name = scryfallNames[type] || "scryfall"
    await setSettings({
        [`meta.${name}.id`]: id,
        [`meta.${name}.date`]: updated_at,
        [`meta.${name}.url`]: download_uri,
        [`meta.${name}.timestamp`]: new Date(),
    })
}

export async function updateMtgJson(name: string, url: string) {
    await fetchJson(url, async (meta) => {
      if (!meta) return;
  
      await setSettings({
        [`meta.${name}.id`]: meta.version,
        [`meta.${name}.date`]: meta.date,
        [`meta.${name}.url`]: url,
        [`meta.${name}.timestamp`]: new Date(),
      })
    }, { jsonPath: "meta" })
}

// -- Simple Settings getters/setters -- \\

export async function getSettings(ids: string[]) {
    const data = await prisma.settings.findMany({ where: { id: { in: ids } } })
    return data.reduce(
        (sets, setting) => ({ ...sets, [setting.id]: toValue(setting) }),
        {} as Settings,
    )
}

export async function getSetting(id: string) {
    const setting = await prisma.settings.findFirst({ where: { id } })
    if (!setting) return null
    return toValue(setting)
}

export async function setSettings(settings: Settings) {
    const ids = Object.keys(settings) as string[]
    const data = Object.entries(settings).map(([id, value]) => ({ id, ...toSetting(value) }))
    await prisma.settings.deleteMany({ where: { id: { in: ids } } })
    return prisma.settings.createMany({ data })
}

export async function setSetting(id: string, value: any, type?: DataType) {
    const setting = { id, ...toSetting(value, type) }
    return prisma.settings.upsert({ where: { id }, update: setting, create: setting })
}

export async function deleteSettings(...ids: string[]) {
    return prisma.settings.deleteMany({ where: { id: { in: ids } } })
}

// --- SETTINGS CONFIG --- \\

const DateTypes: DataType[] = ["Date", "Timestamp", "DateList", "TimestampList"]

const typeMap: { [type: string]: DataType } = {
    "object": "JSON",
    "string": "String",
    "boolean": "Boolean",
    "number": "Number",
    "bigint": "Number",
    "undefined": "JSON",
}

// Get DataType from value
function dataType(value: any): DataType {
    if (Array.isArray(value)) {
        if (!value.length) return "StringList"
        if (Array.isArray(value[0])) return "JSON" // Nested Arrays

        const type = dataType(value[0])
        for (const entry of value.slice(1)) {
            if (dataType(entry) !== type) return "JSON" // Inconsistent types
        }
        return `${type}List` as DataType
    }

    if (value instanceof Date) return "Timestamp"
    return typeMap[typeof(value)]
}

function toValue({ value, type }: DBSettings): any {
    if (value === null) return null
    if (!DateTypes.includes(type)) return JSON.parse(value)
    if (!type.endsWith("List")) return new Date(JSON.parse(value))

    const dateList: string[] = JSON.parse(value)
    return dateList.map((entry) => new Date(entry))
}

function toSetting(value: any, type?: DataType): Omit<DBSettings, "id"> {
    if (value === null || value === undefined) {
        return { value: null, type: type || "JSON" }
    }
    return { value: JSON.stringify(value), type: type || dataType(value) }
}
