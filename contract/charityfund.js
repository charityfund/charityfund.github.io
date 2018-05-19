"use strict";

var FundItem = function(res) {
  if(res) {
    var obj = JSON.parse(res);
    this.no = obj.no;
    this.fund_total = obj.fund_total;
    this.fund_where = obj.fund_where;
    this.fund_des = obj.fund_des;
    this.where_amt = obj.where_amt;
    this.borrower = obj.borrower;
  } else {
    // 善款id
    this.no = "";
    // 善款总金额
    this.fund_total = "";
    // 善款去向
    this.fund_where = "";
    // 去向金额
    this.where_amt = "";
    // 操作人
    this.borrower = "";
    this.fund_des = "";
  }
};

FundItem.prototype = {
  toString: function() {
    return JSON.stringify(this);
  }
}

var CharityFund = function() {
  LocalContractStorage.defineMapProperty(this, "repo", {
    parse: function (res) {
      return new FundItem(res);
    },
    stringify: function (o) {
      return o.toString();
    }
  }); 
}

CharityFund.prototype = {
  init: function() {},

  save: function(type, no, fund_total, fund_des, fund_where, where_amt) {
    type = type.trim();
    no = no.trim();
    var from = Blockchain.transaction.from;
    var fundItem = this.repo.get(no);
    // 添加善款
    if(type === 'add') {
      fund_total = fund_total.trim();
      fund_des = fund_des.trim();
      if(fundItem) {
        throw new Error("fund has been borrowed");
      }

      fundItem = new FundItem();
      fundItem.no = no;
      fundItem.fund_total = fund_total;
      fundItem.fund_des = fund_des;
      fundItem.borrower = from;
      fundItem.fund_where = '';
      fundItem.where_amt = '';

      this.repo.put(no, fundItem);

    } else if(type === 'insert') {
      // 增加善款去向
      fund_where = fund_where.trim();
      where_amt = where_amt.trim();
      /*
      var where_amts = fundItem.where_amt.split(',');
      var now_amt = 0;
      for(var i = 0;i < where_amts.length;i++) {
        now_amt = now_amt + parseInt(where_amts[i]);
      }
      if(now_amt + parseInt(where_amt) > parseInt(fundItem.fund_total)) {
        throw new Error("超过总金额");
      }*/

      fundItem.fund_where = fundItem.fund_where + ',' + fund_where;
      fundItem.where_amt = fundItem.where_amt + ',' + where_amt;

      this.repo.put(no, fundItem);
    }
  },

  get: function(no) {
    no = no.trim();
    if ( no === "" ) {
      //return this.repo.get();
      throw new Error("empty no")
    }

    return this.repo.get(no);
  }
}

module.exports = CharityFund;