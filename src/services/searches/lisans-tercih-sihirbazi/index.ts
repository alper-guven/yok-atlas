import Joi from 'joi';
import { YokAtlasAPI } from '../../../config/yok-atlas-api';
import { YOK_ATLAS_ENDPOINTS } from '../../../config/yok-atlas-endpoints';
import { TurkiyeSehirIsimleri } from '../../../types/turkiye';
import {
  UniversiteTuru,
  UcretBurs,
  OgretimTuru,
  Doluluk,
  PuanTuru,
  YokAtlas_LisansTercihSihirbazi_SearchResult_Raw,
} from '../../../types/yok-atlas/lisans-tercih-sihirbazi';
import { YokAtlasSearchError } from '../../../utils/yok-atlas-search-error';
import {
  SearchResultYOProgramInfo,
  postProcessSearchResultRecord,
} from './process-search-result';

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

// type StandardColumnSearchQuery = typeof standardColumn;

export type YOKAtlasSearchParamsConfig = Partial<{
  YOPKodu: string;
  universiteAdi: string;
  programAdi: string;
  sehirAdi:
    | TurkiyeSehirIsimleri
    | Uppercase<TurkiyeSehirIsimleri>
    | Lowercase<TurkiyeSehirIsimleri>
    | `KKTC-${string}`;
  universiteTuru: UniversiteTuru;
  ucretBurs: UcretBurs;
  ogretimTuru: OgretimTuru;
  doluluk: Doluluk;
}> & {
  puanTuru: PuanTuru;
  genelArama?: {
    aramaMetni: string;
    isRegex?: boolean;
  };
};

const SearchParamsValidationSchema = Joi.object<YOKAtlasSearchParamsConfig>()
  .keys({
    // Optional column Params
    YOPKodu: Joi.string()
      .length(9)
      .regex(/^[0-9]{9}$/)
      .trim()
      .optional(),
    universiteAdi: Joi.string().trim().optional(),
    programAdi: Joi.string().trim().optional(),
    sehirAdi: Joi.string().trim().optional(),
    universiteTuru: Joi.string()
      .trim()
      .allow('KKTC', 'Devlet', 'Vakıf', 'Yabancı')
      .optional(),
    ucretBurs: Joi.string()
      .trim()
      .allow(
        '%25 indirimli',
        '%50 indirimli',
        '%75 indirimli',
        'AÖ_Ücretli',
        'Burslu',
        'UE_Ücretli',
        'Ücretli',
        'Ücretsiz',
        'İÖ_Ücretli'
      )
      .optional(),
    ogretimTuru: Joi.string()
      .trim()
      .allow('Açıköğretim', 'Uzaktan', 'Örgün', 'İkinci')
      .optional(),
    doluluk: Joi.string().trim().allow('Doldu', 'Dolmadı', 'Yeni').optional(),
    // Required column params
    puanTuru: Joi.string().trim().allow('say', 'söz', 'ea', 'dil').required(),
    // Optional non-column params
    genelArama: Joi.object()
      .keys({
        aramaMetni: Joi.string().trim().required(),
        isRegex: Joi.boolean().optional(),
      })
      .optional(),
  })
  .required();

type ConfigSearchParams = keyof YOKAtlasSearchParamsConfig;

const tercihSihirbaziSearchParamsColumnIndexes: Record<
  Exclude<ConfigSearchParams, 'puanTuru' | 'genelArama'>,
  number
