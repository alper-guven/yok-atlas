import { ValueOf } from '../types/util';
import {
  Doluluk,
  OgretimTuru,
  UcretBurs,
  UniversiteTuru,
} from '../types/yok-atlas';

/**
 * A search result is actually an <Array consisting 45 entries>.
 *
 * Some of the entries are actually html and need to be parsed.
 *  ex: <br><font color='red'>---</font><br><font color='purple'>12</font><br><font color='blue'>7</font><br><font color='green'>7</font>
 *
 * Also some of the entries are actually numbers formatted as string and need to be parsed.
 *  ex: '12' or '---' or '12.222' or '12,222'
 *
 * Others are just strings, corresponds to values like City, Program Name, etc.
 *
 * In order to make the code more readable, I created a key value map for each entry.
 * We just consume it as an Array in code. No need to map it to a Record.
 */
export type SearchResultRecord = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  13: string;
  14: string;
  15: string;
  16: string;
  17: string;
  18: string;
  19: string;
  20: string;
  21: string;
  22: string;
  23: string;
  24: string;
  25: string;
  26: string;
  27: string;
  28: string;
  29: string;
  30: string;
  31: string;
  32: string;
  33: string;
  34: string;
  35: string;
  36: string;
  37: string;
  38: number;
  39: number;
  40: string;
  41: string;
  42: string;
  43: string;
  44: string;
};

/**
 * This is the mapping of a search result column indexes to a "custom" column names.
 */
const ResultColumnIndexCorrespondents = {
  0: 'x--0',
  1: 'yop_kodu',
  2: 'uni_ve_fakulte',
  3: 'fakulte_adi',
  4: 'bolum_adi',
  5: 'dil__burs__ogretim_suresi',
  6: 'sehir_adi',
  7: 'uni_turu',
  8: 'ucret_burs',
  9: 'ogretim_turu',

  10: 'kontenjan_sondan_1_yil',
  11: 'kontenjan_sondan_2_yil',
  12: 'kontenjan_sondan_3_yil',
  13: 'kontenjan_sondan_4_yil',

  14: 'doluluk',

  15: 'yerlesen_kisi_sayisi_sondan_1_yil',
  16: 'yerlesen_kisi_sayisi_sondan_2_yil',
  17: 'yerlesen_kisi_sayisi_sondan_3_yil',
  18: 'yerlesen_kisi_sayisi_sondan_4_yil',

  19: 'taban_basari_sirasi_sondan_1_yil',
  20: 'taban_basari_sirasi_sondan_2_yil',
  21: 'taban_basari_sirasi_sondan_3_yil',
  22: 'taban_basari_sirasi_sondan_4_yil',

  23: 'x--group-1-1',
  24: 'x--group-1-2',
  25: 'x--group-1-3',
  26: 'x--group-1-4',

  27: 'taban_puan_sondan_1_yil',
  28: 'taban_puan_sondan_2_yil',
  29: 'taban_puan_sondan_3_yil',
  30: 'taban_puan_sondan_4_yil',

  31: 'x--31',
  32: 'x--32',
  33: 'x--33',
  34: 'son_taban_puan',
  35: 'x--35',
  36: 'x--36',
  37: 'x--37',
  38: 'x--38',
  39: 'son_taban_basari_sirasi',

  40: 'x--40',

  41: 'uni_adi',
  42: 'program_adi',
  43: 'program_son_taban_basari_sirasi',

  44: 'x--44',
} as const;

export type SearchResultYOProgramInfo = {
  programKodu: string;
  universite: {
    ad: string;
    tur: 'KKTC' | 'Devlet' | 'Vakıf' | 'Yabancı';
    sehir: string;
  };
  program: {
    kod: string;
    puanTuru: 'say' | 'söz' | 'ea' | 'dil';
    fakulte: string;
    ad: string;
    ucretTuru:
      | '%25 indirimli'
      | '%50 indirimli'
      | '%75 indirimli'
      | 'AÖ_Ücretli'
      | 'Burslu'
      | 'UE_Ücretli'
      | 'Ücretli'
      | 'Ücretsiz'
      | 'İÖ_Ücretli';
    ogretimTuru: 'Açıköğretim' | 'Uzaktan' | 'Örgün' | 'İkinci';
    doluluk: 'Doldu' | 'Dolmadı' | 'Yeni';
  };
  yillaraGoreDegerler: Array<{
    yil: 2022 | 2021 | 2020 | 2019;
    yerlesenKisiSayisi: 'Dolmadı' | number | null;
    kontenjan: number | null;
    tabanBasariSirasi: number | 'Dolmadı' | null;
    tabanPuan: number | 'Dolmadı' | null;
  }>;
};

