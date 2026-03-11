const express = require('express');
const path = require('path')
const userRouter = require('./routes/user.routes');
const dotenv = require('dotenv');
dotenv.config();
const connectToDB = require('./config/db');
connectToDB();

const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index.routes')

const app = express();
const formatBytes = require('./utils/formatBytes');
const { Health } = require('node-appwrite');

// Make it available to all EJS templates
app.locals.formatBytes = formatBytes;


app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/', indexRouter);
app.use('/user', userRouter);
// Serve static files (CSS, JS, images, favicon, etc.)
app.use(express.static(path.join(__dirname, 'public')));


app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})