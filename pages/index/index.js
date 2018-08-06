//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    conditionCode: {
      100: "./image/100.svg",
      101: "./image/101.svg",
      102: "./image/104.svg",
      103: "./image/103.svg",
      104: "./image/104.svg",
      200: "./image/200.svg",
      201: "./image/200.svg",
      202: "./image/200.svg",
      203: "./image/200.svg",
      204: "./image/200.svg",
      205: "./image/201.svg",
      206: "./image/201.svg",
      207: "./image/201.svg",
      208: "./image/201.svg",
      209: "./image/201.svg",
      210: "./image/201.svg",
      211: "./image/201.svg",
      212: "./image/201.svg",
      213: "./image/201.svg",
      300: "./image/300.svg",
      301: "./image/301.svg",
      302: "./image/302.svg",
      303: "./image/302.svg",
      304: "./image/304.svg",
      305: "./image/305.svg",
      306: "./image/306.svg",
      307: "./image/301.svg",
      308: "./image/308.svg",
      309: "./image/305.svg",
      310: "./image/310.svg",
      311: "./image/310.svg",
      312: "./image/308.svg",
      313: "./image/304.svg",
      400: "./image/400.svg",
      401: "./image/401.svg",
      402: "./image/402.svg",
      403: "./image/402.svg",
      404: "./image/304.svg",
      405: "./image/304.svg",
      406: "./image/306.svg",
      407: "./image/402.svg",
      500: "./image/500.svg",
      501: "./image/501.svg",
      502: "./image/502.svg",
      503: "./image/503.svg",
      504: "./image/503.svg",
      507: "./image/503.svg",
      508: "./image/503.svg",
      900: "./image/900.svg",
      901: "./image/900.svg",
      999: "./image/900.svg",
    },
    location: "none",
    city: "杭州",
    summary: "多云",
    localTemperature: "1",
    localIcon: "./image/304.svg",
    days: [{
      time: "今天",
      icon: "./image/100.svg",
      detail: "多云",
      minTemperature: "10",
      maxTemperature: "16",
    }, ],
    suggestion: {
      air: "良", // 空气指数
      comf: "良", // 舒适度指数
      cw: "良", // 洗车指数
      drsg: "良", // 穿衣指数
      flu: "良", // 感冒指数
      sport: "良", // 运动指数
      trav: "良", // 旅游指数
      uv: "良", // 紫外线指数
    },
    suggestionIcon: {
      air: "./image/life/air.svg",
      cw: "./image/life/cw.svg",
      sport: "./image/life/sport.svg",
      drsg: "./image/life/drsg.svg",
      flu: "./image/life/flu.svg",
      uv: "./image/life/uv.svg",
      trav: "./image/life/trav.svg",
      comf: "./image/life/comf.svg",
    },
    detail: {
      windSpeed: "1",
      windy: "1",
      temperature: "1",
      barometer: "1",
      humidity: "1",
    },
    detailIcon: {
      windy: "./image/detail/windy.svg",
      barometer: "./image/detail/barometer.svg",
      temperature: "./image/detail/temperature.svg",
      humidity: "./image/detail/humidity.svg",
    },
    show: true,
    prompt: "Loading ...", // 页面的初始数据
    lodingsrc: "./image/location/umbrella.svg",
    air: {
      aqi: '',
      co: '',
      no2: '',
      o3: '',
      pm10: '',
      pm25: '',
      qlty: '',
      so2: '',
    }
  },
  getUserLocation: function() { // 获取用户当前经纬度
    let self = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        self.decodingGps(res.longitude,res.latitude)
      },
      fail: function() {
        self.add()
      }
    })
  },
  decodingGps: function(x,y) { // 解析经纬度到到地址
    let self = this
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        location: x + "," + y,
        key: 'a057fd488aa26d4d6da587310bffe5d8',
      },
      header: {'content-type': 'application/json'},
      success: function(res) {
        console.log(res.data.regeocode.addressComponent.district)
        self.setData({
          location: res.data.regeocode.addressComponent.district
        })
        self.getWeather()
      },
      fail: function() {
        self.add()
      }
    })
  },
  getWeather: function() { // 获取并解析天气
    let self = this
    wx.request({
      url: 'https://free-api.heweather.com/v5/weather',
      data: {city: self.data.location, key: '01a7798b060b468abdad006ea3de4713'},
      header: {'content-type': 'application/json'},
      success: function(res) {
        // console.log(res)
        let detailTemp = {}
        let moreDaysTemp = {}
        let suggestionTemp = {}
        let moreDaysMap = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
        let airTemp = {}
        airTemp = { // 空气质量
          aqi: res.data.HeWeather5[0].aqi.city.aqi,
          co: res.data.HeWeather5[0].aqi.city.co,
          no2: res.data.HeWeather5[0].aqi.city.no2,
          o3: res.data.HeWeather5[0].aqi.city.o3,
          pm10: res.data.HeWeather5[0].aqi.city.pm10,
          pm25: res.data.HeWeather5[0].aqi.city.pm25,
          qlty: res.data.HeWeather5[0].aqi.city.qlty,
          so2: res.data.HeWeather5[0].aqi.city.so2,
        }
        detailTemp = { // 实况天气
          windSpeed: ((res.data.HeWeather5[0].now.wind.spd * 0.278) / 0.621).toFixed(0),
          windy: res.data.HeWeather5[0].now.wind.dir,
          temperature: res.data.HeWeather5[0].now.fl,
          barometer: res.data.HeWeather5[0].now.pres,
          humidity: res.data.HeWeather5[0].now.hum,
        }
        for (let i = 1; i < res.data.HeWeather5[0].daily_forecast.length - 1; i++) { // 天气预报forecast
          moreDaysTemp[i] = {
            time: moreDaysMap[new Date(res.data.HeWeather5[0].daily_forecast[i].date.split("-").join("/")).getDay()],
            icon: self.data.conditionCode[res.data.HeWeather5[0].daily_forecast[i].cond.code_d],
            detail: res.data.HeWeather5[0].daily_forecast[i].cond.txt_d,
            minTemperature: res.data.HeWeather5[0].daily_forecast[i].tmp.min,
            maxTemperature: res.data.HeWeather5[0].daily_forecast[i].tmp.max
          }
        }
        suggestionTemp = { // 生活指数
          air: res.data.HeWeather5[0].suggestion.air.brf,
          comf: res.data.HeWeather5[0].suggestion.comf.brf,
          cw: res.data.HeWeather5[0].suggestion.cw.brf,
          drsg: res.data.HeWeather5[0].suggestion.drsg.brf,
          flu: res.data.HeWeather5[0].suggestion.flu.brf,
          sport: res.data.HeWeather5[0].suggestion.sport.brf,
          trav: res.data.HeWeather5[0].suggestion.trav.brf,
          uv: res.data.HeWeather5[0].suggestion.uv.brf,
        }
        self.setData({ // 更新数据
          city: res.data.HeWeather5[0].basic.city,
          summary: res.data.HeWeather5[0].now.cond.txt,
          localTemperature: res.data.HeWeather5[0].now.tmp,
          localIcon: self.data.conditionCode[res.data.HeWeather5[0].daily_forecast[0].cond.code_d],
          detail: detailTemp,
          suggestion: suggestionTemp,
          days: moreDaysTemp,
          air: airTemp,
          show: false,
        })
      },
      fail: function() {
        self.add()
      }
    })
  },
  onPullDownRefresh: function() { // 页面相关事件处理函数--监听用户下拉动作
    setTimeout(function() {
      wx.stopPullDownRefresh()
    },1000)
    if(!this.data.show){
      this.getUserLocation()
    }
  },
  onLoad: function() { // 生命周期函数--监听页面加载
    this.getUserLocation()
    wx.showShareMenu({ // 转发
      withShareTicket: true
    })
  },
  onShow: function() { // 生命周期函数--监听页面显示
    let dataFromSearch = wx.getStorageSync('data');
    if (dataFromSearch) {
      this.setData({
        location: dataFromSearch
      })
      wx.removeStorageSync('data')
      if (this.data.location === "auto") {
        this.getUserLocation()
      } else if (this.data.location) {
        this.getWeather()
      }
    }
  },
  add: function() { // 转跳到搜索页面
    wx.navigateTo({
      url: '/pages/search/index'
    })
  }
})