const parseTabanPuan = (
  virgulluPuan: '---' | 'Dolmadı' | `${string},${string}`
): SearchResultYOProgramInfo['yillaraGoreDegerler'][number]['tabanPuan'] => {
  if (virgulluPuan === '---') {
    return null;
  }

  if (virgulluPuan === 'Dolmadı') {
    return 'Dolmadı';
  }

  return parseFloat(virgulluPuan.replace(',', '.'));
};

const parseSiralama = (
  noktaliSiralama: '---' | 'Dolmadı' | `${string}.${string}`
): SearchResultYOProgramInfo['yillaraGoreDegerler'][number]['tabanBasariSirasi'] => {
  if (noktaliSiralama === '---') {
    return null;
  }

  if (noktaliSiralama === 'Dolmadı') {
    return 'Dolmadı';
  }

  return parseInt(noktaliSiralama.replace('.', ''));
};

const parseYerlesen = (
  yerlesen: `${number}` | '---'
): SearchResultYOProgramInfo['yillaraGoreDegerler'][number]['yerlesenKisiSayisi'] => {
  if (yerlesen === '---') {
    return null;
  }

  return parseInt(yerlesen.replace('.', ''));
};

const parseKontenjan = (
  kontenjan: '---' | 'Dolmadı' | `${string}.${string}`
): number | null => {
  if (kontenjan === '---') {
    return null;
  }

  return parseInt(kontenjan.replace('.', ''));
};

const ResultColumnIndexByName = Object.entries(
  ResultColumnIndexCorrespondents
).reduce(
  (acc, [key, value]) => ({ ...acc, [value.toString()]: Number(key) }),
  {} as Record<ValueOf<typeof ResultColumnIndexCorrespondents>, number>
);

const resultColumnNames = Object.keys(ResultColumnIndexByName) as Array<
  keyof typeof ResultColumnIndexByName
>;

type ResultColumnNamesUnion = typeof resultColumnNames[number];

type PostProccessed_Kontenjan = number | null;
type PostProccessed_YerlesenSayisi = 'Dolmadı' | number | null;
type PostProccessed_TabanPuan = 'Dolmadı' | number | null;
type PostProccessed_TabanBasariSirasi = 'Dolmadı' | number | null;

type PostProccessed_Customs = {
  yerlesen_kisi_sayisi_sondan_1_yil: PostProccessed_YerlesenSayisi;
  yerlesen_kisi_sayisi_sondan_2_yil: PostProccessed_YerlesenSayisi;
  yerlesen_kisi_sayisi_sondan_3_yil: PostProccessed_YerlesenSayisi;
  yerlesen_kisi_sayisi_sondan_4_yil: PostProccessed_YerlesenSayisi;

  taban_basari_sirasi_sondan_1_yil: PostProccessed_TabanBasariSirasi;
  taban_basari_sirasi_sondan_2_yil: PostProccessed_TabanBasariSirasi;
  taban_basari_sirasi_sondan_3_yil: PostProccessed_TabanBasariSirasi;
  taban_basari_sirasi_sondan_4_yil: PostProccessed_TabanBasariSirasi;

  taban_puan_sondan_1_yil: PostProccessed_TabanPuan;
  taban_puan_sondan_2_yil: PostProccessed_TabanPuan;
  taban_puan_sondan_3_yil: PostProccessed_TabanPuan;
  taban_puan_sondan_4_yil: PostProccessed_TabanPuan;

  kontenjan_sondan_1_yil: PostProccessed_Kontenjan;
  kontenjan_sondan_2_yil: PostProccessed_Kontenjan;
  kontenjan_sondan_3_yil: PostProccessed_Kontenjan;
  kontenjan_sondan_4_yil: PostProccessed_Kontenjan;

  uni_turu: UniversiteTuru;

  ucret_burs: UcretBurs;

  ogretim_turu: OgretimTuru;

  doluluk: Doluluk;
};

