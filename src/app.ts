import YOKAtlasAPI from './services/yok-atlas-api';

// const cinsiyet2019 =
//   'https://yokatlas.yok.gov.tr/2019/lisans-panel.php?y=203910363&p=1010&m=1';
// const cinsiyet2020 =
//   'https://yokatlas.yok.gov.tr/2020/lisans-panel.php?y=203910363&p=1010&m=1';
// const cinsiyet2021 =
//   'https://yokatlas.yok.gov.tr/lisans-panel.php?y=203910363&p=1010&m=1';

const main = async () => {
  try {
    const yokAtlasAPI = new YOKAtlasAPI();

    const results = await yokAtlasAPI.searchLisansTercihSihirbazi(
      {
        puanTuru: 'say',
        sehirAdi: 'ankara',
        doluluk: 'Doldu',
        ogretimTuru: 'Örgün',
        programAdi: 'Bilgisayar Mühendisliği',
      },
      {
        searchName: `Ankara'daki Sayısal Programlar`,
      }
    );

    for (const result of results) {
      const { yillaraGoreDegerler, ...rest } = result;

      console.log(`---------- ${rest.program.kod} ----------`);
      console.log(rest);
      console.log(yillaraGoreDegerler);
    }

    console.log('#################################');

    console.log(yokAtlasAPI.previousSearchResults);
  } catch (error) {
    console.log(error);
    return;
  }
};

main();
