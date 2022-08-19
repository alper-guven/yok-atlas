export declare type UniversiteTuru = 'KKTC' | 'Devlet' | 'Vakıf' | 'Yabancı';
export declare type UcretBurs = '%25 indirimli' | '%50 indirimli' | '%75 indirimli' | 'AÖ_Ücretli' | 'Burslu' | 'UE_Ücretli' | 'Ücretli' | 'Ücretsiz' | 'İÖ_Ücretli';
export declare type OgretimTuru = 'Açıköğretim' | 'Uzaktan' | 'Örgün' | 'İkinci';
export declare type Doluluk = 'Doldu' | 'Dolmadı' | 'Yeni';
export declare type PuanTuru = 'say' | 'söz' | 'ea' | 'dil';
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
export declare type SearchResultRecord = {
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
export interface YokAtlas_LisansTercihSihirbazi_SearchResult_Raw {
    data: Array<SearchResultRecord>;
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
}
