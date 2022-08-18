import axios from 'axios';
import { YOK_ATLAS_ENDPOINTS } from '../config/yok-atlas-endpoints';
import { TurkiyeSehirIsimleri } from '../types/turkiye';
import {
  Doluluk,
  OgretimTuru,
  PuanTuru,
  UcretBurs,
  UniversiteTuru,
} from '../types/yok-atlas';
import {
  SearchResultYOProgramInfo,
  postProcessSearchResultRecord,
  SearchResultRecord,
  PostProcessError,
} from './process-search-result';
import Joi from 'joi';

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

// type StandardColumnSearchQuery = typeof standardColumn;

export type YOKAtlasSearchParamsConfig = Partial<{
  yop_kodu: string;
  uni_adi: string;
  program_adi: string;
  sehir_adi:
    | TurkiyeSehirIsimleri
    | Uppercase<TurkiyeSehirIsimleri>
    | Lowercase<TurkiyeSehirIsimleri>
    | `KKTC-${string}`;
  universite_turu: UniversiteTuru;
  ucret_burs: UcretBurs;
  ogretim_turu: OgretimTuru;
  doluluk: Doluluk;
}> & {
  puan_turu: PuanTuru;
};

const SearchParamsValidationSchema = Joi.object<YOKAtlasSearchParamsConfig>()
  .keys({
    // Optional Params
    yop_kodu: Joi.string().optional(),
    uni_adi: Joi.string().optional(),
    program_adi: Joi.string().optional(),
    sehir_adi: Joi.string().optional(),
    universite_turu: Joi.string().optional(),
    ucret_burs: Joi.string().optional(),
    ogretim_turu: Joi.string().optional(),
    doluluk: Joi.string().optional(),
    // Required params
    puan_turu: Joi.string().required(),
  })
  .required();

type ConfigSearchParams = keyof YOKAtlasSearchParamsConfig;

const columnIndexes: Record<
  Exclude<ConfigSearchParams, 'puan_turu'>,
  number
> = {
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

interface YokAtlas_LisansTercihSihirbazi_SearchResult {
  data: Array<SearchResultRecord>;
}

type PreviousSearchResult = {
  searchType: 'lisans-tercih-sihirbazi';
  details: {
    name: string;
    searchParams: YOKAtlasSearchParamsConfig;
    searchResults: Array<SearchResultYOProgramInfo>;
  };
};

type YOKAtlasAPI_SearchResults_Union = PreviousSearchResult;

type FailedSearchResult = {
  searchType: 'lisans-tercih-sihirbazi';
  failReason: 'request-failed' | 'post-process-failed';
  details: {
    name: string;
    searchParams: YOKAtlasSearchParamsConfig;
    searchResult: YokAtlas_LisansTercihSihirbazi_SearchResult | null;
  };
};

type YOKAtlasAPI_SearchResults_Failed_Union = FailedSearchResult;

class YOKAtlasAPI {
  previousSearchResults: Array<YOKAtlasAPI_SearchResults_Union> = [];
  failedSearchResults: Array<YOKAtlasAPI_SearchResults_Failed_Union> = [];

  private validateSearchParams(
    searchParams: YOKAtlasSearchParamsConfig
  ): YOKAtlasSearchParamsConfig {
    const { error, value } =
      SearchParamsValidationSchema.validate(searchParams);

    if (error) {
      throw new Error(error.message);
    }

    return value;
  }

  private createSearchPayload(searchParamsConfig: YOKAtlasSearchParamsConfig) {
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

    columns.set('puan_turu', searchParamsConfig.puan_turu);

    // Fill search params with search params config
    for (const [key, value] of Object.entries(columnIndexes)) {
      const configValueForKey = searchParamsConfig[key as ConfigSearchParams];

      if (configValueForKey) {
        columns.set(`columns[${value}][search][value]`, configValueForKey);
      }
    }

    for (const key of Object.keys(defaultNonColumnSearchParams) as Array<
      keyof typeof defaultNonColumnSearchParams
    >) {
      const configValueForKey = searchParamsConfig[key as ConfigSearchParams];

      if (!configValueForKey) {
        columns.append(
          key,
          defaultNonColumnSearchParams[
            key as keyof typeof defaultNonColumnSearchParams
          ].toString()
        );

        continue;
      }

      if (key === 'puan_turu') {
        columns.append(key, configValueForKey);
        continue;
      }

      if (key === 'search') {
        columns.append('search[value]', configValueForKey || '');
        columns.append('search[regex]', 'false');
        continue;
      }

      columns.append(key, configValueForKey);
    }

    return columns;
  }

  private parseResults(parseConfig: {
    data: Array<SearchResultRecord>;
    searchParamsConfig: YOKAtlasSearchParamsConfig;
  }): Array<SearchResultYOProgramInfo> {
    const { data, searchParamsConfig } = parseConfig;

    return data.map((e) => {
      const processedRecord = postProcessSearchResultRecord(e);

      const parsedProgramInfo: SearchResultYOProgramInfo = {
        programKodu: processedRecord.yop_kodu,
        universite: {
          ad: processedRecord.uni_adi,
          tur: processedRecord.uni_turu,
          sehir: processedRecord.sehir_adi,
        },
        program: {
          kod: processedRecord.yop_kodu,
          puanTuru: searchParamsConfig['puan_turu'],
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

  private async actuallySearch(urlSearchParams: URLSearchParams) {
    return YokAtlasAPI.post<YokAtlas_LisansTercihSihirbazi_SearchResult>(
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

  async searchLisansTercihSihirbazi(
    searchParamsConfig: YOKAtlasSearchParamsConfig,
    searchIdentityConfig?: {
      searchName: string;
    }
  ): Promise<Array<SearchResultYOProgramInfo>> {
    // Save search results to previous searches
    const _searchName = searchIdentityConfig
      ? searchIdentityConfig.searchName
      : null;

    const searchName =
      _searchName ||
      `search-${this.previousSearchResults.length + 1}-${Date.now()}`;

    let searchResult: YokAtlas_LisansTercihSihirbazi_SearchResult | null = null;

    try {
      const validatedSearchParamsConfig =
        this.validateSearchParams(searchParamsConfig);

      const config = this.createSearchPayload(validatedSearchParamsConfig);

      searchResult = await this.actuallySearch(config).catch((error) => {
        this.failedSearchResults.push({
          searchType: 'lisans-tercih-sihirbazi',
          failReason: 'request-failed',
          details: {
            name: searchName,
            searchParams: searchParamsConfig,
            searchResult: null,
          },
        });

        throw error;
      });

      const results = this.parseResults({
        data: searchResult.data,
        searchParamsConfig: searchParamsConfig,
      });

      this.previousSearchResults.push({
        searchType: 'lisans-tercih-sihirbazi',
        details: {
          name: searchName,
          searchParams: searchParamsConfig,
          searchResults: results,
        },
      });

      return results;
    } catch (error) {
      if (error instanceof PostProcessError && searchResult) {
        this.failedSearchResults.push({
          searchType: 'lisans-tercih-sihirbazi',
          failReason: 'post-process-failed',
          details: {
            name: searchName,
            searchParams: searchParamsConfig,
            searchResult: searchResult,
          },
        });

        throw error;
      }

      throw error;
    }
  }
}

export default YOKAtlasAPI;
