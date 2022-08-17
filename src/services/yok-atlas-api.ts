import axios from 'axios';
import qs from 'qs';

const columnData = [
  'columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=6&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=7&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=false&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=8&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=false&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=9&columns%5B9%5D%5Bname%5D=&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=false&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B10%5D%5Bdata%5D=10&columns%5B10%5D%5Bname%5D=&columns%5B10%5D%5Bsearchable%5D=true&columns%5B10%5D%5Borderable%5D=false&columns%5B10%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B10%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B11%5D%5Bdata%5D=11&columns%5B11%5D%5Bname%5D=&columns%5B11%5D%5Bsearchable%5D=true&columns%5B11%5D%5Borderable%5D=true&columns%5B11%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B11%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B12%5D%5Bdata%5D=12&columns%5B12%5D%5Bname%5D=&columns%5B12%5D%5Bsearchable%5D=true&columns%5B12%5D%5Borderable%5D=true&columns%5B12%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B12%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B13%5D%5Bdata%5D=13&columns%5B13%5D%5Bname%5D=&columns%5B13%5D%5Bsearchable%5D=true&columns%5B13%5D%5Borderable%5D=true&columns%5B13%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B13%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B14%5D%5Bdata%5D=14&columns%5B14%5D%5Bname%5D=&columns%5B14%5D%5Bsearchable%5D=true&columns%5B14%5D%5Borderable%5D=false&columns%5B14%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B14%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B15%5D%5Bdata%5D=15&columns%5B15%5D%5Bname%5D=&columns%5B15%5D%5Bsearchable%5D=true&columns%5B15%5D%5Borderable%5D=false&columns%5B15%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B15%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B16%5D%5Bdata%5D=16&columns%5B16%5D%5Bname%5D=&columns%5B16%5D%5Bsearchable%5D=true&columns%5B16%5D%5Borderable%5D=true&columns%5B16%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B16%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B17%5D%5Bdata%5D=17&columns%5B17%5D%5Bname%5D=&columns%5B17%5D%5Bsearchable%5D=true&columns%5B17%5D%5Borderable%5D=true&columns%5B17%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B17%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B18%5D%5Bdata%5D=18&columns%5B18%5D%5Bname%5D=&columns%5B18%5D%5Bsearchable%5D=true&columns%5B18%5D%5Borderable%5D=true&columns%5B18%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B18%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B19%5D%5Bdata%5D=19&columns%5B19%5D%5Bname%5D=&columns%5B19%5D%5Bsearchable%5D=true&columns%5B19%5D%5Borderable%5D=true&columns%5B19%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B19%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B20%5D%5Bdata%5D=20&columns%5B20%5D%5Bname%5D=&columns%5B20%5D%5Bsearchable%5D=true&columns%5B20%5D%5Borderable%5D=true&columns%5B20%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B20%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B21%5D%5Bdata%5D=21&columns%5B21%5D%5Bname%5D=&columns%5B21%5D%5Bsearchable%5D=true&columns%5B21%5D%5Borderable%5D=true&columns%5B21%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B21%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B22%5D%5Bdata%5D=22&columns%5B22%5D%5Bname%5D=&columns%5B22%5D%5Bsearchable%5D=true&columns%5B22%5D%5Borderable%5D=true&columns%5B22%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B22%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B23%5D%5Bdata%5D=23&columns%5B23%5D%5Bname%5D=&columns%5B23%5D%5Bsearchable%5D=true&columns%5B23%5D%5Borderable%5D=true&columns%5B23%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B23%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B24%5D%5Bdata%5D=24&columns%5B24%5D%5Bname%5D=&columns%5B24%5D%5Bsearchable%5D=true&columns%5B24%5D%5Borderable%5D=true&columns%5B24%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B24%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B25%5D%5Bdata%5D=25&columns%5B25%5D%5Bname%5D=&columns%5B25%5D%5Bsearchable%5D=true&columns%5B25%5D%5Borderable%5D=true&columns%5B25%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B25%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B26%5D%5Bdata%5D=26&columns%5B26%5D%5Bname%5D=&columns%5B26%5D%5Bsearchable%5D=true&columns%5B26%5D%5Borderable%5D=true&columns%5B26%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B26%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B27%5D%5Bdata%5D=27&columns%5B27%5D%5Bname%5D=&columns%5B27%5D%5Bsearchable%5D=true&columns%5B27%5D%5Borderable%5D=true&columns%5B27%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B27%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B28%5D%5Bdata%5D=28&columns%5B28%5D%5Bname%5D=&columns%5B28%5D%5Bsearchable%5D=true&columns%5B28%5D%5Borderable%5D=true&columns%5B28%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B28%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B29%5D%5Bdata%5D=29&columns%5B29%5D%5Bname%5D=&columns%5B29%5D%5Bsearchable%5D=true&columns%5B29%5D%5Borderable%5D=true&columns%5B29%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B29%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B30%5D%5Bdata%5D=30&columns%5B30%5D%5Bname%5D=&columns%5B30%5D%5Bsearchable%5D=true&columns%5B30%5D%5Borderable%5D=true&columns%5B30%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B30%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B31%5D%5Bdata%5D=31&columns%5B31%5D%5Bname%5D=&columns%5B31%5D%5Bsearchable%5D=true&columns%5B31%5D%5Borderable%5D=true&columns%5B31%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B31%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B32%5D%5Bdata%5D=32&columns%5B32%5D%5Bname%5D=&columns%5B32%5D%5Bsearchable%5D=true&columns%5B32%5D%5Borderable%5D=true&columns%5B32%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B32%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B33%5D%5Bdata%5D=33&columns%5B33%5D%5Bname%5D=&columns%5B33%5D%5Bsearchable%5D=true&columns%5B33%5D%5Borderable%5D=true&columns%5B33%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B33%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B34%5D%5Bdata%5D=34&columns%5B34%5D%5Bname%5D=&columns%5B34%5D%5Bsearchable%5D=true&columns%5B34%5D%5Borderable%5D=true&columns%5B34%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B34%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B35%5D%5Bdata%5D=35&columns%5B35%5D%5Bname%5D=&columns%5B35%5D%5Bsearchable%5D=true&columns%5B35%5D%5Borderable%5D=true&columns%5B35%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B35%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B36%5D%5Bdata%5D=36&columns%5B36%5D%5Bname%5D=&columns%5B36%5D%5Bsearchable%5D=true&columns%5B36%5D%5Borderable%5D=true&columns%5B36%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B36%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B37%5D%5Bdata%5D=37&columns%5B37%5D%5Bname%5D=&columns%5B37%5D%5Bsearchable%5D=true&columns%5B37%5D%5Borderable%5D=true&columns%5B37%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B37%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B38%5D%5Bdata%5D=38&columns%5B38%5D%5Bname%5D=&columns%5B38%5D%5Bsearchable%5D=true&columns%5B38%5D%5Borderable%5D=true&columns%5B38%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B38%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B39%5D%5Bdata%5D=39&columns%5B39%5D%5Bname%5D=&columns%5B39%5D%5Bsearchable%5D=true&columns%5B39%5D%5Borderable%5D=true&columns%5B39%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B39%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B40%5D%5Bdata%5D=40&columns%5B40%5D%5Bname%5D=&columns%5B40%5D%5Bsearchable%5D=true&columns%5B40%5D%5Borderable%5D=true&columns%5B40%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B40%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B41%5D%5Bdata%5D=41&columns%5B41%5D%5Bname%5D=&columns%5B41%5D%5Bsearchable%5D=true&columns%5B41%5D%5Borderable%5D=true&columns%5B41%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B41%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B42%5D%5Bdata%5D=42&columns%5B42%5D%5Bname%5D=&columns%5B42%5D%5Bsearchable%5D=true&columns%5B42%5D%5Borderable%5D=true&columns%5B42%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B42%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B43%5D%5Bdata%5D=43&columns%5B43%5D%5Bname%5D=&columns%5B43%5D%5Bsearchable%5D=true&columns%5B43%5D%5Borderable%5D=true&columns%5B43%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B43%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B44%5D%5Bdata%5D=44&columns%5B44%5D%5Bname%5D=&columns%5B44%5D%5Bsearchable%5D=true&columns%5B44%5D%5Borderable%5D=true&columns%5B44%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B44%5D%5Bsearch%5D%5Bregex%5D=false',
];

