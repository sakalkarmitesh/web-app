const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const port=8000;

const app=express();


// use express layout
app.use(expressLayouts);

//use express router
app.use('/',require('./router'));

//use ejs
app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){
    if(err){
    console.log(`error in running the server ${err}`);
    }
    console.log(`server is running on port: ${port}`);
})