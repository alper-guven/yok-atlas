import axios from 'axios';
import { YOK_ATLAS_ENDPOINTS } from '../config/yok-atlas-endpoints';
import { ValueOf } from '../types/util';

const YokAtlasAPI = axios.create({
  baseURL: 'https://yokatlas.yok.gov.tr',
  timeout: 10_000,
});

// const getLisansPanelInstance = (year: 2019 | 2020 | 2021) => {
//   return axios.create({
//     url: `https://yokatlas.yok.gov.tr/${year}/lisans-panel.php`,
//     timeout: 10_000,
//   });
// };

const generateDefaultSearchColumn = (index: number) => {
  const keyNames = {
    data: `columns[${index}][data]`,
    name: `columns[${index}][name]`,
    searchable: `columns[${index}][searchable]`,
    orderable: `columns[${index}][orderable]`,
    search: `columns[${index}][search][value]`,
    regex: `columns[${index}][search][regex]`,
  };

  const searchColumn = {
    [keyNames.data]: index,
    [keyNames.name]: '',
    [keyNames.searchable]: true,
    [keyNames.orderable]: false,
    [keyNames.search]: '',
    [keyNames.regex]: false,
  };

  return searchColumn;
};

type SearchResultYOProgramInfo = {
  universite: {
    ad: string;
    tur: 'KKTC' | 'Devlet' | 'Vakıf' | 'Yabancı';
    sehir: string;
  };
  program: {
    kod: string;
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

const ResultColumnIndexCorrespondants = {
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

  uni_turu: 'KKTC' | 'Devlet' | 'Vakıf' | 'Yabancı';

  ucret_burs:
    | '%25 indirimli'
    | '%50 indirimli'
    | '%75 indirimli'
    | 'AÖ_Ücretli'
    | 'Burslu'
    | 'UE_Ücretli'
    | 'Ücretli'
    | 'Ücretsiz'
    | 'İÖ_Ücretli';

  ogretim_turu: 'Açıköğretim' | 'Uzaktan' | 'Örgün' | 'İkinci';

  doluluk: 'Doldu' | 'Dolmadı' | 'Yeni';
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
      ResultColumnIndexCorrespondants[
        key as unknown as keyof typeof ResultColumnIndexCorrespondants
      ];

    acc[keyName] = val;
    return acc;
  }, {} as Record<ResultColumnNamesUnion, string | number | null>);

  return keyValueMap;
};

const postProcessSearchResultRecord = (
  record: SearchResultRecord
): PostProcessedSearchResult => {
  const result = createKeyValueMap(record);

  for (const [key, postProcessCFG] of Object.entries(ResultPostProcessors)) {
    if (postProcessCFG == null) continue;

    if (postProcessCFG.extractValuePrePostProcess) {
      const extractionResult = postProcessCFG.extractValuePrePostProcess(
        result[key as keyof typeof result]
      );

      result[key as keyof typeof result] = extractionResult;
    }

    if (postProcessCFG.validate) {
      const validationResult = postProcessCFG.validate(
        result[key as keyof typeof result]
      );

      if (!validationResult) {
        throw new Error(`Validation of <${key}> failed`);
      }
    }

    if (postProcessCFG.transform) {
      const transformationResult = postProcessCFG.transform(
        result[key as keyof typeof result]
      );

      result[key as keyof typeof result] = transformationResult;
    }
  }

  return result as PostProcessedSearchResult;
};

const ResultColumnIndexByName = Object.entries(
  ResultColumnIndexCorrespondants
).reduce(
  (acc, [key, value]) => ({ ...acc, [value.toString()]: Number(key) }),
  {} as Record<ValueOf<typeof ResultColumnIndexCorrespondants>, number>
);

const resultColumnNames = Object.keys(ResultColumnIndexByName) as Array<
  keyof typeof ResultColumnIndexByName
>;

type ResultColumnNamesUnion = typeof resultColumnNames[number];

