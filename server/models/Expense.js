const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({

  userId:String,

  title:{
    type:String,
    required:true
  },

  amount:{
    type:Number,
    required:true
  },

  category:{
    type:String,
    default:"Other"
  },

  type:{
    type:String,
    default:"expense"
  },

  date:{
    type:Date,
    default:Date.now
  }

});

module.exports=
mongoose.model(
"Expense",
expenseSchema
);