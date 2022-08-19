"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YOKAtlasAPI = void 0;
const yok_atlas_search_error_1 = require("./utils/yok-atlas-search-error");
const lisans_tercih_sihirbazi_1 = require("./services/searches/lisans-tercih-sihirbazi");
class YOKAtlasAPI {
    constructor() {
        this.previousSearchResults = [];
        this.failedSearchResults = [];
    }
    async searchLisansTercihSihirbazi(searchParamsConfig, searchIdentityConfig) {
        // Save search results to previous searches
        const _searchNameFromConfig = searchIdentityConfig
            ? searchIdentityConfig.searchName
            : null;
        const searchName = _searchNameFromConfig ||
            `search-${this.previousSearchResults.length + 1}-${Date.now()}`;
        try {
            const results = await (0, lisans_tercih_sihirbazi_1.searchLisansTercihSihirbazi)(searchParamsConfig);
            this.previousSearchResults.push({
                searchType: 'lisans-tercih-sihirbazi',
                details: {
                    name: searchName,
                    searchParams: searchParamsConfig,
                    searchResults: results,
                },
            });
            return results;
        }
        catch (error) {
            if (error instanceof yok_atlas_search_error_1.YokAtlasSearchError) {
                if (error.details.reason === 'post-process-failed') {
                    this.failedSearchResults.push({
                        searchType: 'lisans-tercih-sihirbazi',
                        failReason: 'post-process-failed',
                        details: {
                            name: searchName,
                            searchParams: searchParamsConfig,
                            searchResultRaw: error.details
                                .responseRaw,
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
exports.YOKAtlasAPI = YOKAtlasAPI;
exports.default = YOKAtlasAPI;