const standardColumn = {
  'columns[0][data]': 0,
  'columns[0][name]': '',
  'columns[0][searchable]': true,
  'columns[0][orderable]': false,
  'columns[0][search][value]': '',
  'columns[0][search][regex]': false,
};

const searchColumnDefaultValues = {
  data: 0,
  name: '',
  searchable: true,
  orderable: false,
  search: {
    value: '',
    regex: false,
  },
};

const generateDefaultSearchColumn = (index: number) => {
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
    [keyNames.name]: searchColumnDefaultValues.name,
    [keyNames.searchable]: searchColumnDefaultValues.searchable,
    [keyNames.orderable]: searchColumnDefaultValues.orderable,
    [keyNames.search]: searchColumnDefaultValues.search.value,
    [keyNames.regex]: searchColumnDefaultValues.search.regex,
  };

  return searchColumn;
};

const searchResultRecord = {
  '0': '',
  '1': "<a href='lisans.php?y=203910363' target='_blank'>203910363</a><br>\r\n\t\t\t\t\t\t<a href='content/lightbox/akredite.php?y=203910363' data-featherlight='ajax'><img src='assets/img/flag_akredite.png' height='16'></a><br><span class='ekle203910363'><a href='javascript:listeyeEkle(203910363)'><br><span class='fa fa-plus-circle'></span> Listeme Ekle</span></a><br>",
  '2': "<strong>KOÇ ÜNİVERSİTESİ </strong>&nbsp;<br><font color='#CC0000'>Mühendislik Fakültesi</font><br><br><a href='externalAppParameter.php?y=203910363' target='_blank'><font color='#CC0000'><span class='fa fa-users'></span> Akademik Kadro</font></a>",
  '3': 'Mühendislik Fakültesi',
  '4': "<strong>Bilgisayar Mühendisliği</strong>&nbsp;\r\n\t\t\t\t<a href='content/lightbox/kosullar-lisans.php?y=203910363' data-featherlight='ajax'><img src='assets/img/kosullar.png' height='12'></a>&nbsp;<a href='content/lightbox/limit.php?l=1' data-featherlight='ajax'><img src='assets/img/flag_limit2.png' height='12'></a><br><font color='#CC0000'>(İngilizce) (Burslu) (4 Yıllık)</font>",
  '5': '(İngilizce) (Burslu) (4 Yıllık)',
  '6': 'İSTANBUL ',
  '7': 'Vakıf',
  '8': 'Burslu',
  '9': 'Örgün',
  '10': "<br><font color='red'>16+0</font><br><font color='purple'>15+0</font><br><font color='blue'>15+0</font><br><font color='green'>9+0</font>",
  '11': '15+0',
  '12': '15+0',
  '13': '9+0',
  '14': 'Doldu',
  '15': "<br><font color='red'>---</font><br><font color='purple'>15</font><br><font color='blue'>15</font><br><font color='green'>9</font>",
  '16': '15',
  '17': '15',
  '18': '9',
  '19': "<br><font color='red'>---</font><br><font color='purple'>221</font><br><font color='blue'>397</font><br><font color='green'>281</font>",
  '20': '221',
  '21': '397',
  '22': '281',
  '23': "<br>---<br><font color='purple'>---</font><br><font color='blue'>---</font><br><font color='green'>---</font>",
  '24': '---',
  '25': '---',
  '26': '---',
  '27': "<br><font color='red'>---</font><br><font color='purple'>525,61359</font><br><font color='blue'>545,38069</font><br><font color='green'>541,51566</font>",
  '28': '525,61359',
  '29': '545,38069',
  '30': '541,51566',
  '31': null,
  '32': '1',
  '33': '1',
  '34': '525,61359',
  '35': null,
  '36': null,
  '37': '---',
  '38': 0,
  '39': 221,
  '40': '118853|118859|158366',
  '41': 'KOÇ ÜNİVERSİTESİ ',
  '42': 'Bilgisayar Mühendisliği',
  '43': '221',
  '44': '---',
};

