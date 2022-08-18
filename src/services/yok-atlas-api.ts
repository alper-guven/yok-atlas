import { YokAtlas_LisansTercihSihirbazi_SearchResult_Raw } from '../types/yok-atlas/lisans-tercih-sihirbazi';
import { YokAtlasSearchError } from '../utils/yok-atlas-search-error';
import {
  searchLisansTercihSihirbazi,
  YOKAtlasSearchParamsConfig,
} from './searches/lisans-tercih-sihirbazi';
import { SearchResultYOProgramInfo } from './searches/lisans-tercih-sihirbazi/process-search-result';

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
    searchResults: Array<SearchResultYOProgramInfo>;
  };
};

type YOKAtlasAPI_SearchResults_Union = PreviousSearchResult;

type FailedSearchResult = {
  searchType: 'lisans-tercih-sihirbazi';
  failReason: 'post-process-failed';
  details: {
    name: string;
    searchParams: YOKAtlasSearchParamsConfig;
    searchResultRaw: YokAtlas_LisansTercihSihirbazi_SearchResult_Raw;
  };
};

type YOKAtlasAPI_SearchResults_Failed_Union = FailedSearchResult;

class YOKAtlasAPI {
  previousSearchResults: Array<YOKAtlasAPI_SearchResults_Union> = [];
  failedSearchResults: Array<YOKAtlasAPI_SearchResults_Failed_Union> = [];

  async searchLisansTercihSihirbazi(
    searchParamsConfig: YOKAtlasSearchParamsConfig,
    searchIdentityConfig?: {
      searchName: string;
    }
  ): Promise<Array<SearchResultYOProgramInfo>> {
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
                .searchResultRaw as YokAtlas_LisansTercihSihirbazi_SearchResult_Raw,
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
