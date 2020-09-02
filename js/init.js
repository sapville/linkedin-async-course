/*global getAPIKey*/
function showResult() {

  class City {
    constructor(sCity, sCityCode, iDelay, sAPIKey) {
      this.sCity = sCity;
      this.sCityCode = sCityCode;
      this.sTemperature = '';
      this.iDelay = iDelay;
      this.sAPIKey = sAPIKey;
    }
  }

  const aCitiesFastFirst = [
    new City('Vancouver', 'Vancouver,ca', 1000, getAPIKey()),
    new City('Coquitlam', 'Coquitlam,ca', 2000, getAPIKey()),
    new City('North Vancouver', 'North+Vancouver,ca', 3000, getAPIKey())
  ];

  const aCitiesSlowFirst = [
    new City('Vancouver', 'Vancouver,ca', 2000, getAPIKey()),
    new City('Coquitlam', 'Coquitlam,ca', 1000, getAPIKey()),
    new City('North Vancouver', 'North+Vancouver,ca', 3000, getAPIKey())
  ];

  function showText(sText) {
    $('p').last().after(`<p>${sText}</p>`);
  }

  function cleanUp() {
    return new Promise(resolve => setTimeout(() => {
      resolve();
      $('div').replaceWith('<div class="div"><p></p></div>');
    }, 3000));
  }

  function getTemperature(oCity) {
    console.log(`Started ${oCity.sCity}, delay ${oCity.iDelay}`);
    return new Promise((resolve, reject) => {
      const oReq = new XMLHttpRequest();
      oReq.addEventListener('load', function() {
        if (this.status === 200) {
          oCity.sTemperature = JSON.parse(this.responseText).main.temp;
          setTimeout(() => {
            console.log(oCity);
            resolve(oCity);
          }, oCity.iDelay);
        }
        else {
          reject(this);
        }
      });
      oReq.addEventListener('error', function() {
        reject(this);
      });
      oReq.addEventListener('timeout', function() {
        reject(new function() {
          this.status = 'failed';
          this.statusText = 'Time Out';
        });
      });
      oReq.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${oCity.sCityCode}&units=metric&appid=${oCity.sAPIKey}`);
      oReq.send();

    });

  }

  async function concurrent_start(aCities) {

    const results = aCities.map(city => getTemperature(city));

    for (const result of results) {
      const city = await result;
      showText(city.sCity + ': ' + city.sTemperature);
    }

  }

  async function parallel(aCities) {

    await Promise.all(aCities.map(async city => {
      const result = await getTemperature(city);
      showText(result.sCity + ': ' + result.sTemperature);
    }));

  }

  async function main(aCities) {

    try {
      showText('Wait for it...');
      const results = await Promise.all(aCities.map(city => getTemperature(city)));
      showText('Here is the weather:');
      $('p').first().next().remove();
      results.forEach(result => showText(result.sCity + ': ' + result.sTemperature));
    }
    catch (error) {
      showText('Error happened: ' + error.status + ' ' + error.statusText);
    }
    finally {
      showText('That is it!');
    }

  }

  (async function() {
    showText('=====CONCURRENT FAST FIRST');
    await concurrent_start(aCitiesFastFirst);
    showText('=====CONCURRENT SLOW FIRST');
    await concurrent_start(aCitiesSlowFirst);
    showText('=====PARALLEL FAST FIRST');
    await parallel(aCitiesFastFirst);
    showText('=====PARALLEL SLOW FIRST');
    await parallel(aCitiesSlowFirst);
    await cleanUp();
    main(aCitiesSlowFirst);
  })();
}
