import { TurkiyeSehirIsimleri } from '../../../types/turkiye';
import { UniversiteTuru, UcretBurs, OgretimTuru, Doluluk, PuanTuru } from '../../../types/yok-atlas/lisans-tercih-sihirbazi';
import { LisansTercihSearchResultRecord } from './process-search-result';
export declare type YOKAtlasSearchParamsConfig = Partial<{
    YOPKodu: string;
    universiteAdi: string;
    programAdi: string;
    sehirAdi: TurkiyeSehirIsimleri | Uppercase<TurkiyeSehirIsimleri> | Lowercase<TurkiyeSehirIsimleri> | `KKTC-${string}`;
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
export declare type LisansTercihSearchResults = Array<LisansTercihSearchResultRecord>;
export declare const searchLisansTercihSihirbazi: (searchParamsConfig: YOKAtlasSearchParamsConfig) => Promise<LisansTercihSearchResults>;
