export enum Rarity {
	common,
	uncommon,
	rare,
	special,
	mythic,
	bonus,
}

export enum FrameEffect {
	legendary,
	miracle,
	nyxtouched,
	draft,
	devoid,
	tombstone,
	colorshifted,
	inverted,
	sunmoondfc,
	compasslanddfc,
	originpwdfc,
	mooneldrazidfc,
	moonreversemoondfc,
	showcase,
	extendedart,
}

export enum Game {
	paper,
	arena,
	mtgo,
}

export enum Legality {
	legal,
	not_legal,
	restricted,
	banned,
}

export enum Border {
	black,
	borderless,
	gold,
	silver,
	white,
}

export enum Layout {
	normal,
	split,
	flip,
	transform,
	modal_dfc,
	meld,
	leveler,
	saga,
	adventure,
	planar,
	scheme,
	vanguard,
	token,
	double_faced_token,
	emblem,
	augment,
	host,
	art_series,
	double_sided,
}

export enum Format {
	standard,
	future,
	historic,
	pioneer,
	modern,
	legacy,
	pauper,
	vintage,
	penny,
	commander,
	brawl,
	duel,
	oldschool,
}

export type Legalities = {
	[key in keyof typeof Format]: keyof typeof Legality;
};

export interface ImageUris {
	small: string;
	normal: string;
	large: string;
	png: string;
	art_crop: string;
	border_crop: string;
}

export interface Prices {
	usd?: string | null;
	usd_foil?: string | null;
	usd_etched?: string | null;
	eur?: string | null;
	eur_foil?: string | null;
	tix?: string | null;
}

export interface PurchaseUris {
	tcgplayer?: string | null;
	cardmarket?: string | null;
	cardhoarder?: string | null;
	[key: string]: string | null | undefined;
}

export interface RelatedUris {
	gatherer?: string | null;
	tcgplayer_decks?: string | null;
	tcgplayer_infinite_decks?: string | null;
	tcgplayer_infinite_articles?: string | null;
	edhrec?: string | null;
	mtgtop8?: string | null;
	[key: string]: string | null | undefined;
}

export enum RelatedCardComponent {
	token,
	meld_part,
	meld_result,
	combo_piece,
}

export interface RelatedCard {
	object: "related_card";

	id: string;
	component: keyof typeof RelatedCardComponent;
	name: string;
	type_line: string;
	uri: string;
}

export interface CardFace extends CardFaceMethods {
	object: "card_face";

	artist?: string | null;
	cmc?: number | null;
	color_indicator?: Color[] | null;
	colors?: Color[] | null;
	flavor_text?: string | null;
	illustration_id?: string | null;
	image_uris?: ImageUris | null;
	layout?: string;
	loyalty?: string | null;
	mana_cost?: string | null;
	name: string;
	oracle_id?: string | null;
	oracle_text?: string | null;
	power?: string | null;
	printed_name?: string | null;
	printed_text?: string | null;
	printed_type_line?: string | null;
	toughness?: string | null;
	type_line: string;
	watermark?: string | null;
}

export interface Preview {
	previewed_at?: string | null;
	source_uri?: string | null;
	source?: string | null;
}

export enum PromoType {
	tourney,
	prerelease,
	datestamped,
	planeswalkerdeck,
	buyabox,
	judgegift,
	event,
	convention,
	starterdeck,
	instore,
	setpromo,
	fnm,
	openhouse,
	league,
	draftweekend,
	gameday,
	release,
	intropack,
	giftbox,
	duels,
	wizardsplaynetwork,
	premiereshop,
	playerrewards,
	gateway,
	arenaleague
}

export enum CardFinish {
	foil,
	nonfoil,
	etched,
	glossy,
}

export const CardFrame = {
	"1993": 0,
	"1997": 1,
	"2003": 2,
	"2015": 3,
	"Future": 4,
}

export enum CardStatus {
	missing,
	placeholder,
	lowres,
	highres_scan,
}

export enum CardSecurityStamp {
	oval,
	triangle,
	acorn,
	arena,
}

export interface CardIdentifier {
	id?: string;
	mtgo_id?: number;
	multiverse_id?: number;
	oracle_id?: string;
	illustration_id?: string;
	name?: string;
	set?: string;
	collector_number?: string;
}

export type Modifier = `+${bigint}` | `-${bigint}`;

export interface Card extends CardFaceMethods {
	object: "card";

	// core fields
	arena_id?: number | null;
	id: string;
	lang: string;
	mtgo_id?: number | null;
	mtgo_foil_id?: number | null;
	multiverse_ids?: number[] | null;
	tcgplayer_id?: number | null;
	tcgplayer_etched_id?: number | null;
	cardmarket_id?: number | null;
	oracle_id: string;
	prints_search_uri: string;
	rulings_uri: string;
	scryfall_uri: string;
	uri: string;

	// gameplay fields
	all_parts?: RelatedCard[] | null;
	card_faces: CardFace[];
	cmc: number;
	color_identity: Color[];
	color_indicator?: Color[] | null;
	colors?: Color[] | null;
	edhrec_rank?: number | null;
	hand_modifier?: Modifier | null;
	keywords: string[];
	layout: keyof typeof Layout;
	legalities: Legalities;
	life_modifier?: Modifier | null;
	loyalty?: string | null;
	mana_cost?: string | null;
	name: string;
	oracle_text?: string | null;
	oversized: boolean;
	power?: string | null;
	produced_mana?: Color[] | null;
	reserved: boolean;
	toughness?: string | null;
	type_line: string;

	// print fields
	artist?: string | null;
	booster: boolean;
	border_color: keyof typeof Border;
	card_back_id: string;
	collector_number: string;
	content_warning?: boolean | null;
	digital: boolean;
	finishes: (keyof typeof CardFinish)[];
	flavor_name?: string | null;
	flavor_text?: string | null;
	/**
	 * Note: This may return other values, I can't check if the possible strings have changed because the Scryfall docs
	 * no longer list the possible frame effects.
	 */
	frame_effects?: (keyof typeof FrameEffect)[] | null;
	frame: keyof typeof CardFrame;
	full_art: boolean;
	games: (keyof typeof Game)[];
	highres_image: boolean;
	illustration_id?: string | null;
	image_status: keyof typeof CardStatus;
	image_uris?: ImageUris | null;
	prices: Prices;
	printed_name?: string | null;
	printed_text?: string | null;
	printed_type_line?: string | null;
	promo: boolean;
	promo_types?: (keyof typeof PromoType)[] | null;
	purchase_uris: PurchaseUris;
	rarity: keyof typeof Rarity;
	related_uris: RelatedUris;
	released_at: string;
	reprint: boolean;
	scryfall_set_uri: string;
	set_name: string;
	set_search_uri: string;
	set_type: Set["set_type"];
	set_uri: string;
	set: string;
	set_id: string;
	story_spotlight: boolean;
	textless: boolean;
	variation: boolean;
	variation_of?: string | null;
	security_stamp?: (keyof typeof CardSecurityStamp)[] | null;
	watermark?: string | null;
	preview?: Preview | null;
}





enum BulkDataTypes {
	oracle_cards,
	unique_artwork,
	default_cards,
	all_cards,
	rulings,
}

export type BulkDataType = keyof typeof BulkDataTypes;

export interface BulkData {
	object: "bulk_data";

	id: string;
	type: BulkDataType;
	updated_at: string;
	uri: string;
	name: string;
	description: string;
	compressed_size: number;
	download_uri: string;
	content_type: string;
	content_encoding: string;
}