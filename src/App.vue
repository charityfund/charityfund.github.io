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
            <input type="text" placeholder="善款id">
            <input type="text" placeholder="总金额（单位：元）">
            <input type="text" placeholder="善款描述">
            <button class="display_b">添加</button>
          </div>
        </section>
        <section class="section">
          <h2 class="h2_left">查询善款</h2>
          <div class="content_wrap">
            <input type="text" placeholder="善款id">
            <button class="display_b">查询</button>
          </div>
        </section>
      </div>
      <div class="section_wrap">
        <h2>当前善款统计</h2>
        <table rules="all" frame="hsides" borderColor="#ccc">
          <tr>
            <th width="40%">善款id</th>
            <th width="40%">善款描述</th>
            <th width="20%">操作</th>
          </tr>
          <tr>
            <td>12312312312312312312</td>
            <td>12312314234asdsdfasd</td>
            <td><button>查询</button></td>
          </tr>
        </table>
      </div>
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
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
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
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f6f6f6;
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
  margin-bottom: 140px;
}

.section_wrap {
  margin-top: 30px;
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

table {
  width: 90%;
  table-layout: auto;
  margin: 0 auto;
}

tr {
  height: 40px;
}

footer {
  width: 1200px;
  margin: 0 auto;
  height: 60px;
  line-height: 60px;
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
</style>
