class Weather{
  city = '';
  weather = null;

  setCity(data){
    this.city = data;
  }

  getIconById(time, id, https){
    console.log(time, id)
    var dataIcon = [
      // { "day" : "assets/img/sunny.svg", "night" : "assets/img/night.svg", "icon" : 113 },
      // { "day" : "assets/img/partly_cloudy_day.svg", "night" : "assets/img/partly_cloudy_night.svg", "icon" : 116 },
      // { "day" : "assets/img/cloudy.svg", "night" : "assets/img/cloudy.svg", "icon" : 119 },
      // { "day" : "assets/img/cloudy.svg", "night" : "assets/img/cloudy.svg", "icon" : 122 },
      // { "day" : "assets/img/day_rain_possible.svg", "night" : "assets/img/night_rain_possible.svg", "icon" : 176 },
      // { "day" : "assets/img/day_rain_shower.svg", "night" : "assets/img/night_rain_possible.svg", "icon" : 353 },
      // { "day" : "assets/img/day_rain_possible.svg", "night" : "assets/img/night_rain_possible.svg", "icon" : 299 },
      // { "day" : "assets/img/day_rain_shower.svg", "night" : "assets/img/night_rain_shower.svg", "icon" : 302 },
      // { "day" : "assets/img/drizzle.svg", "night" : "assets/img/drizzle.svg", "icon" : 263 },
      // // { "day" : "assets/img/foggy.gif", "night" : "assets/img/foggy.gif", "icon" : 143 },
      // // { "day" : "assets/img/foggy.gif", "night" : "assets/img/foggy.gif", "icon" : 176 },
      // { "day" : "assets/img/thunder.svg", "night" : "assets/img/thunder.svg", "icon" : 293 },
      // { "day" : "assets/img/thunder.svg", "night" : "assets/img/thunder.svg", "icon" : 386 },
    ]
    console.log(dataIcon.find(elem => elem['icon'] == id))
    var icon = (dataIcon.find(elem => elem['icon'] == id) != undefined) ? dataIcon.find(elem => elem['icon'] == id)[time] : 'https:'+https;
    return icon;
  }

  async setCountry(){
    this.closeShowChooseCity();
    localStorage["city"] = this.city;
    await fetch(`http://api.weatherapi.com/v1/forecast.json?key=b54e97a1fc9c464d8ef155116231903&q=${this.city}&days=3&aqi=no&lang=ru`)
      .then(response => response.json())
      .then(data => {this.weather = data})
      .catch(err => console.error(err));


    document.querySelector("#weatherContry").innerHTML = `${this.weather.location.name}, ${this.weather.location.country}`;
    this.dateWeather();
    document.querySelector("#icon").setAttribute("src", this.getIconById(this.weather.current.condition.icon.split('/').splice(-2)[0], this.weather.current.condition.icon.split('/').splice(-1)[0].split('.')[0], this.weather.current.condition.icon));
    document.querySelector("#temp").innerHTML = `${this.weather.current.temp_c}°C`;
    document.querySelector("#feelslike").innerHTML = `${this.weather.current.feelslike_c}°C`;
    document.querySelector("#wind_kph").innerHTML = `${this.weather.current.wind_kph} км/ч`
    document.querySelector("#precip_mm").innerHTML = `${this.weather.current.precip_mm} мм`;
    this.curDayHours();
    this.weekWeather();
  }

  closeShowChooseCity(){
    document.querySelector("#showChooseCity").setAttribute("style", "display: none");
  }

  openShowChooseCity(){
    document.querySelector("#showChooseCity").setAttribute("style", "display: block;");
  }

  dateWeather() {
    var date = '';
    if(this.weather){
      if(this.weather.location.hasOwnProperty("localtime")){
        date = new Date(this.weather.location.localtime).toLocaleDateString([], {year: "numeric", month: "long", day: "numeric"});
        document.querySelector("#dateWeather").innerHTML = `${date}`;
      }
    }
  }

  handleClick(event){
    var nextElement = event.target.parentElement.children[1];
    if(event.target.dataset.handle == "handleClick"){
      nextElement = event.target.parentElement.children[1];
    } else {
      nextElement = event.target.parentElement.parentElement.children[1];
    }
    if (nextElement.style.display == "none") {
      if(event.target.dataset.handle == "handleClick"){
        event.target.classList.remove("rounded-b-2xl");
      } else {
        event.target.parentElement.classList.remove("rounded-b-2xl");
      }
      nextElement.style.display = "block";
    } else {
      if(event.target.dataset.handle == "handleClick"){
        event.target.classList.add("rounded-b-2xl");
      } else {
        event.target.parentElement.classList.add("rounded-b-2xl");
      }
      nextElement.style.display = "none";
    }
  }