> = {
  YOPKodu: 1,
  universiteAdi: 2,
  programAdi: 4,
  sehirAdi: 6,
  universiteTuru: 7,
  ucretBurs: 8,
  ogretimTuru: 9,
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

/**
 * * Actual work is done after here
 */

const validateSearchParams = (
  searchParams: YOKAtlasSearchParamsConfig
): YOKAtlasSearchParamsConfig => {
  const { error, value } = SearchParamsValidationSchema.validate(searchParams);

  if (error) {
    throw new YokAtlasSearchError({
      reason: 'request-config-validation-failed',
      error,
    });
  }

  return value;
};

const createSearchPayload = (
  searchParamsConfig: YOKAtlasSearchParamsConfig
) => {
  const defaultSearchColumnsParams = [...Array(45)].reduce(
    (acc: Record<string, string>, _, index) => {
      return {
        ...acc,
        ...generateDefaultSearchColumn(index),
      };
    },
    {} as Record<string, string>
  );

  const columns = new URLSearchParams({
    ...defaultSearchColumnsParams,
  } as const);

  // Destructure searchParamsConfig to separate non column search params
  const { genelArama, puanTuru, ...restOfSearchParamsConfig } =
    searchParamsConfig;

  // Fill search params with search params config
  for (const [key, value] of Object.entries(
    tercihSihirbaziSearchParamsColumnIndexes
  )) {
    const configValueForKey =
      restOfSearchParamsConfig[
        key as Exclude<ConfigSearchParams, 'genelArama' | 'puanTuru'>
      ];

    if (configValueForKey) {
      columns.set(`columns[${value}][search][value]`, configValueForKey);
    }
  }

  // Fill default non-column search params
  for (const key of Object.keys(defaultNonColumnSearchParams) as Array<
    keyof typeof defaultNonColumnSearchParams
  >) {
    columns.append(
      key,
      defaultNonColumnSearchParams[
        key as keyof typeof defaultNonColumnSearchParams
      ].toString()
    );
  }

  // Add puan turu to  non-column search params
  columns.append('puan_turu', puanTuru);

  if (genelArama) {
    let isRegex = 'false';

    if (genelArama.isRegex) {
      isRegex = genelArama.isRegex.toString();
    }

    columns.append('search[value]', genelArama.aramaMetni);
    columns.append('search[regex]', isRegex);
  }

  return columns;
};

const parseResults = (parseConfig: {
  rawSearchResult: YokAtlas_LisansTercihSihirbazi_SearchResult_Raw;
  searchParamsConfig: YOKAtlasSearchParamsConfig;
}): Array<SearchResultYOProgramInfo> => {
  const { rawSearchResult, searchParamsConfig } = parseConfig;

  try {
    return rawSearchResult.data.map((singleResultRecord) => {
      const processedRecord = postProcessSearchResultRecord(singleResultRecord);

      const parsedProgramInfo: SearchResultYOProgramInfo = {
        programKodu: processedRecord.yop_kodu,
        universite: {
          ad: processedRecord.uni_adi,
          tur: processedRecord.uni_turu,
          sehir: processedRecord.sehir_adi,
        },
        program: {
          kod: processedRecord.yop_kodu,
          puanTuru: searchParamsConfig['puanTuru'],
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
  } catch (error) {
    throw new YokAtlasSearchError({
      reason: 'post-process-failed',
      error,
      responseRaw: rawSearchResult,
    });
  }
};

const actuallySearch = async (urlSearchParams: URLSearchParams) => {
  return YokAtlasAPI.post<YokAtlas_LisansTercihSihirbazi_SearchResult_Raw>(
    YOK_ATLAS_ENDPOINTS.LisansTercihSihirbazi,
    urlSearchParams.toString(),
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
      throw new YokAtlasSearchError({
        reason: 'request-failed',
        error,
      });
    });
};

const responseBodyValidationSchema =
  Joi.object<YokAtlas_LisansTercihSihirbazi_SearchResult_Raw>({
    data: Joi.array().min(0).items(Joi.array().length(45)),
    draw: Joi.number().required(),
    recordsFiltered: Joi.number().required(),
    recordsTotal: Joi.number().required(),
  }).required();

const validateResponseBody = (responseBody: unknown) => {
  const { error } = responseBodyValidationSchema.validate(responseBody);

  if (error) {
    throw new YokAtlasSearchError({
      reason: 'response-validation-failed',
      responseRaw: responseBody,
      error,
    });
  }
};

export const searchLisansTercihSihirbazi = async (
  searchParamsConfig: YOKAtlasSearchParamsConfig
): Promise<Array<SearchResultYOProgramInfo>> => {
  const validatedSearchParamsConfig = validateSearchParams(searchParamsConfig);

  const config = createSearchPayload(validatedSearchParamsConfig);

  const searchResult = await actuallySearch(config);

  validateResponseBody(searchResult);

  const results = parseResults({
    rawSearchResult: searchResult,
    searchParamsConfig: searchParamsConfig,
  });

  return results;
};
