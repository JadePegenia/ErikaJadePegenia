const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    Date:{type: Date, default: Date.now},     
    Description: String,
    Category:String,
    Amount: String,
    PaymentMethod: String,  
});
const Details = mongoose.model('index', ExpenseSchema);

module.exports = Details; //export the model