type SearchResultRecord = {
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

// type StandardColumnSearchQuery = typeof standardColumn;

export type YOKAtlasSearchParamsConfig = Partial<{
  yop_kodu: string;
  uni_adi: string;
  program_adi: string;
  sehir_adi: string;
  universite_turu: string;
  ucret_burs: string;
  ogretim_turu: string;
  doluluk: string;
}>;

type ConfigSearchParams = keyof YOKAtlasSearchParamsConfig;

const columnIndexes: Record<ConfigSearchParams, number> = {
  yop_kodu: 1,
  uni_adi: 2,
  program_adi: 4,
  sehir_adi: 6,
  universite_turu: 7,
  ucret_burs: 8,
  ogretim_turu: 9,
  doluluk: 14,
} as const;

const defaultNonColumnSearchParams = {
  draw: 1,
  start: 0,
  length: 10,
  search: 1,
  puan_turu: 'say',
  ust_bs: 0,
  alt_bs: 3000000,
  yeniler: 1,
  'search[value]': '',
  'search[regex]': false,
} as const;

class YOKAtlasAPI {
  columns: URLSearchParams;

  constructor(searchParamsConfig: YOKAtlasSearchParamsConfig) {
    // this.columns = new URLSearchParams(columnData[0]);

    const defaultSearchColumnsParams = [...Array(45)].reduce(
      (acc: Record<string, string>, _, index) => {
        return {
          ...acc,
          ...generateDefaultSearchColumn(index),
        };
      },
      {} as Record<string, string>
    );

    this.columns = new URLSearchParams({
      ...defaultSearchColumnsParams,
    } as const);

    // Object.keys(columnVars).forEach((key) => {
    //   if (_[key]) {
    //     this.columns.set(`columns[${columnVars[key]}][search][value]`, _[key]);
    //   }
    // });

    // Fill search params with search params config
    for (const [key, value] of Object.entries(columnIndexes)) {
      const configValueForKey = searchParamsConfig[key as ConfigSearchParams];

      if (configValueForKey) {
        this.columns.set(`columns[${value}][search][value]`, configValueForKey);
      }
    }

    Object.keys(defaultNonColumnSearchParams).forEach((key) => {
      const configValueForKey = searchParamsConfig[key as ConfigSearchParams];

      if (!configValueForKey)
        return this.columns.append(
          key,
          defaultNonColumnSearchParams[
            key as keyof typeof defaultNonColumnSearchParams
          ].toString()
        );

      if (key === 'puan_turu') {
        if (
          configValueForKey === 'dil' ||
          configValueForKey === 'ea' ||
          configValueForKey === 'söz' ||
          configValueForKey === 'say'
        ) {
          this.columns.append(key, configValueForKey);
        } else {
          this.columns.append(key, defaultNonColumnSearchParams[key]);
        }
        return;
      }

      if (key === 'search') {
        this.columns.append(
          'search[value]',
          configValueForKey ? configValueForKey : ''
        );
        this.columns.append('search[regex]', 'false');
        return;
      }

      this.columns.append(key, configValueForKey);
    });
  }

  parseResults({
    data,
  }: {
    data: Array<SearchResultRecord>;
  }): Array<SearchResultYOProgramInfo> {
    return data.map((e) => {
      const processedRecord = postProcessSearchResultRecord(e);

      const parsedProgramInfo: SearchResultYOProgramInfo = {
        universite: {
          ad: processedRecord.uni_adi,
          tur: processedRecord.uni_turu,
          sehir: processedRecord.sehir_adi,
        },
        program: {
          kod: processedRecord.yop_kodu,
          fakulte: processedRecord.fakulte_adi,
          ad: processedRecord.program_adi,
          ucretTuru: processedRecord.ucret_burs,
          ogretimTuru: processedRecord.ogretim_turu,
          doluluk: processedRecord.doluluk,
        },
        yillaraGoreDegerler: [
          {
            yil: 2019,
            kontenjan: processedRecord.kontenjan_sondan_4_yil,
            tabanBasariSirasi: processedRecord.taban_basari_sirasi_sondan_4_yil,
            tabanPuan: processedRecord.taban_puan_sondan_4_yil,
            yerlesenKisiSayisi:
              processedRecord.yerlesen_kisi_sayisi_sondan_4_yil,
          },
          {
            yil: 2020,
            kontenjan: processedRecord.kontenjan_sondan_3_yil,
            tabanBasariSirasi: processedRecord.taban_basari_sirasi_sondan_3_yil,
            tabanPuan: processedRecord.taban_puan_sondan_3_yil,
            yerlesenKisiSayisi:
              processedRecord.yerlesen_kisi_sayisi_sondan_3_yil,
          },
          {
            yil: 2021,
            kontenjan: processedRecord.kontenjan_sondan_2_yil,
            tabanBasariSirasi: processedRecord.taban_basari_sirasi_sondan_2_yil,
            tabanPuan: processedRecord.taban_puan_sondan_2_yil,
            yerlesenKisiSayisi:
              processedRecord.yerlesen_kisi_sayisi_sondan_2_yil,
          },
          {
            yil: 2022,
            kontenjan: processedRecord.kontenjan_sondan_1_yil,
            tabanBasariSirasi: processedRecord.taban_basari_sirasi_sondan_1_yil,
            tabanPuan: processedRecord.taban_puan_sondan_1_yil,
            yerlesenKisiSayisi:
              processedRecord.yerlesen_kisi_sayisi_sondan_1_yil,
          },
        ],
      };

      return parsedProgramInfo;
    });
  }

  private async actuallySearch() {
    return YokAtlasAPI.post<{ data: Array<SearchResultRecord> }>(
      YOK_ATLAS_ENDPOINTS.LisansTercihSihirbazi,
      this.columns.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      }
    )
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.headers);
            console.log(error.response.data);
          }
        }

        throw error;
      });
  }

  async search() {
    const data = await this.actuallySearch();
    const results = this.parseResults(data);
    return results;
  }
}

export default YOKAtlasAPI;
