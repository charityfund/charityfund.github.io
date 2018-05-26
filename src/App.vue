<template>
  <div id="app">
    <header>
      <h1 class="h1_left">基于星云链的善款去向追踪</h1>
    </header>
    <main>
      <div class="section_wrap">
        <section class="section section_left">
          <h2 class="h2_left">添加善款</h2>
          <div class="content_wrap">
            <input type="text" v-model="fundTotal" placeholder="总金额（单位：元）" onkeyup="value=value.replace(/[^\d]/g,'')">
            <input type="text" v-model="fundDes" placeholder="善款描述">
            <button class="display_b" @click="addFund" :class="{'noCanAdd': noCanAdd}">
              <span v-if="noCanAdd">
                <span>上方数据填写完整可以添加</span>
              </span>
              <span v-else-if="uploading">数据上传中...请稍候</span>
              <span v-else>添加去向</span>
            </button>
          </div>
        </section>
        <section class="section">
          <h2 class="h2_left">查询善款</h2>
          <div class="content_wrap">
            <input type="text" v-model="findFundId" placeholder="善款id">
            <button class="display_b" @click="findFund" :class="{'noCanFind': noCanFind}">
              <span v-if="noCanFind">上方数据填写完整可以查询</span>
              <span v-else>查询</span>
            </button>
          </div>
        </section>
      </div>
      <transition name="fade">
        <section class="section_wrap" v-show="hasResult">
          <div id="resultEcharts"></div>
          <div class="insertWhere">
            <input type="text" v-model="nowFundId" placeholder="善款id" readonly>
            <input type="text" v-model="insertFundWhere" placeholder="去向说明">
            <input type="text" v-model="insertWhereAmt" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="去向金额">
            <button class="display_b" @click="insertWhere" :class="{'noCanInsert': noCanInsert}">
              <span v-if="noCanInsert">
                <span>上方数据填写完整可以添加去向</span>
              </span>
              <span v-else-if="uploading">数据更新中...请稍候</span>
              <span v-else>添加去向</span>
            </button>
          </div>
        </section>
      </transition>
    </main>
    <footer>
      <section>
        <img src="./assets/logo.png" alt="星云链logo">
        <span>请安装 <a href="https://github.com/ChengOrangeJu/WebExtensionWallet" target="_blank">WebExtensionWallet</a> 官方钱包插件后使用 BitBook 星云数字货币记账</span>
      </section>
    </footer>
  </div>
</template>

<script>
var echarts = require('echarts');

