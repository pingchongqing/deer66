// pages/please/please.js
// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/wafer2-client-sdk/index');
// 引入配置
var config = require('../../config');

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    });
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMap:false,
    showDatePicker: false,
    showTimePicker:false,
    timefocus: false,
    mapInfo: {},
    markers: [],
    formData:{},
    controls: [{
      id: 1,
      iconPath: 'images/close.png',
      position: {
        left: 0,
        top: 0,
        width: 50,
        height: 50
      },
      clickable: true
    },{
        id: 2,
        iconPath: 'images/icon1.png',
        position: {
          left: 0,
          top: 50,
          width: 50,
          height: 50
        },
        clickable: true
    }],
    date:'',
    time:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
    wx.getLocation({
      type: 'wgs84',
      success:  res => {
        this.setData({
          mapInfo: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  doShowMap: function () {
    //没有标记地址
    if (!this.data.formData.address) {
      //选择地图
      wx.chooseLocation({
        success: res => {
          console.log(res)
          //在地图上标记位置
          this.setData({
            markers: [{
              latitude: res.latitude,
              longitude: res.longitude,
              iconPath: "images/address.png",
              id: 0,
              width: 50,
              height: 50
            }],
            formData: Object.assign(this.data.formData, { address: res.name||res.address }),
          })
        }
      })
    } else {
      this.setData({
        showMap: !this.data.showMap
      })
      this.mapCtx.includePoints({
        padding: [10],
        points: [{
          latitude: this.data.markers[0].latitude,
          longitude: this.data.markers[0].longitude,
        }, this.data.mapInfo]
      })
    }

  },
  controltap: function(e) {
    switch (e.controlId) {
      case 1:
        this.setData({
          showMap: false
        })
        break;
      case 2:
        this.mapTap()
        break;
      default:
        break;
    }
  },
  mapTap: function(e) {
    //选择地图
    wx.chooseLocation({
      success: res => {
        //在地图上标记位置
        this.setData({
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: "images/address.png",
            id: 0,
            width: 50,
            height: 50
          }],
          formData: Object.assign(this.data.formData, { address: res.name}),
          showMap: false
        })
      }
    })

  },
  doShowTimePicker() {
    this.setData({
      showTimePicker:true
    })
  },
  doShowDatePicker() {
    this.setData({
      showDatePicker: true
    })
  },
  bindDateChange(e) {
    this.setData({
      date:e.detail.value,
      time:''
    })
  },
  bindTimeChange(e) {
    this.setData({
      time: ' '+e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log(e)
    let value = e.detail.value
    if (value&&!value.time) {
      wx.showModal({
        title: '提示',
        content: '需要一个准确的时间',
        showCancel: false
      })
    } else if (value&&!value.address) {
      wx.showModal({
        title: '提示',
        content: '需要一个地点',
        showCancel: false
      })
    } else {
      console.log(value);
      showBusy('正在请求');
      qcloud.request({
        method: 'POST',
        url: config.service.host + '/weapp/please',
        data: {idcreatby:'dfw', ...value},
        success: function (res) {
          showSuccess('请求成功完成');
          console.log(res)
        },
        fail(error) {
            showModel('请求失败', error);
            console.log('request fail', error);
        },
      })
    }
  },

})
