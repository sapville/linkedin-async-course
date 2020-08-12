function showResult() {

  function showText(sText) {
    document.getElementById('paragraph1').innerHTML = sText;
  }

  function getTemperature() {
    return new Promise((resolve, reject) => {
      const oReq = new XMLHttpRequest();
      const sAppID = 'da1240fb8032e8e258bc11509bc2ce04';
      // const sAppID = '';
      oReq.addEventListener('load', function() {
        if (this.status === 200) {
          resolve(this);
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
      oReq.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=Vancouver&units=metric&appid=' + sAppID);
      oReq.send();

    });

  }
  getTemperature()
    .then(result => showText(JSON.parse(result.responseText).main.temp))
    .catch(error => showText('Error happened: ' + error.status + ' ' + error.statusText));
  showText('Wait for this...');
}
