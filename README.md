# YÖK Atlas

[YÖK Atlas](https://yokatlas.yok.gov.tr/) için API wrapper'ı.


An API wrapper for [YÖK Atlas](https://yokatlas.yok.gov.tr/)

> NOTE: This is not an official package. It uses the API's that YÖK Atlas' website consumes.

Have questions? [Contact Me](https://twitter.com/alper_guven_)!



![npm](https://img.shields.io/npm/dm/yok-atlas?style=for-the-badge) 

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/alperguven)

## Installation

Install [yok-atlas](https://www.npmjs.com/package/yok-atlas) with npm

```bash
  npm install yok-atlas
```

Type definitions? Included!
## Demo


# [Try it!](https://runkit.com/alperguven/62fee5331129550008f5b5de) 



## Features

- Search by any criteria on [YÖK Atlas - Lisans Tercih Sihirbazı](https://yokatlas.yok.gov.tr/tercih-sihirbazi-t4-tablo.php?p=say)
- TYPES! Search criterias such as `Üniversite Türü` | `Ücret/Burs` | `Öğretim Türü` etc all have type definitions. So you will get suggestions on your editor!
- Your search configuration gets validated
- You can name your searches! Give a name to your search such as `Bilgisayar Mühendisliği - Örgün` and find it later by it's name later by searching in previous results!
- API response gets validated before parsing / formatting.
- Result properties gets validated & formatted.
- Any validation / formatting error causes further processing to stop.
- Healthy outcomes guaranteed! 
- Results nicely formatted. Get stats grouped by year!
- **Numbers** are formatted to **integer** / **float**
- **Empty** values formated as **null**
- Previous results preserved in instances (not on a static property, so you can create a new instance when you switch context to say, from **Sayısal** to **Sözel** programs, and work on them separetly.)
- Search Results which can not pass schema validation still available in raw format & also preserved

All happens under the hood. Just search and you will get nicely formatted, valid results!

## Roadmap

- [x]  ~~Release initial Version as 1.0.0 with only **Lisans Tercih Sihirbazı** search support~~
- [ ]  Expose an API to extend query types of **YÖK Atlas (this package)**   
- [ ]  Add [program (YOP)](https://yokatlas.yok.gov.tr/lisans.php?y=108410336) specific queries like **Yerleşenlerin Cinsiyet Dağılımı** | **Yerleşenlerin Geldikleri İller** | **Yerleşme Koşulları** 
- [ ]  Aggregate all kind of search results into a single view & make this view queriable
## Contributing

Contributions are always welcome! 
BUT I don't want to deal with PR's until I expose an API to extend query capabilities. 
Until then you can suggest improvements about internals without changing the result format.  

## Search Parameters

| Search Parameter Name | Required?|  Possible Values                                                                                                                      | Example      |
|-----------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------|--------------|
| puanTuru              | ⚠️ required |  'say' - 'söz' - 'ea' - 'dil'                                                                                                         | 'say'        |
| YOPKodu               | ❓ optional |  `string`                                                                                                                               | '104010122'  |
| universiteAdi         | ❓ optional |  `string`                                                                                                                               | 'yıldız'     |
| programAdi            | ❓ optional |  `string`                                                                                                                               | 'bilgisayar' |
| sehirAdi              | ❓ optional |  TurkiyeSehirIsimleri - Uppercase<TurkiyeSehirIsimleri> - Lowercase<TurkiyeSehirIsimleri> - `KKTC-${string}`                          | 'İstanbul'   |
| universiteTuru        | ❓ optional |  'KKTC' - 'Devlet' - 'Vakıf' - 'Yabancı'                                                                                              | 'Devlet'     |
| ucretBurs             | ❓ optional |  "%25 indirimli" - "%50 indirimli" - "%75 indirimli" - "AÖ_Ücretli" - "Burslu" - "UE_Ücretli" - "Ücretli" - "Ücretsiz" - "İÖ_Ücretli" | 'Burslu'     |
| ogretimTuru           | ❓ optional |  "Açıköğretim" - "Uzaktan" - "Örgün" - "İkinci"                                                                                       | 'Örgün'      |
| doluluk               | ❓ optional |  "Doldu" - "Dolmadı" - "Yeni"                                                                                                         | 'Doldu'      |

## How to Import

You can import it as follows:

```typescript
// Module imports
import { YOKAtlasAPI } from 'yok-atlas';

// Or you can use the default import
import YOKAtlasAPI from 'yok-atlas';

```

Or

```javascript
// Require
var YOKAtlasAPI = require('yok-atlas').YOKAtlasAPI;
```
## Usage

First of all, import the package.
```typescript
import { YOKAtlasAPI } from 'yok-atlas';
```

Create a new instance:
```typescript
const yokAtlasAPI = new YOKAtlasAPI();
```

Make a search and get the results as an array:
```typescript
const results = await yokAtlasAPI.searchLisansTercihSihirbazi(
  {
    puanTuru: 'say',
    sehirAdi: 'ankara',
    doluluk: 'Doldu',
    ogretimTuru: 'Örgün',
    programAdi: 'Bilgisayar Mühendisliği',
  },
  {
    searchName: `Ankara - Bilgisayar Mühendisliği - Örgün`,
  }
);
```

Loop through search results to list "taban başarı puanı" for year 2021:
```typescript
for (const entry of results) {
  console.log(`---------- ${entry.program.kod} ----------`);
  console.log(
    entry.programKodu,
    entry.universite.ad,
    entry.program.fakulte,
    entry.program.ad,
    entry.yillaraGoreDegerler.find((x) => x.yil === 2021)!.tabanBasariSirasi
  );
}
```

Make another search:

> NOTE: If you will make multiple searches, catch each of them to avoid breaking the complete flow.

```typescript
const anotherSearchResult = await yokAtlasAPI.searchLisansTercihSihirbazi(
  {
    puanTuru: 'söz',
    sehirAdi: 'İSTANBUL',
    universiteTuru: 'Vakıf',
    ogretimTuru: 'Örgün',
    ucretBurs: 'Burslu',
  },
  {
    searchName: `İstanbul'daki Vakıf Üniversitelerinin Burslu Sözel Lisans Programları`,
  }
).catch(error => console.log(error))

```

Just make a search to use its results when you need it:
```typescript
await yokAtlasAPI.searchLisansTercihSihirbazi(
  {
    puanTuru: 'dil',
    programAdi: 'ingilizce',
    universiteTuru: 'Devlet',
  },
  {
    searchName: `Devlet Üniversitelerinin İngilizce ile alakalı Lisans Programları`,
  }
);
```

Find your previous search named: "Ankara - Bilgisayar Mühendisliği - Örgün":
```typescript
const ankaraOrgunBilgisayarMuh = yokAtlasAPI.previousSearchResults.find(
  (x) => x.details.name === `Ankara - Bilgisayar Mühendisliği - Örgün`
);
```

Find ODTÜ's programs in your previous search:
```typescript
if (ankaraOrgunBilgisayarMuh) {
  const odtuBilgisayarProgramlari =
    ankaraOrgunBilgisayarMuh.details.searchResults
      .map((x) => (x.universite.ad.includes('ORTA DOĞU') ? x : null))
      .filter((x) => x != null);

  if (odtuBilgisayarProgramlari.length > 0) {
    const programNamesFound = odtuBilgisayarProgramlari.map((x) => x && x.program.ad).join(', ')
  }
}
```

Access previous successful search results:
```typescript
const myPreviousSearchResulsts = yokAtlasAPI.previousSearchResults;
```

Access previous failed searches (Failed to parse or validate)

> NOTE: If the request itself fails, it's not added to the failed searches.

> NOTE: You still need to expect & catch errors per search you made since it will throw an error either it is network requst fail, failed to parse or validate. 

```typescript
const myFailedSearchResults = yokAtlasAPI.failedSearchResults;
```

## Type Definition of Search Results

You can import the provided types for search results of `Lisans Tercih Sihirbazı`

```typescript
import { LisansTercihSearchResults, LisansTercihSearchResultRecord } from 'yok-atlas';
```

You will get the result in this format:

```typescript
type LisansTercihSearchResultRecord = {
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
    ucretTuru:
      | '%25 indirimli'
      | '%50 indirimli'
      | '%75 indirimli'
      | 'AÖ_Ücretli'
      | 'Burslu'
      | 'UE_Ücretli'
      | 'Ücretli'
      | 'Ücretsiz'
      | 'İÖ_Ücretli';
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

type LisansTercihSearchResults = Array<LisansTercihSearchResultRecord>; 

const sayisalSearchResult: LisansTercihSearchResults = new YOKAtlasAPI().searchLisansTercihSihirbazi(
  {
    puanTuru: 'say',
    ogretimTuru: 'Örgün',
  }
);

const firstResult: LisansTercihSearchResultRecord = yokAtlasAPI.previousSearchResults[0].details.searchResults[0];

```

## Documentation

There is not much to document for now since the wrapper only has one functionality.

I will try to create a decent documentation when I complete 1-2 achivements on roadmap.


## Running Tests

Tests? Haha. No...

Kidding. I will write some.


## License

[MIT](https://choosealicense.com/licenses/mit/)

