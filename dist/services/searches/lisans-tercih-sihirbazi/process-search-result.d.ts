import { ValueOf } from '../../../types/util';
import { Doluluk, OgretimTuru, SearchResultRecord, UcretBurs, UniversiteTuru } from '../../../types/yok-atlas/lisans-tercih-sihirbazi';
export declare type SearchResultYOProgramInfo = {
    programKodu: string;
    universite: {
        ad: string;
        tur: 'KKTC' | 'Devlet' | 'Vakıf' | 'Yabancı';
        sehir: string;
    };
    program: {
        kod: string;
        puanTuru: 'say' | 'söz' | 'ea' | 'dil';
        fakulte: string;
        ad: string;
        ucretTuru: '%25 indirimli' | '%50 indirimli' | '%75 indirimli' | 'AÖ_Ücretli' | 'Burslu' | 'UE_Ücretli' | 'Ücretli' | 'Ücretsiz' | 'İÖ_Ücretli';
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
declare const resultColumnNames: ValueOf<{
    readonly 0: "x--0";
    readonly 1: "yop_kodu";
    readonly 2: "uni_ve_fakulte";
    readonly 3: "fakulte_adi";
    readonly 4: "bolum_adi";
    readonly 5: "dil__burs__ogretim_suresi";
    readonly 6: "sehir_adi";
    readonly 7: "uni_turu";
    readonly 8: "ucret_burs";
    readonly 9: "ogretim_turu";
    readonly 10: "kontenjan_sondan_1_yil";
    readonly 11: "kontenjan_sondan_2_yil";
    readonly 12: "kontenjan_sondan_3_yil";
    readonly 13: "kontenjan_sondan_4_yil";
    readonly 14: "doluluk";
    readonly 15: "yerlesen_kisi_sayisi_sondan_1_yil";
    readonly 16: "yerlesen_kisi_sayisi_sondan_2_yil";
    readonly 17: "yerlesen_kisi_sayisi_sondan_3_yil";
    readonly 18: "yerlesen_kisi_sayisi_sondan_4_yil";
    readonly 19: "taban_basari_sirasi_sondan_1_yil";
    readonly 20: "taban_basari_sirasi_sondan_2_yil";
    readonly 21: "taban_basari_sirasi_sondan_3_yil";
    readonly 22: "taban_basari_sirasi_sondan_4_yil";
    readonly 23: "x--group-1-1";
    readonly 24: "x--group-1-2";
    readonly 25: "x--group-1-3";
    readonly 26: "x--group-1-4";
    readonly 27: "taban_puan_sondan_1_yil";
    readonly 28: "taban_puan_sondan_2_yil";
    readonly 29: "taban_puan_sondan_3_yil";
    readonly 30: "taban_puan_sondan_4_yil";
    readonly 31: "x--31";
    readonly 32: "x--32";
    readonly 33: "x--33";
    readonly 34: "son_taban_puan";
    readonly 35: "x--35";
    readonly 36: "x--36";
    readonly 37: "x--37";
    readonly 38: "x--38";
    readonly 39: "son_taban_basari_sirasi";
    readonly 40: "x--40";
    readonly 41: "uni_adi";
    readonly 42: "program_adi";
    readonly 43: "program_son_taban_basari_sirasi";
    readonly 44: "x--44";
}>[];
declare type ResultColumnNamesUnion = typeof resultColumnNames[number];
declare type PostProccessed_Kontenjan = number | null;
declare type PostProccessed_YerlesenSayisi = 'Dolmadı' | number | null;
declare type PostProccessed_TabanPuan = 'Dolmadı' | number | null;
declare type PostProccessed_TabanBasariSirasi = 'Dolmadı' | number | null;
declare type PostProccessed_Customs = {
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
    uni_turu: UniversiteTuru;
    ucret_burs: UcretBurs;
    ogretim_turu: OgretimTuru;
    doluluk: Doluluk;
};
declare type PostProcessedSearchResult = {
    [key in Exclude<ResultColumnNamesUnion, keyof PostProccessed_Customs>]: string;
} & PostProccessed_Customs;
export declare class PostProcessError extends Error {
    stage: 'extraction' | 'validation' | 'transformation';
    details: {
        key: ResultColumnNamesUnion;
        value: unknown;
        reason: string;
    };
    constructor(reason: 'extraction' | 'validation' | 'transformation', details: {
        key: ResultColumnNamesUnion;
        value: any;
        reason: string;
    });
}
export declare const postProcessSearchResultRecord: (record: SearchResultRecord) => PostProcessedSearchResult;
export {};
