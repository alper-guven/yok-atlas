import { YokAtlas_LisansTercihSihirbazi_SearchResult_Raw } from './types/yok-atlas/lisans-tercih-sihirbazi';
import { YokAtlasSearchError } from './utils/yok-atlas-search-error';
import {
  searchLisansTercihSihirbazi,
  YOKAtlasSearchParamsConfig,
} from './services/searches/lisans-tercih-sihirbazi';
import { LisansTercihSearchResultRecord } from './services/searches/lisans-tercih-sihirbazi/process-search-result';

// * Export Lisans Tercih Sihirbazi search result types
export { LisansTercihSearchResults } from './services/searches/lisans-tercih-sihirbazi';
export { LisansTercihSearchResultRecord } from './services/searches/lisans-tercih-sihirbazi/process-search-result';

// const getLisansPanelInstance = (year: 2019 | 2020 | 2021) => {
//   return axios.create({
//     url: `https://yokatlas.yok.gov.tr/${year}/lisans-panel.php`,
//     timeout: 10_000,
//   });
// };

type PreviousSearchResult = {
  searchType: 'lisans-tercih-sihirbazi';
  details: {
    name: string;
    searchParams: YOKAtlasSearchParamsConfig;
    searchResults: Array<LisansTercihSearchResultRecord>;
  };
};

type YOKAtlasAPI_SearchResults_Union = PreviousSearchResult;

type FailedSearchResult =
  | {
      searchType: 'lisans-tercih-sihirbazi';
      failReason: 'post-process-failed';
      details: {
        name: string;
        searchParams: YOKAtlasSearchParamsConfig;
        searchResultRaw: YokAtlas_LisansTercihSihirbazi_SearchResult_Raw;
      };
    }
  | {
      searchType: 'lisans-tercih-sihirbazi';
      failReason: 'response-validation-failed';
      details: {
        name: string;
        searchParams: YOKAtlasSearchParamsConfig;
        searchResultRaw: unknown;
      };
    };

type YOKAtlasAPI_SearchResults_Failed_Union = FailedSearchResult;

export class YOKAtlasAPI {
  previousSearchResults: Array<YOKAtlasAPI_SearchResults_Union> = [];
  failedSearchResults: Array<YOKAtlasAPI_SearchResults_Failed_Union> = [];

  async searchLisansTercihSihirbazi(
    searchParamsConfig: YOKAtlasSearchParamsConfig,
    searchIdentityConfig?: {
      searchName: string;
    }
  ): Promise<Array<LisansTercihSearchResultRecord>> {
    // Save search results to previous searches
    const _searchNameFromConfig = searchIdentityConfig
      ? searchIdentityConfig.searchName
      : null;

    const searchName =
      _searchNameFromConfig ||
      `search-${this.previousSearchResults.length + 1}-${Date.now()}`;

    try {
      const results = await searchLisansTercihSihirbazi(searchParamsConfig);

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
      if (error instanceof YokAtlasSearchError) {
        if (error.details.reason === 'post-process-failed') {
          this.failedSearchResults.push({
            searchType: 'lisans-tercih-sihirbazi',
            failReason: 'post-process-failed',
            details: {
              name: searchName,
              searchParams: searchParamsConfig,
              searchResultRaw: error.details
                .responseRaw as YokAtlas_LisansTercihSihirbazi_SearchResult_Raw,
            },
          });

          throw error;
        }

        if (error.details.reason === 'response-validation-failed') {
          this.failedSearchResults.push({
            searchType: 'lisans-tercih-sihirbazi',
            failReason: 'response-validation-failed',
            details: {
              name: searchName,
              searchParams: searchParamsConfig,
              searchResultRaw: error.details.responseRaw,
            },
          });

          throw error;
        }
      }

      throw error;
    }
  }
}

export default YOKAtlasAPI;
