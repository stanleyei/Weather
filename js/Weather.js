var norm = [
    "基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣",
    "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市",
    "嘉義縣", "臺南市", "高雄市", "屏東縣", "臺東縣",
    "花蓮縣", "宜蘭縣", "澎湖縣", "金門縣", "連江縣"
];
moment.locale('zh-tw');
ShowTime();
eyeCatch()

//向網站發送請求
fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-34FB2911-10A9-4F0B-9FAD-997DD3B43AF5')

    //將回應的資料取出
    .then(function (response) {
        return response.text();
    })

    //使用得到的資料
    .then(function (result) {

        //讀到資料(將JSON格式轉換成JS可使用的object)
        var data = JSON.parse(result);
        var location = data["records"]["location"];

        //將資料放入norm這個陣列重新排列組合出norm新的陣列
        location.forEach(function (location) {
            norm[norm.indexOf(location["locationName"])] = {
                locationName: location["locationName"],
                weather: location["weatherElement"][0]["time"][1]["parameter"]["parameterName"],
                minT: location["weatherElement"][2]["time"][1]["parameter"]["parameterName"],
                maxT: location["weatherElement"][4]["time"][1]["parameter"]["parameterName"],
                pop: location["weatherElement"][1]["time"][1]["parameter"]["parameterName"]
            }
        });
        
        //讀取norm陣列的物件並判斷weather的值後放入網頁中
        ShowWeather(0);
    })

//切換顯示指定區域的按鈕監聽事件
btn_allarea.addEventListener('click',function(){
    eyeCatch();
    ShowWeather(0);
});

btn_north.addEventListener('click',function(){
    eyeCatch();
    ShowWeather(0, 7);
});

btn_middle.addEventListener('click',function(){
    eyeCatch();
    ShowWeather(7, 13);
});

btn_south.addEventListener('click',function(){
    eyeCatch();
    ShowWeather(13, 16);
});

btn_east.addEventListener('click',function(){
    eyeCatch();
    ShowWeather(16, 19);
});

btn_island.addEventListener('click',function(){
    eyeCatch();
    ShowWeather(19);
});

//顯示時間的函式
function ShowTime() {
    time_big.innerHTML = moment().format('YYYY 年 MM 月 DD 日 dddd');
    time_small.innerHTML = moment().format('HH : mm : ss');
    setTimeout('ShowTime()', 1000);
};

//讀取norm陣列的物件並判斷weather的值後放入網頁中的函式
function ShowWeather(from, to){
    container.innerHTML = ''
    norm.slice(from, to).forEach(function (norm) {

        var className ;
        if(norm["weather"] ==='晴時多雲'){
            className = 'mostly-clear'
        }
        else if(norm["weather"] ==='陰天'){
            className = 'cloudy'
        }
        else if(norm["weather"] ==='多雲' || norm["weather"] ==='多雲時陰'){
            className = 'partly-cloudy'
        }
        else if(norm["weather"].match('雨')){
            className = 'rainy'
        }
        else if(norm["weather"] ==='晴天'){
            className = 'claear'
        }
        else{
            className = 'mostly-clear'
        }
        
        container.innerHTML +=
        `<div class="card ${className}">
        <h2 class="h2">${norm["locationName"]}</h2>
        <div>明日天氣：${norm["weather"]}</div>
        <div>明日温度：${norm["minT"]}&degC ～ ${norm["maxT"]}&degC</div>
        <div>降雨機率：${norm["pop"]}%</div>
        <div>`
    });  
};

//過場動畫的函式
function eyeCatch(){
    eye_catch.classList.add('eye_catch');
    setTimeout(function(){
        eye_catch.classList.remove('eye_catch')
    },2000);
}

const testBtn = document.querySelector('#test');
testBtn.addEventListener('click', function() {
  window.DeviceMotionEvent.requestPermission()
  .then(function(state) {
    if ('granted' === state) {
      //用户同意授权
      alert('OK');
      window.addEventListener('devicemotion', myYaoyiyoaHandler, true);
    } else {
      //用户拒绝授权
      alert('摇一摇需要授权设备运动权限,请重启应用后,再次进行授权!')
    }
  })
  .catch(function(err) {
    alert('error: ' + err)
  })
});

function myYaoyiyoaHandler(event) {
  const alphaOutput = document.querySelector('#alpha');
  const betaOutput = document.querySelector('#beta');
  const gammaOutput = document.querySelector('#gamma');
  const alpha = event.alpha;
  const beta = event.beta ;
  const gamma = event.gamma;
  alphaOutput.innerHTML = alpha;
  betaOutput.innerHTML = beta;
  gammaOutput.innerHTML = gamma;
}