export default {
  name: 'app',
  data () {
    return {
      fundAddId: '',
      fundTotal: '',
      fundDes: '',
      findFundId: '',
      hasResult: false,
      findFundTotal: '',
      findFundWhere: [],
      findFundAmt: [],
      // 当前查询出来的id
      nowFundId: '',
      insertFundWhere: '',
      insertWhereAmt: '',
      uploading: false
    }
  },
  computed: {
    noCanAdd() {
      if(this.fundTotal != '' && this.fundDes != '') {
        return false
      } else {
        return true
      }
    },
    noCanFind() {
      if(this.findFundId != '') {
        return false
      } else {
        return true
      }
    },
    noCanInsert() {
      if(this.insertFundWhere != '' && this.insertWhereAmt != '') {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    addFund() {
      if(this.noCanAdd) return
      this.fundAddId = Number(Math.random().toString().substr(3,0) + Date.now()).toString(36)
      let callArgs = '["add","' + this.fundAddId + '", "' + this.fundTotal + '","' + this.fundDes + '","zhanwei","zhanwei"]'
      saveFun(callArgs, this, 'add');
    },
    findFund() {
      if(this.noCanFind) return
      var from = Account.NewAccount().getAddressString(),
        value = "0",
        nonce = "0",
        gas_price = "1000000",
        gas_limit = "2000000",
        callFunction = "get",
        callArgs = "[\"" + this.findFundId + "\"]",
        contract = {
          "function": callFunction,
          "args": callArgs
        };

      neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then( (resp) => {
        dealResult(resp, this)
      }).catch( (err) => {
        console.log("error:" + err.message)
      })
    },
    insertWhere() {
      if(this.noCanInsert) return

      let sum = parseInt(this.findFundAtm[0]),
        now = 0

      for(let i = 1;i < this.findFundAtm.length;i++) {
        now += parseInt(this.findFundAtm[i])
      }

      now += parseInt(this.insertWhereAmt)

      if(sum < now) {
        alert('剩余金额不足此次支出去向金额')
        return
      }

      let callArgs = '["insert","' + this.nowFundId + '", "zhanwei","zhanwei","' + this.insertFundWhere + '","' + this.insertWhereAmt + '"]'
      saveFun(callArgs, this, 'update');
    }
  },
  mounted() {
    window._this = this;
    initChart(this)
  }
}

function saveFun(callArgs, _this, type) {
  _this.uploading = true
  let to = dappAddress,
    value = "0",
    callFunction = "save";

  window.type = type

  nebPay.call(to, value, callFunction, callArgs, {
    listener: cbPush
  });

}

function cbPush(resp) {
  window.intervalQuery = setInterval(function () {
    funcIntervalQuery(resp);
  }, 5000);
  
}

function funcIntervalQuery(resp) {
  window._this.$http.post('https://mainnet.nebulas.io/v1/user/getTransactionReceipt', {
    hash: resp.txhash
  }).then(res => {
    if (res.data.result.status === 1) {
      if(window.type === 'add') {
        alert('添加善款成功，id为' + window._this.fundAddId + '，请妥善保存')
        window._this.findFundId = window._this.fundAddId
      } else {
        alert('更新善款成功')
        window._this.findFunId = window._this.nowFundId
        window._this.findFund()
      }
      window._this.uploading = false
      clearInterval(window.intervalQuery)
    }
  })
}

function dealResult(resp, _this) {
  let result = JSON.parse(resp.result)

  _this.findFundTotal = result.fund_total
  _this.findFundWhere = result.fund_where.split(',')
  _this.findFundAtm = result.where_amt.split(',')
  _this.findFundWhere[0] = '总金额'
  _this.findFundAtm[0] = _this.findFundTotal

  _this.nowFundId = _this.findFundId

  updateChart(_this)
  _this.hasResult = true
}

function initChart(_this) {
  window.myChart = echarts.init(document.getElementById('resultEcharts'));
}

function updateChart(_this) {
  var option = {
    title: {
      text: '善款' + _this.findFundId + '去向说明'
    },
    tooltip: {},
    legend: {
      data:['去向']
    },
    xAxis: {
      data: _this.findFundWhere
    },
    yAxis: {},
    series: [{
      name: '去向',
      type: 'bar',
      data: _this.findFundAtm
    }]
  };

  window.myChart.setOption(option);
}

</script>

<style>
* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

html, body, #app{
  width: 100%;
  margin: 0;
  padding: 0;
}

html {
  min-height: 100%;
}

body {
  background-color: #f6f6f6;
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f6f6f6;
  height: 100%;
}

header {
  background-color: #FFF;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.04);
  height: 60px;
  line-height: 60px;
}

header h1 {
  width: 1200px;
  margin: 0 auto;
}

h1, h2 {
  margin: 0;
  font-weight: normal;
}

.h1_left, .h2_left {
  text-align: left;
}

h2 {
  padding-left: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

input, button {
  outline: none;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  border: 0px;
}

input, .display_b {
  display: block;
}

input {
  padding-left: 10px;
  width: 100%;
  margin-top: 10px;
}

button {
  cursor: pointer;
  background-color: #07aefc;
  color: #FFF;
  width: 100px;
}

.noCanAdd, .noCanFind, .noCanInsert {
  background-color: #CCC;
}

.display_b {
  width: 200px;
  margin-top: 10px;
}

button:hover {
  opacity: .7;
}

main {
  width: 1200px;
  margin: 0 auto;
  margin-bottom: 100px;
}

.section_wrap {
  margin-top: 30px;
  overflow: hidden;
}

.section_wrap::after {
  clear: both;
  content: '';
  display: block;
}

.section {
  width: 50%;
  float: left;
}

.section_left {
  border-right: 1px solid #ccc;
}

.content_wrap {
  padding: 20px;
}

#resultEcharts {
  width: 900px;
  height: 400px;
  float: left;
}

.insertWhere {
  width: 300px;
  height: 400px;
  float: right;
}

footer {
  width: 1200px;
  margin: 0 auto;
  height: 60px;
  line-height: 60px;
  position: relative;
}

footer img {
  float: left;
}

footer span {
  float: right;
  font-size: 13px;
}

footer section {
  position: absolute;
  bottom: 20px;
  width: 1200px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
