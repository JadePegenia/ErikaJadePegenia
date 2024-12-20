const mongoose = require('mongoose');

const pocketMoneySchema = new mongoose.Schema({
    pocketAmount:{type: Number, required:true,},    
    Date: {type: Date, default: Date.now },
});
const moneydetails = mongoose.models.PocketMoney || mongoose.model('PocketMoney', pocketMoneySchema);

module.exports = moneydetails; //export the model