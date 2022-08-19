"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postProcessSearchResultRecord = exports.PostProcessError = void 0;
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
};
const parseTabanPuan = (virgulluPuan) => {
    if (virgulluPuan === '---') {
        return null;
    }
    if (virgulluPuan === 'Dolmadı') {
        return 'Dolmadı';
    }
    return parseFloat(virgulluPuan.replace(',', '.'));
};
const parseSiralama = (noktaliSiralama) => {
    if (noktaliSiralama === '---') {
        return null;
    }
    if (noktaliSiralama === 'Dolmadı') {
        return 'Dolmadı';
    }
    return parseInt(noktaliSiralama.replace('.', ''));
};
const parseYerlesen = (yerlesen) => {
    if (yerlesen === '---') {
        return null;
    }
    return parseInt(yerlesen.replace('.', ''));
};
const parseKontenjan = (kontenjan) => {
    if (kontenjan === '---') {
        return null;
    }
    return parseInt(kontenjan.replace('.', ''));
};
const ResultColumnIndexByName = Object.entries(ResultColumnIndexCorrespondents).reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [value.toString()]: Number(key) })), {});
const resultColumnNames = Object.keys(ResultColumnIndexByName);
const postProcessConfig_TabanBasariSirasi = {
    validate: (value) => typeof value === 'string',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: (value) => parseSiralama(value),
};
const postProcessConfig_YerlesenSayisi = {
    validate: (value) => typeof value === 'string',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: (value) => parseYerlesen(value),
};
const postProcessConfig_TabanPuan = {
    validate: (value) => typeof value === 'string',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: (value) => parseTabanPuan(value),
};
const postProcessConfig_Kontenjan = {
    validate: (value) => typeof value === 'string',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: (value) => parseKontenjan(value),
};
// Api returns three of the columns with numbers as html so need to parse them.
// ex: <br><font color='red'>---</font><br><font color='purple'>12</font><br><font color='blue'>7</font><br><font color='green'>7</font>
const extractStandardNumberValue = (html) => {
    const yerlesenNumberMatches = html.match(/>[0-9]{1,3}|(---)?<\/font></);
    if (!yerlesenNumberMatches)
        return null;
    const yerlesenNumber = yerlesenNumberMatches[1];
    if (yerlesenNumber == null)
        return null;
    return yerlesenNumber;
};
const ResultPostProcessors = {
    yop_kodu: {
        extractValuePrePostProcess: (html) => {
            const yopkODUMatches = html.match(/javascript:listeyeEkle\(([0-9]+)\)/);
            if (!yopkODUMatches)
                return null;
            const yopkODU = yopkODUMatches[1];
            if (yopkODU == null)
                return null;
            return yopkODU;
        },
        validate: (value) => typeof value === 'string',
        transform: (value) => value,
    },
    uni_turu: {
        validate: (value) => 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['KKTC', 'Devlet', 'Vakıf', 'Yabancı'].includes(value),
    },
    ucret_burs: {
        validate: (value) => [
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
        ].includes(value),
    },
    ogretim_turu: {
        validate: (value) => 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['Açıköğretim', 'Uzaktan', 'Örgün', 'İkinci'].includes(value),
    },
    doluluk: {
        validate: (value) => 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['Doldu', 'Dolmadı', 'Yeni'].includes(value),
    },
    taban_basari_sirasi_sondan_1_yil: Object.assign({ extractValuePrePostProcess: extractStandardNumberValue }, postProcessConfig_TabanBasariSirasi),
    taban_basari_sirasi_sondan_2_yil: postProcessConfig_TabanBasariSirasi,
    taban_basari_sirasi_sondan_3_yil: postProcessConfig_TabanBasariSirasi,
    taban_basari_sirasi_sondan_4_yil: postProcessConfig_TabanBasariSirasi,
    yerlesen_kisi_sayisi_sondan_1_yil: Object.assign({ extractValuePrePostProcess: extractStandardNumberValue }, postProcessConfig_YerlesenSayisi),
    yerlesen_kisi_sayisi_sondan_2_yil: postProcessConfig_YerlesenSayisi,
    yerlesen_kisi_sayisi_sondan_3_yil: postProcessConfig_YerlesenSayisi,
    yerlesen_kisi_sayisi_sondan_4_yil: postProcessConfig_YerlesenSayisi,
    taban_puan_sondan_1_yil: Object.assign({ extractValuePrePostProcess: extractStandardNumberValue }, postProcessConfig_TabanPuan),
    taban_puan_sondan_2_yil: postProcessConfig_TabanPuan,
    taban_puan_sondan_3_yil: postProcessConfig_TabanPuan,
    taban_puan_sondan_4_yil: postProcessConfig_TabanPuan,
    kontenjan_sondan_1_yil: Object.assign({ extractValuePrePostProcess: (html) => {
            const kontenjanNumberMatches = html.match(/\d{0,1000}[+]\d{0,10}/);
            if (!kontenjanNumberMatches)
                return null;
            const kontenjanNumber = kontenjanNumberMatches[0];
            if (kontenjanNumber == null)
                return null;
            return kontenjanNumber;
        } }, postProcessConfig_Kontenjan),
    kontenjan_sondan_2_yil: postProcessConfig_Kontenjan,
    kontenjan_sondan_3_yil: postProcessConfig_Kontenjan,
    kontenjan_sondan_4_yil: postProcessConfig_Kontenjan,
};
const createKeyValueMap = (record) => {
    const keyValueMap = Object.entries(record).reduce((acc, [key, val]) => {
        const keyName = ResultColumnIndexCorrespondents[key];
        acc[keyName] = val;
        return acc;
    }, {});
    return keyValueMap;
};
class PostProcessError extends Error {
    constructor(reason, details) {
        super('Post processing failed.');
        this.name = 'PostProcessError';
        this.stage = reason;
        this.details = details;
    }
}
exports.PostProcessError = PostProcessError;
const postProcessSearchResultRecord = (record) => {
    const result = createKeyValueMap(record);
    for (const [key, postProcessCFG] of Object.entries(ResultPostProcessors)) {
        if (postProcessCFG == null)
            continue;
        if (postProcessCFG.extractValuePrePostProcess) {
            try {
                const extractionResult = postProcessCFG.extractValuePrePostProcess(result[key]);
                result[key] = extractionResult;
            }
            catch (error) {
                throw new PostProcessError('extraction', {
                    key: key,
                    value: result[key],
                    reason: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
        if (postProcessCFG.validate) {
            try {
                const isValid = postProcessCFG.validate(result[key]);
                if (isValid === false) {
                    throw new PostProcessError('validation', {
                        key: key,
                        value: result[key],
                        reason: 'Invalid value',
                    });
                }
            }
            catch (error) {
                throw new PostProcessError('validation', {
                    key: key,
                    value: result[key],
                    reason: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
        if (postProcessCFG.transform) {
            try {
                const transformationResult = postProcessCFG.transform(result[key]);
                result[key] = transformationResult;
            }
            catch (error) {
                throw new PostProcessError('transformation', {
                    key: key,
                    value: result[key],
                    reason: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
    }
    return result;
};
exports.postProcessSearchResultRecord = postProcessSearchResultRecord;