  curDayHours(){
    var arrHours = this.weather.forecast.forecastday[0]["hour"];
    var divScrollHour = [];
    for(var i = 0; i < arrHours.length; i++) {
      var time = arrHours[i]["time"];
      var hour = +(new Date(time).toLocaleTimeString([], {hour12: false, hour: 'numeric'})) % 24;
      hour = (hour < 10) ? '0'+hour: hour;
      if(+hour >= +(new Date().getHours())){
        divScrollHour.push(
          `<div class='flex flex-col' style='min-width: 100px'>
            <span>${hour+':00'}</span>
            <img src='${this.getIconById(arrHours[i]["condition"]["icon"].split('/').splice(-2)[0], arrHours[i]["condition"]["icon"].split('/').splice(-1)[0].split('.')[0], arrHours[i]["condition"]["icon"])}' style='width: 100px' />
            <span style='margin-top: -10px'>${arrHours[i]["temp_c"]}°</span>
          </div>`
        );
      }
    }
    if(divScrollHour.length < 24){
      var arrHours = this.weather.forecast.forecastday[1]["hour"];
      const lengthArr = arrHours.length - divScrollHour.length;
      for(var i = 0; i < lengthArr; i++) {
        var time = arrHours[i]["time"];
        var hour = +(new Date(time).toLocaleTimeString([], {hour12: false, hour: 'numeric'})) % 24;
        hour = (hour < 10) ? '0'+hour: hour;
        var day = new Date(this.weather.forecast.forecastday[1]["date"]).toLocaleDateString('ru-RU', {day: 'numeric', month: 'numeric'});
        if(hour == '00') hour = day;
        else hour = hour+':00';
        divScrollHour.push(
          `<div class='flex flex-col' style='min-width: 100px'>
            <span>${hour}</span>
            <img src='${this.getIconById(arrHours[i]["condition"]["icon"].split('/').splice(-2)[0], arrHours[i]["condition"]["icon"].split('/').splice(-1)[0].split('.')[0], arrHours[i]["condition"]["icon"])}' style='width: 100px' />
            <span style='margin-top: -10px'>${arrHours[i]["temp_c"]}°</span>
          </div>`
        );
      }
    }
    document.querySelector("#curDayHours").innerHTML = '';
    for(var i = 0; i < divScrollHour.length; i++) {
      document.querySelector("#curDayHours").innerHTML += divScrollHour[i];
    }
  }

  weekWeather() {
    var arrDays = this.weather.forecast.forecastday;
    var divDays = [];
    for(var i = 1; i < arrDays.length; i++) {
      var arrHours = this.weather.forecast.forecastday[i]["hour"];
      var divScrollHour = [];
      for(var j = 0; j < arrHours.length; j++) {
        var time = arrHours[j]["time"];
        var hour = +(new Date(time).toLocaleTimeString([], {hour12: false, hour: 'numeric'})) % 24;
        hour = (hour < 10) ? '0'+hour: hour;
        divScrollHour.push(
          `<div class='flex flex-col' style='min-width: 100px'>
            <span>${hour+':00'}</span>
            <img src='${this.getIconById(arrHours[j]["condition"]["icon"].split('/').splice(-2)[0], arrHours[j]["condition"]["icon"].split('/').splice(-1)[0].split('.')[0], arrHours[j]["condition"]["icon"])}' style='width: 100px' />
            <span style='margin-top: -10px'>${arrHours[j]["temp_c"]}°</span>
          </div>`
        );
      }
      var date = this.weather.forecast.forecastday[i]["date"];
      divDays.push(
        `<div class="flex flex-col w-full gap-y-1">
          <div class='flex flex-row justify-between items-center shadow-2xl shadow-slate-900 bg-black/30 rounded-t-2xl rounded-b-2xl w-full' data-handle="handleClick" style='min-width: 100px'>
            <div class='flex flex-col w-1/4'>
              <span>${new Date(date).toLocaleDateString([], {weekday: "long"})}</span>
              <span>${new Date(date).toLocaleDateString([], {month: "long", day: "numeric"})}</span>
            </div>
            <span class='w-1/3'>${arrDays[i]["day"]["avgtemp_c"]}°</span>
            <img class='w-1/3' src='${this.getIconById(arrDays[i]["day"]["condition"]["icon"].split('/').splice(-2)[0], arrDays[i]["day"]["condition"]["icon"].split('/').splice(-1)[0].split('.')[0], arrDays[i]["day"]["condition"]["icon"])}' style='width:100px'/>
          </div>
          <div class="flex flex-col mb-10 shadow-xl shadow-slate-900 bg-black/30 rounded-b-2xl" style='display: none'>
            <div class="flex flex-row overflow-x-auto h-auto">
              ${divScrollHour.map(element => {
                return element;
              }).join('')}
            </div>
          </div>
        </div>`
      );
    }
    document.querySelector("#weekWeather").innerHTML = '';
    for(var i = 0; i < divDays.length; i++) {
      document.querySelector("#weekWeather").innerHTML += divDays[i];
    }
    const handleAll = document.querySelectorAll("[data-handle=handleClick]");
    for(var hAi = 0; hAi < handleAll.length; hAi++){
      handleAll[hAi].addEventListener('click', (event)=>{
        this.handleClick(event);
      });
    }
  }
}

const weatherObj = new Weather();

(() => {
  document.querySelector("#showChooseCity").setAttribute("style", "display: none");

  if(localStorage["city"] != undefined){
    weatherObj.setCity(localStorage["city"]);
  }

  if(weatherObj.city != ''){
    weatherObj.setCountry();
  } else {
    weatherObj.setCity('Almaty');
    weatherObj.setCountry();
  }

  document.addEventListener("keydown", (event)=>{
    if(event.key === "Escape"){
      weatherObj.closeShowChooseCity();
    }
  })
})();

document.querySelector("#closeShowChooseCity").addEventListener('click', () =>{
  weatherObj.closeShowChooseCity();
});

document.querySelector("#openShowChooseCity").addEventListener('click', () => {
  weatherObj.openShowChooseCity();
});

document.querySelector("#setCountry").addEventListener('click', () => {
  weatherObj.setCountry();
});

document.querySelector("#cityInput").addEventListener('change', () => {
  const city = document.querySelector("#cityInput").value;
  weatherObj.setCity(city);
});