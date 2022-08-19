import { YokAtlas_LisansTercihSihirbazi_SearchResult_Raw } from './types/yok-atlas/lisans-tercih-sihirbazi';
import { YOKAtlasSearchParamsConfig } from './services/searches/lisans-tercih-sihirbazi';
import { SearchResultYOProgramInfo } from './services/searches/lisans-tercih-sihirbazi/process-search-result';
declare type PreviousSearchResult = {
    searchType: 'lisans-tercih-sihirbazi';
    details: {
        name: string;
        searchParams: YOKAtlasSearchParamsConfig;
        searchResults: Array<SearchResultYOProgramInfo>;
    };
};
declare type YOKAtlasAPI_SearchResults_Union = PreviousSearchResult;
declare type FailedSearchResult = {
    searchType: 'lisans-tercih-sihirbazi';
    failReason: 'post-process-failed';
    details: {
        name: string;
        searchParams: YOKAtlasSearchParamsConfig;
        searchResultRaw: YokAtlas_LisansTercihSihirbazi_SearchResult_Raw;
    };
} | {
    searchType: 'lisans-tercih-sihirbazi';
    failReason: 'response-validation-failed';
    details: {
        name: string;
        searchParams: YOKAtlasSearchParamsConfig;
        searchResultRaw: unknown;
    };
};
declare type YOKAtlasAPI_SearchResults_Failed_Union = FailedSearchResult;
export declare class YOKAtlasAPI {
    previousSearchResults: Array<YOKAtlasAPI_SearchResults_Union>;
    failedSearchResults: Array<YOKAtlasAPI_SearchResults_Failed_Union>;
    searchLisansTercihSihirbazi(searchParamsConfig: YOKAtlasSearchParamsConfig, searchIdentityConfig?: {
        searchName: string;
    }): Promise<Array<SearchResultYOProgramInfo>>;
}
export default YOKAtlasAPI;