type PostProcessedSearchResult = {
  [key in Exclude<
    ResultColumnNamesUnion,
    keyof PostProccessed_Customs
  >]: string;
} & PostProccessed_Customs;

const postProcessConfig_TabanBasariSirasi = {
  validate: (value: unknown) => typeof value === 'string',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (value: string) => parseSiralama(value as any),
};

const postProcessConfig_YerlesenSayisi = {
  validate: (value: unknown) => typeof value === 'string',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (value: string) => parseYerlesen(value as any),
};

const postProcessConfig_TabanPuan = {
  validate: (value: unknown) => typeof value === 'string',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (value: string) => parseTabanPuan(value as any),
};

const postProcessConfig_Kontenjan = {
  validate: (value: unknown) => typeof value === 'string',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (value: string) => parseKontenjan(value as any),
};

// Api returns three of the columns with numbers as html so need to parse them.
// ex: <br><font color='red'>---</font><br><font color='purple'>12</font><br><font color='blue'>7</font><br><font color='green'>7</font>
const extractStandardNumberValue = (html: string) => {
  const yerlesenNumberMatches = html.match(/>[0-9]{1,3}|(---)?<\/font></);

  if (!yerlesenNumberMatches) return null;

  const yerlesenNumber = yerlesenNumberMatches[1];

  if (yerlesenNumber == null) return null;

  return yerlesenNumber;
};

interface PostProcessConfig<key extends keyof PostProcessedSearchResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractValuePrePostProcess?: (value: any) => any;
  validate?: (value: unknown) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (value: any) => PostProcessedSearchResult[key];
}

const ResultPostProcessors: {
  [key in Exclude<
    ResultColumnNamesUnion,
    keyof PostProccessed_Customs
  >]?: PostProcessConfig<key>;
} & {
  [key in keyof PostProccessed_Customs]: PostProcessConfig<key>;
} = {
  yop_kodu: {
    extractValuePrePostProcess: (html: string): string | null => {
      const yopkODUMatches = html.match(/javascript:listeyeEkle\(([0-9]+)\)/);

      if (!yopkODUMatches) return null;

      const yopkODU = yopkODUMatches[1];

      if (yopkODU == null) return null;

      return yopkODU;
    },
    validate: (value: unknown) => typeof value === 'string',
    transform: (value: string) => value,
  },

  uni_turu: {
    validate: (value: unknown) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ['KKTC', 'Devlet', 'Vakıf', 'Yabancı'].includes(value as any),
  },

  ucret_burs: {
    validate: (value: unknown) =>
      [
        '%25 indirimli',
        '%50 indirimli',
        '%75 indirimli',
        'AÖ_Ücretli',
        'Burslu',
        'UE_Ücretli',
        'Ücretli',
        'Ücretsiz',
        'İÖ_Ücretli',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ].includes(value as any),
  },

  ogretim_turu: {
    validate: (value: unknown) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ['Açıköğretim', 'Uzaktan', 'Örgün', 'İkinci'].includes(value as any),
  },

  doluluk: {
    validate: (value: unknown) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ['Doldu', 'Dolmadı', 'Yeni'].includes(value as any),
  },

  taban_basari_sirasi_sondan_1_yil: {
    extractValuePrePostProcess: extractStandardNumberValue,
    ...postProcessConfig_TabanBasariSirasi,
  },
  taban_basari_sirasi_sondan_2_yil: postProcessConfig_TabanBasariSirasi,
  taban_basari_sirasi_sondan_3_yil: postProcessConfig_TabanBasariSirasi,
  taban_basari_sirasi_sondan_4_yil: postProcessConfig_TabanBasariSirasi,

  yerlesen_kisi_sayisi_sondan_1_yil: {
    extractValuePrePostProcess: extractStandardNumberValue,
    ...postProcessConfig_YerlesenSayisi,
  },
  yerlesen_kisi_sayisi_sondan_2_yil: postProcessConfig_YerlesenSayisi,
  yerlesen_kisi_sayisi_sondan_3_yil: postProcessConfig_YerlesenSayisi,
  yerlesen_kisi_sayisi_sondan_4_yil: postProcessConfig_YerlesenSayisi,

  taban_puan_sondan_1_yil: {
    extractValuePrePostProcess: extractStandardNumberValue,
    ...postProcessConfig_TabanPuan,
  },
  taban_puan_sondan_2_yil: postProcessConfig_TabanPuan,
  taban_puan_sondan_3_yil: postProcessConfig_TabanPuan,
  taban_puan_sondan_4_yil: postProcessConfig_TabanPuan,

  kontenjan_sondan_1_yil: {
    extractValuePrePostProcess: (html: string) => {
      const kontenjanNumberMatches = html.match(/\d{0,1000}[+]\d{0,10}/);

      if (!kontenjanNumberMatches) return null;

      const kontenjanNumber = kontenjanNumberMatches[0];

      if (kontenjanNumber == null) return null;

      return kontenjanNumber;
    },
    ...postProcessConfig_Kontenjan,
  },
  kontenjan_sondan_2_yil: postProcessConfig_Kontenjan,
  kontenjan_sondan_3_yil: postProcessConfig_Kontenjan,
  kontenjan_sondan_4_yil: postProcessConfig_Kontenjan,
};

