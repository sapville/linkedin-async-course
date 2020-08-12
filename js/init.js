function showResult() {

  function showText(sText) {
    document.getElementById('paragraph1').innerHTML = sText;
  }

  const oReq = new XMLHttpRequest();
  const sAppID = 'da1240fb8032e8e258bc11509bc2ce04';
  // const sAppID = '';
  oReq.addEventListener('load', function() {
    if (this.status === 200) {
      showText(JSON.parse(this.responseText).main.temp);
    }
    else {
      showText('Error happened: ' + this.status + ' ' + this.statusText);
    }
  });
  oReq.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=Vancouver&units=metric&appid=' + sAppID);
  oReq.send();
  showText('Wait for this...');
}
