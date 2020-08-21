/*globals getAPIKey*/
function showResult() {

  class City {
    constructor(sCity, sCityCode) {
      this.sCity = sCity;
      this.sCityCode = sCityCode;
      this.sTemperature = '';
    }
  }

  const cities = [
    new City('Vancouver', 'Vancouver,ca'),
    new City('Coquitlam', 'Coquitlam,ca'),
    new City('North Vancouver', 'North+Vancouver,ca')
  ];

  function showText(sText) {
    $('p').last().after(`<p>${sText}</p>`);
  }

  function getTemperature(oCity) {
    return new Promise((resolve, reject) => {
      const oReq = new XMLHttpRequest();
      oReq.addEventListener('load', function() {
        if (this.status === 200) {
          oCity.sTemperature = JSON.parse(this.responseText).main.temp;
          resolve(oCity);
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
      oReq.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${oCity.sCityCode}&units=metric&appid=${getAPIKey()}`);
      oReq.send();

    });

  }

  Promise.all(cities.map(city => getTemperature(city)))
    .then(results => {
      showText('Here is the weather:');
      $('p').first().next().remove();
      return results;
    })
    .then(results => results.forEach(result => showText(result.sCity + ': ' + result.sTemperature)))
    .catch(error => showText('Error happened: ' + error.status + ' ' + error.statusText))
    .finally(() => showText('That is it!'));

  showText('Wait for it...');

}