// type StandardColumnSearchQuery = typeof standardColumn;

export type YOKAtlasSearchParamsConfig = Partial<{
  yop_kodu: string;
  uni_adi: string;
  program_adi: string;
  sehir_adi: string;
  universite_turu: string;
  ucret_burs: string;
  ogretim_turu: string;
  doluluk: string;
}>;

type ConfigSearchParams = keyof YOKAtlasSearchParamsConfig;

const columnIndexes: Record<ConfigSearchParams, number> = {
  yop_kodu: 1,
  uni_adi: 2,
  program_adi: 4,
  sehir_adi: 6,
  universite_turu: 7,
  ucret_burs: 8,
  ogretim_turu: 9,
  doluluk: 14,
} as const;

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
} as const;

class YOKATLAS {
  columns: URLSearchParams;

  constructor(searchParamsConfig: YOKAtlasSearchParamsConfig) {
    // this.columns = new URLSearchParams(columnData[0]);

    const defaultSearchColumnsParams = [...Array(45)].reduce(
      (acc: Record<string, string>, _, index) => {
        return {
          ...acc,
          ...generateDefaultSearchColumn(index),
        };
      },
      {} as Record<string, string>
    );

    this.columns = new URLSearchParams({
      ...defaultSearchColumnsParams,
    } as const);

    // Object.keys(columnVars).forEach((key) => {
    //   if (_[key]) {
    //     this.columns.set(`columns[${columnVars[key]}][search][value]`, _[key]);
    //   }
    // });

    // Fill search params with search params config
    for (const [key, value] of Object.entries(columnIndexes)) {
      const configValueForKey = searchParamsConfig[key as ConfigSearchParams];

      if (configValueForKey) {
        this.columns.set(`columns[${value}][search][value]`, configValueForKey);
      }
    }

    Object.keys(defaultNonColumnSearchParams).forEach((key) => {
      const configValueForKey = searchParamsConfig[key as ConfigSearchParams];

      if (!configValueForKey)
        return this.columns.append(
          key,
          defaultNonColumnSearchParams[
            key as keyof typeof defaultNonColumnSearchParams
          ].toString()
        );

      if (key === 'puan_turu') {
        if (
          configValueForKey === 'dil' ||
          configValueForKey === 'ea' ||
          configValueForKey === 'söz' ||
          configValueForKey === 'say'
        ) {
          this.columns.append(key, configValueForKey);
        } else {
          this.columns.append(key, defaultNonColumnSearchParams[key]);
        }
        return;
      }

      if (key === 'search') {
        this.columns.append(
          'search[value]',
          configValueForKey ? configValueForKey : ''
        );
        this.columns.append('search[regex]', 'false');
        return;
      }

      this.columns.append(key, configValueForKey);
    });
  }

