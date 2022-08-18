import YOKAtlasAPI from './services/yok-atlas-api';

// const cinsiyet2019 =
//   'https://yokatlas.yok.gov.tr/2019/lisans-panel.php?y=203910363&p=1010&m=1';
// const cinsiyet2020 =
//   'https://yokatlas.yok.gov.tr/2020/lisans-panel.php?y=203910363&p=1010&m=1';
// const cinsiyet2021 =
//   'https://yokatlas.yok.gov.tr/lisans-panel.php?y=203910363&p=1010&m=1';

const main = async () => {
  try {
    const results = await new YOKAtlasAPI({
      sehir_adi: 'Ankara',
    }).search();

    for (const result of results) {
      const { yillaraGoreDegerler, ...rest } = result;

      console.log(`---------- ${rest.program.kod} ----------`);
      console.log(rest);
      console.log(yillaraGoreDegerler);
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

main();
