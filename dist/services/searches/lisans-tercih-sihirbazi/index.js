"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLisansTercihSihirbazi = void 0;
const joi_1 = __importDefault(require("joi"));
const yok_atlas_api_1 = require("../../../config/yok-atlas-api");
const yok_atlas_endpoints_1 = require("../../../config/yok-atlas-endpoints");
const yok_atlas_search_error_1 = require("../../../utils/yok-atlas-search-error");
const process_search_result_1 = require("./process-search-result");
const generateDefaultSearchColumn = (index) => {
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
const SearchParamsValidationSchema = joi_1.default.object()
    .keys({
    // Optional column Params
    YOPKodu: joi_1.default.string()
        .length(9)
        .regex(/^[0-9]{9}$/)
        .trim()
        .optional(),
    universiteAdi: joi_1.default.string().trim().optional(),
    programAdi: joi_1.default.string().trim().optional(),
    sehirAdi: joi_1.default.string().trim().optional(),
    universiteTuru: joi_1.default.string()
        .trim()
        .allow('KKTC', 'Devlet', 'Vakıf', 'Yabancı')
        .optional(),
    ucretBurs: joi_1.default.string()
        .trim()
        .allow('%25 indirimli', '%50 indirimli', '%75 indirimli', 'AÖ_Ücretli', 'Burslu', 'UE_Ücretli', 'Ücretli', 'Ücretsiz', 'İÖ_Ücretli')
        .optional(),
    ogretimTuru: joi_1.default.string()
        .trim()
        .allow('Açıköğretim', 'Uzaktan', 'Örgün', 'İkinci')
        .optional(),
    doluluk: joi_1.default.string().trim().allow('Doldu', 'Dolmadı', 'Yeni').optional(),
    // Required column params
    puanTuru: joi_1.default.string().trim().allow('say', 'söz', 'ea', 'dil').required(),
    // Optional non-column params
    genelArama: joi_1.default.object()
        .keys({
        aramaMetni: joi_1.default.string().trim().required(),
        isRegex: joi_1.default.boolean().optional(),
    })
        .optional(),
})
    .required();
const tercihSihirbaziSearchParamsColumnIndexes = {
    YOPKodu: 1,
    universiteAdi: 2,
    programAdi: 4,
    sehirAdi: 6,
    universiteTuru: 7,
    ucretBurs: 8,
    ogretimTuru: 9,
    doluluk: 14,
};
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
};
/**
 * * Actual work is done after here
 */
const validateSearchParams = (searchParams) => {
    const { error, value } = SearchParamsValidationSchema.validate(searchParams);
    if (error) {
        throw new yok_atlas_search_error_1.YokAtlasSearchError({
            reason: 'request-config-validation-failed',
            error,
        });
    }
    return value;
};
const createSearchPayload = (searchParamsConfig) => {
    const defaultSearchColumnsParams = [...Array(45)].reduce((acc, _, index) => {
        return Object.assign(Object.assign({}, acc), generateDefaultSearchColumn(index));
    }, {});
    const columns = new URLSearchParams(Object.assign({}, defaultSearchColumnsParams));
    // Destructure searchParamsConfig to separate non column search params
    const { genelArama, puanTuru } = searchParamsConfig, restOfSearchParamsConfig = __rest(searchParamsConfig, ["genelArama", "puanTuru"]);
    // Fill search params with search params config
    for (const [key, value] of Object.entries(tercihSihirbaziSearchParamsColumnIndexes)) {
        const configValueForKey = restOfSearchParamsConfig[key];
        if (configValueForKey) {
            columns.set(`columns[${value}][search][value]`, configValueForKey);
        }
    }
    // Fill default non-column search params
    for (const key of Object.keys(defaultNonColumnSearchParams)) {
        columns.append(key, defaultNonColumnSearchParams[key].toString());
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
const parseResults = (parseConfig) => {
    const { rawSearchResult, searchParamsConfig } = parseConfig;
    try {
        return rawSearchResult.data.map((singleResultRecord) => {
            const processedRecord = (0, process_search_result_1.postProcessSearchResultRecord)(singleResultRecord);
            const parsedProgramInfo = {
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
                        yerlesenKisiSayisi: processedRecord.yerlesen_kisi_sayisi_sondan_4_yil,
                    },
                    {
                        yil: 2020,
                        kontenjan: processedRecord.kontenjan_sondan_3_yil,
                        tabanBasariSirasi: processedRecord.taban_basari_sirasi_sondan_3_yil,
                        tabanPuan: processedRecord.taban_puan_sondan_3_yil,
                        yerlesenKisiSayisi: processedRecord.yerlesen_kisi_sayisi_sondan_3_yil,
                    },
                    {
                        yil: 2021,
                        kontenjan: processedRecord.kontenjan_sondan_2_yil,
                        tabanBasariSirasi: processedRecord.taban_basari_sirasi_sondan_2_yil,
                        tabanPuan: processedRecord.taban_puan_sondan_2_yil,
                        yerlesenKisiSayisi: processedRecord.yerlesen_kisi_sayisi_sondan_2_yil,
                    },
                    {
                        yil: 2022,
                        kontenjan: processedRecord.kontenjan_sondan_1_yil,
                        tabanBasariSirasi: processedRecord.taban_basari_sirasi_sondan_1_yil,
                        tabanPuan: processedRecord.taban_puan_sondan_1_yil,
                        yerlesenKisiSayisi: processedRecord.yerlesen_kisi_sayisi_sondan_1_yil,
                    },
                ],
            };
            return parsedProgramInfo;
        });
    }
    catch (error) {
        throw new yok_atlas_search_error_1.YokAtlasSearchError({
            reason: 'post-process-failed',
            error,
            responseRaw: rawSearchResult,
        });
    }
};
const actuallySearch = async (urlSearchParams) => {
    return yok_atlas_api_1.YokAtlasAPI.post(yok_atlas_endpoints_1.YOK_ATLAS_ENDPOINTS.LisansTercihSihirbazi, urlSearchParams.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
    })
        .then((res) => {
        return res.data;
    })
        .catch((error) => {
        throw new yok_atlas_search_error_1.YokAtlasSearchError({
            reason: 'request-failed',
            error,
        });
    });
};
const responseBodyValidationSchema = joi_1.default.object({
    data: joi_1.default.array().min(0).items(joi_1.default.array().length(45)),
    draw: joi_1.default.number().required(),
    recordsFiltered: joi_1.default.number().required(),
    recordsTotal: joi_1.default.number().required(),
}).required();
const validateResponseBody = (responseBody) => {
    const { error } = responseBodyValidationSchema.validate(responseBody);
    if (error) {
        throw new yok_atlas_search_error_1.YokAtlasSearchError({
            reason: 'response-validation-failed',
            responseRaw: responseBody,
            error,
        });
    }
};
const searchLisansTercihSihirbazi = async (searchParamsConfig) => {
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
exports.searchLisansTercihSihirbazi = searchLisansTercihSihirbazi;
