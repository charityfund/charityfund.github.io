"use strict";

var ComputerItem = function(res) {
	if (res) {
		var obj = JSON.parse(res);
		this.no = obj.no;
		this.computer_model = obj.computer_model;
		this.borrower = obj.borrower;
	} else {
    this.no = "";
    this.computer_model = "";
    this.borrower = "";
	}
};

ComputerItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var ComputerLending = function () {
  LocalContractStorage.defineMapProperty(this, "repo", {
    parse: function (res) {
      return new ComputerItem(res);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
};

ComputerLending.prototype = {
  init: function () {
    // todo
  },

  save: function (no, computer_model) {
    no = no.trim();
    computer_model = computer_model.trim();
    if (no === "" || computer_model === ""){
        throw new Error("computer information error");
    }
    if (no.length > 64 || computer_model.length > 64){
        throw new Error("computer information exceed limit length")
    }

    var from = Blockchain.transaction.from;
    var computerItem = this.repo.get(no);
    if (computerItem){
        throw new Error("computer has been borrowed");
    }

    computerItem = new ComputerItem();
    computerItem.borrower = from;
    computerItem.no = no;
    computerItem.computer_model = computer_model;

    this.repo.put(no, computerItem);
  },

  get: function (no) {
    no = no.trim();
    if ( no === "" ) {
        throw new Error("empty no")
    }
    return this.repo.get(no);
  }
};
module.exports = ComputerLending;