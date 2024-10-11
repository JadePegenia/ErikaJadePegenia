const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const User = require('./model/user'); // Ensure this path is correct
const Users = require('./model/user');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/create-account', async (req, res) => {
  const { username, password } = req.body; //Tagakuha ng data galing sa JSON
  try {
    const iv = crypto.randomBytes(16); //Tagagenerate ng random padlock
    const encryptionKey = crypto.randomBytes(32); // Generate a random encryption key
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv); // taga instance ng taga encrypt
    let encryptedPassword = cipher.update(password, 'utf8', 'hex'); //kukuhainin yung value ng pw tapos iieencrypt niya gamit yung taga encrypt
    encryptedPassword += cipher.final('hex'); // inaaassign as Hex(text) yung value

    const newUser = new User({ // taga-assign or lalagyan na ilalagay sa database.
      username, //username value talaga
      password: encryptedPassword, //yung password na nakaencrypt na.
      iv: iv.toString('hex'), //padlock
      key: encryptionKey.toString('hex') //susi
    });
    await newUser.save(); //command para masave yung obj sa database na ang pangalan ay newuser.
    res.status(200).json({ message: 'Account created successfully' }); //response
  } catch (error) {
    console.log('Account creation failed', error);
    res.status(500).json({ message: 'Account creation failed' });
  }
});




//magrerequest data mula sa HTML.*
app.post('/login', async (req, res)=>{
  const { username, password } = req.body;
  try{
    const user =await Users.findOne({username}); //hahanapin mo kung meron bang username nandoon sa database.
    if (!user){ //kapag hndi nag eexist yung username.
      return res.status(400).json({ message: 'Invalid username/password' });
    }
    const iv= Buffer.from(user.iv,'hex');//iaassign padlock/iv na mula sa database
    const key =Buffer.from(user.key,'hex'); //assign susi or encrpytion key mula sa db.
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv); //create taga decipher.
    let decryptedPassword = decipher.update(user.password, 'hex', 'utf8'); //decipher yung pw mula sa db.
    decryptedPassword += decipher.final('utf8'); //translate the pw to readable UTF8

    if (decryptedPassword===password){
      res.status(200).json({ message: 'Login Successfully',redirectUrl:'https://www.youtube.com/@Jaideu__' }); //maglalagay ng condition kung decrypted na pw is equal doon sa nirequests natin pw mula sa html.
    }else{
      res.status(400).json({message: 'incorrect password'}); //else kapag hindi mag babato ng response na invalid un pw. 

    }
  }catch(error){
    console.log('Account login failed', error);
    res.status(500).json({ message: 'Account login failed' });
  }
})








app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