const createKeyValueMap = (record: SearchResultRecord) => {
  const keyValueMap = Object.entries(record).reduce((acc, [key, val]) => {
    const keyName =
      ResultColumnIndexCorrespondents[
        key as unknown as keyof typeof ResultColumnIndexCorrespondents
      ];

    acc[keyName] = val;
    return acc;
  }, {} as Record<ResultColumnNamesUnion, string | number | null>);

  return keyValueMap;
};

export class PostProcessError extends Error {
  stage: 'extraction' | 'validation' | 'transformation';
  details: {
    key: ResultColumnNamesUnion;
    value: unknown;
    reason: string;
  };

  constructor(
    reason: 'extraction' | 'validation' | 'transformation',
    details: {
      key: ResultColumnNamesUnion;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any;
      reason: string;
    }
  ) {
    super('Post processing failed.');
    this.name = 'PostProcessError';

    this.stage = reason;
    this.details = details;
  }
}

export const postProcessSearchResultRecord = (
  record: SearchResultRecord
): PostProcessedSearchResult => {
  const result = createKeyValueMap(record);

  for (const [key, postProcessCFG] of Object.entries(ResultPostProcessors)) {
    if (postProcessCFG == null) continue;

    if (postProcessCFG.extractValuePrePostProcess) {
      try {
        const extractionResult = postProcessCFG.extractValuePrePostProcess(
          result[key as keyof typeof result]
        );

        result[key as keyof typeof result] = extractionResult;
      } catch (error) {
        throw new PostProcessError('extraction', {
          key: key as keyof typeof ResultPostProcessors,
          value: result[key as keyof typeof result],
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    if (postProcessCFG.validate) {
      try {
        const isValid = postProcessCFG.validate(
          result[key as keyof typeof result]
        );

        if (isValid === false) {
          throw new PostProcessError('validation', {
            key: key as keyof typeof ResultPostProcessors,
            value: result[key as keyof typeof result],
            reason: 'Invalid value',
          });
        }
      } catch (error) {
        throw new PostProcessError('validation', {
          key: key as keyof typeof ResultPostProcessors,
          value: result[key as keyof typeof result],
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    if (postProcessCFG.transform) {
      try {
        const transformationResult = postProcessCFG.transform(
          result[key as keyof typeof result]
        );

        result[key as keyof typeof result] = transformationResult;
      } catch (error) {
        throw new PostProcessError('transformation', {
          key: key as keyof typeof ResultPostProcessors,
          value: result[key as keyof typeof result],
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  return result as PostProcessedSearchResult;
};
