import axios from 'axios';
import YOKATLAS from './services/yok-atlas-api';

const cinsiyet2019 =
  'https://yokatlas.yok.gov.tr/2019/lisans-panel.php?y=203910363&p=1010&m=1';
const cinsiyet2020 =
  'https://yokatlas.yok.gov.tr/2020/lisans-panel.php?y=203910363&p=1010&m=1';
const cinsiyet2021 =
  'https://yokatlas.yok.gov.tr/lisans-panel.php?y=203910363&p=1010&m=1';

const main = async () => {
  try {
    const results = await new YOKATLAS({
      sehir_adi: 'Ankara',
    }).search();

    console.log(results);
  } catch (error) {
    console.log(error);
    return;
  }
};

main();