  // Api returns three of the columns with numbers as html so need to parse them.
  // ex: <br><font color='red'>---</font><br><font color='purple'>12</font><br><font color='blue'>7</font><br><font color='green'>7</font>
  getYerlesenNumber(html: string) {
    const yerlesenNumberMatches = html.match(/>[0-9]{1,3}|(---)?<\/font></);

    if (!yerlesenNumberMatches) return null;

    const yerlesenNumber = yerlesenNumberMatches[1];

    if (yerlesenNumber == null) return null;

    return yerlesenNumber;
  }

  getKontenjanNumber(html: string) {
    const kontenjanNumberMatches = html.match(/\d{0,1000}[+]\d{0,10}/);

    if (!kontenjanNumberMatches) return null;

    const kontenjanNumber = kontenjanNumberMatches[0];

    if (kontenjanNumber == null) return null;

    return kontenjanNumber;
  }

  getYOPkODU(html: string) {
    const yopkODUMatches = html.match(/javascript:listeyeEkle\(([0-9]+)\)/);

    if (!yopkODUMatches) return null;

    const yopkODU = yopkODUMatches[1];

    if (yopkODU == null) return null;

    return yopkODU;
  }

  parseResults({ data }: { data: Array<typeof searchResultRecord> }) {
    return data.map((e) => {
      return {
        yop_kodu: this.getYOPkODU(e[1]),
        uni_adi: e[41],
        fakulte: e[3],
        program_adi: e[42],
        sehir_adi: e[6],
        universite_turu: e[7],
        ucret_burs: e[8],
        ogretim_turu: e[9],
        doluluk: e[14],
        yerlesen: [this.getYerlesenNumber(e[15]), e[16], e[17], e[18]],
        kontenjan: [this.getKontenjanNumber(e[10]), e[11], e[12], e[13]],
        tbs: [this.getYerlesenNumber(e[19]), e[20], e[21], e[22]],
        taban: [this.getYerlesenNumber(e[27]), e[28], e[29], e[30]],
      };
    });
  }

  fidgetSpinner() {
    let indexke = 0;
    const fidgetSpinner = this.columns.entries();
    let devamke = true;
    while (devamke) {
      const e = fidgetSpinner.next();
      if (e.done) {
        devamke = false;
        break;
      }
      indexke++;
      const { value } = e;
      console.log([value[0], value[1]]);
    }

    console.log(this.columns.toString());
  }

  private async actuallySearch() {
    return axios
      .post<{ data: Array<typeof searchResultRecord> }>(
        'https://yokatlas.yok.gov.tr/server_side/server_processing-atlas2016-TS-t4.php',
        this.columns.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.headers);
            console.log(error.response.data);
          }
        }

        throw error;
      });
  }

  async search() {
    const data = await this.actuallySearch();
    const results = this.parseResults(data);
    return results;
  }
}

export default YOKATLAS;
