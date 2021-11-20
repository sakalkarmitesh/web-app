const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const passport=require('passport');
const session=require('express-session');

//authentication Stretegy
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');

const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const customMWare=require('./config/middleware');
const port=8000;

const app=express();

const sassMiddleware=require('node-sass-middleware');
//scss
app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}));

// use express layout
app.use(expressLayouts);

//for the post request
app.use(express.urlencoded());

//static file
app.use(express.static('./assets'));
//make the upload part available to browser
app.use('/uploads',express.static(__dirname + '/uploads'));

// use express layout
app.use(expressLayouts);
//extract styles and scripts from sub pages to layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//use ejs
app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name : 'connection', //cookie name
    secret : '2s5v8y/B?D(G+KbPeShVmYq3t6w9z$C&', //encryption key
    saveUninitialized: false, //when user is not logged in no data is saved in cookie
    resave: false, //we do not want to rewrite session cookie if it is not changed
    cookie: {
        maxAge : (1000*60*60*3) //age of the cookie in miliseconds --> 3 hours
    },
    store : MongoStore.create(
        {
            mongoUrl : 'mongodb://localhost/web2Nov_development',
        },
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMWare.setFlash);
//use express router
app.use('/',require('./router'));

app.listen(port,function(err){
    if(err){
    console.log(`error in running the server ${err}`);
    }
    console.log(`server is running on port: ${port}`);
})