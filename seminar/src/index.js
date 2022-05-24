const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const statusRouter = require('./routes/status');
const feedRouter = require('./routes/feed');
const accountRouter = require('./routes/account');
const ssrRouter = require('./routes/ssr');
const arciveRouter = require('./routes/arcive');
const registerRouter = require('./routes/register');


const app = express();
const port = process.env.PORT;

app.use(express.json());

const whitelist = ['http://localhost:3000', 'http://sparcs.org:13123'];
const corsOptions = {
    origin: (origin, callback) => {
        console.log('[REQUEST-CORS] Request from origin: ', origin);
        if (!origin || whitelist.indexOf(origin) !== -1) callback(null, true)
        else callback(new Error('Not Allowed by CORS'));
    },
    credentials: true,
}

app.use(cors(corsOptions));

app.use('/status', statusRouter);
app.use('/feed', feedRouter);
app.use('/account', accountRouter);
app.use('/ssr', ssrRouter);
app.use('/arcive', arciveRouter);
app.use('/register', registerRouter);

app.use('/static', express.static(path.join(__dirname,'public')));
app.use('/ArtDB', express.static(path.join(__dirname, '../uploadedFiles')));
app.use('/defaultThumb', express.static(path.join(__dirname, '../SystemImage')));

// Connect to MongoDB
const OMongooseOption = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.MONGO_URI, OMongooseOption).then(
    () => { console.log("[Mongoose] Connection Complete!") },
    (err) => { console.log(`[Mongoose] Connection Error: ${ err }`) }
);


var dir = './uploadedFiles';
fs.access(dir, (error) => {
        console.log(error)
        if(error) {fs.mkdirSync(dir); console.log("Directory Created");}
})

app.listen(port, async () => {
   console.log(`Example App Listening @ http://localhost:${ port }`);
   //if (!fs.existsSync(dir, (str)=>{console.log()})) fs.mkdirSync(dir); // 2

});
