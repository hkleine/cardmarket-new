import { findProduct } from "@/app/serverQueries";

export type CardSetInfo = {
  set_name: string;
  set_code: string;
  num_of_cards: number;
  tcg_date: string;
  set_image: string;
};

// Original card set object from the API
interface CardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
}

// Original card image object from the API
interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

// Original card price object from the API
interface CardPrice {
  cardmarket_price: string;
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  coolstuffinc_price: string;
}
export type RarityType =
  | "SSP"
  | "GGR"
  | "SPR"
  | "StR"
  | "SR"
  | "PG"
  | "MSR"
  | "UPR"
  | "UtR"
  | "R"
  | "ScR"
  | "UR"
  | "10000ScR"
  | "SFR"
  | "C"
  | "DUPR"
  | "GUR"
  | "DSPR"
  | "SHR"
  | "SP"
  | "DNPR"
  | "PIR"
  | "PScR"
  | "PS"
  | "UScR"
  | "CR"
  | "QCSE"
  | "DRPR"
  | "GR"
  | "GScR";

export type YugiohCard = Exclude<Awaited<ReturnType<typeof findProduct>>, null>;
