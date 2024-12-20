const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const Details = require('./models/model'); //import the model
const moneydetails = require('./models/pocketmoney'); //import the model


app.use('/css', express.static('css'));


mongoose.connect('mongodb://localhost:27017/Expensetracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', async (req, res) =>  {
try{

    const transactiondetails = await Details.find();
    const pocketmoneydetails = await moneydetails.find();

        // Calculate total amount
      

    //per day 
    const now = new Date(); 
            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            const endOfDay = new Date(now.setHours(23, 59, 59, 999));

            const transactiondetail = await Details.find({
            Date: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });


    // Calculate total amount by date
    const totalsByDate = transactiondetails.reduce((result, transaction,) => {   
            try {
                const dateKey = new Date(transaction.Date).toISOString().split('T')[0];        
                const amount = parseFloat(transaction.Amount);
                if (result[dateKey]) {
                    result[dateKey] += isNaN(amount) ? 0 : amount;        } 
                else {
                    result[dateKey] = isNaN(amount) ? 0 : amount;        }
            } catch (error) {       
                console.error('Error processing transaction:', transaction, error);
            }
            return result;
        }, {});

       

      // Calculate remaining pocket money after transactions per day
    const remainingPocketMoneyByDate = pocketmoneydetails.reduce((result, money) => {
    const dateKey = new Date(money.Date).toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    const pocketAmount = parseFloat(money.pocketAmount) || 0; // Parse pocketAmount or default to 0
    const transactionTotalForDay = totalsByDate[dateKey] || 0; // Total transactions for the day
  
    // Initialize with pocket money amount if not already set
    if (!result[dateKey]) {
      result[dateKey] = pocketAmount;
    }
  
    // Subtract transaction amounts from pocket money for that day
    if (transactionTotalForDay <= result[dateKey]) {
      result[dateKey] -= transactionTotalForDay;
    } else {
      result[dateKey] = 0; // If transactions exceed pocket money, set remaining to 0
    }
  
    return result;
  }, {});
  
 
  
        
    // Calculate total amount by month
    const totalsByMonth = transactiondetails.reduce((monthresult, transaction) => {   
            try {
                // Extract the year and month as 'YYYY-MM' format
                const monthKey = new Date(transaction.Date).toISOString().slice(0, 7);  // 'YYYY-MM' format
                
                const amount = parseFloat(transaction.Amount);
                
                if (monthresult[monthKey]) {
                    monthresult[monthKey] += isNaN(amount) ? 0 : amount;
                } else {
                    monthresult[monthKey] = isNaN(amount) ? 0 : amount;
                }
            } catch (error) {       
                console.error('Error processing transaction:', transaction, error);
            }
            return monthresult;
        }, {});


    // Calculate total amount by year
    const totalsByYear = transactiondetails.reduce((yearresult, transaction) => {   
            try {
                // Extract the year and month as 'YYYY-MM' format
                const yearKey = new Date(transaction.Date).toISOString().slice(0, 4);  // 'YYYY' format
                
                const amount = parseFloat(transaction.Amount);
                
                if (yearresult[yearKey]) {
                    yearresult[yearKey] += isNaN(amount) ? 0 : amount;
                } else {
                    yearresult[yearKey]= isNaN(amount) ? 0 : amount;
                }
            } catch (error) {       
                console.error('Error processing transaction:', transaction, error);
            }
            return yearresult;
        }, {});

    const totalsByDateAndCategory = transactiondetails.reduce((result, transaction) => {
            try {
                const dateKey = new Date(transaction.Date).toISOString().split('T')[0];
                const category = transaction.Category || 'Uncategorized';
                const amount = parseFloat(transaction.Amount) || 0;
        
                if (!result[dateKey]) {
                    result[dateKey] = {}; // Initialize date entry
                }
        
                if (result[dateKey][category]) {
                    result[dateKey][category] += amount;
                } else {
                    result[dateKey][category] = amount;
                }
            } catch (error) {
                console.error('Error processing transaction:', transaction, error);
            }
        
            return result;
        }, {});

        const totalsByMonthAndCategory = transactiondetails.reduce((result, transaction) => {
            try {
                const monthKey = new Date(transaction.Date).toISOString().slice(0, 7); 
                const category = transaction.Category || 'Uncategorized';
                const amount = parseFloat(transaction.Amount) || 0;
        
                if (!result[monthKey]) {
                    result[monthKey] = {}; // Initialize date entry
                }
        
                if (result[monthKey][category]) {
                    result[monthKey][category] += amount;
                } else {
                    result[monthKey][category] = amount;
                }
            } catch (error) {
                console.error('Error processing transaction:', transaction, error);
            }
        
            return result;
        }, {});

        const totalsByYearAndCategory = transactiondetails.reduce((result, transaction) => {
            try {
                const yearKey = new Date(transaction.Date).toISOString().slice(0, 4); 
                const category = transaction.Category || 'Uncategorized';
                const amount = parseFloat(transaction.Amount) || 0;
        
                if (!result[yearKey]) {
                    result[yearKey] = {}; // Initialize date entry
                }
        
                if (result[yearKey][category]) {
                    result[yearKey][category] += amount;
                } else {
                    result[yearKey][category] = amount;
                }
            } catch (error) {
                console.error('Error processing transaction:', transaction, error);
            }
        
            return result;
        }, {});
        
        const totalsByDateAndPayment = transactiondetails.reduce((result, transaction) => {
            try {
                const dateKey = new Date(transaction.Date).toISOString().split('T')[0];
                const payment = transaction.PaymentMethod || 'Uncategorized';
                const amount = parseFloat(transaction.Amount) || 0;
        
                if (!result[dateKey]) {
                    result[dateKey] = {}; // Initialize date entry
                }
        
                if (result[dateKey][payment]) {
                    result[dateKey][payment] += amount;
                } else {
                    result[dateKey][payment] = amount;
                }
            } catch (error) {
                console.error('Error processing transaction:', transaction, error);
            }
        
            return result;
        }, {});

        const totalsByMonthAndPayment = transactiondetails.reduce((result, transaction) => {
            try {
                const monthKey = new Date(transaction.Date).toISOString().slice(0, 7); 
                const payment = transaction.PaymentMethod || 'Uncategorized';
                const amount = parseFloat(transaction.Amount) || 0;
        
                if (!result[monthKey]) {
                    result[monthKey] = {}; // Initialize date entry
                }
        
                if (result[monthKey][payment]) {
                    result[monthKey][payment] += amount;
                } else {
                    result[monthKey][payment] = amount;
                }
            } catch (error) {
                console.error('Error processing transaction:', transaction, error);
            }
        
            return result;
        }, {});

        const totalsByYearAndPayment = transactiondetails.reduce((result, transaction) => {
            try {
                const yearKey = new Date(transaction.Date).toISOString().slice(0, 4); 
                const payment = transaction.PaymentMethod || 'Uncategorized';
                const amount = parseFloat(transaction.Amount) || 0;
        
                if (!result[yearKey]) {
                    result[yearKey] = {}; // Initialize date entry
                }
        
                if (result[yearKey][payment]) {
                    result[yearKey][payment] += amount;
                } else {
                    result[yearKey][payment] = amount;
                }
            } catch (error) {
                console.error('Error processing transaction:', transaction, error);
            }
        
            return result;
        }, {});
    // Get current date and time  // Format: YYYY-MM-DD HH:MM
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

        res.render('index', {
            transactiondetail,
            totalsByDate,
            today: formattedDate,
            time: time,
            totalsByMonth,
            totalsByYear,
            totalsByDateAndCategory,
            totalsByMonthAndCategory,
            totalsByYearAndCategory,
            totalsByDateAndPayment,
            totalsByMonthAndPayment,
            totalsByYearAndPayment,
            remainingPocketMoneyByDate,
        });

} catch (err) {
    console.error('Error in GET / route:', err);
    res.status(500).send('Server Error');
}
});


app.post('/save', async(req, res) => {
    const {InsertBudget} = req.body; //galing sa EJS
    const newPocketMoney = new moneydetails({pocketAmount:InsertBudget});
    await newPocketMoney.save();
    res.redirect('/');
});


app.post('/submit', async(req, res) => {
    const { Date, Description, Category, Amount, PaymentMethod} = req.body;
    const newTransaction = new Details({ Date, Description, Category, Amount,PaymentMethod});
    await newTransaction.save();
    res.redirect('/');
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));