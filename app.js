var express= require('express');
var path=require('path');
var mysql=require('mysql');
var ejs=require('ejs');
var bodyparser=require('body-parser');

var app= express();

app.use(express.static(path.join(__dirname,'/public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','html');
app.set('views',path.join(__dirname,'/views'));
app.engine('html',ejs.renderFile);

////DATABASE
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"",
    database:'scrapdata'
});
con.connect(function(err){
    if(err) throw err;
    else
        console.log('Connected!');
});
/////

app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/index.html');
});

//TAKING DETAILS FROM THE SIGNIN PAGE
app.post('/details1',function(req,res){

    var Name=req.body.username;
    var  Password=req.body.password1;
 
 con.query('SELECT * FROM login WHERE Name=? ',[Name],function(error,rows,fields){
     if(error) throw error;
     else {
        if(rows.length>0){ 
             if(Password==rows[0].Password){
             console.log('success');
             if(rows[0].count==1){
                res.redirect('/forgotpass.html');
                 app.post('/chpass',function(req,resp){
                   con.query('SELECT count from login WHERE Name=?',[Name],function(err,row,field){
                        if(err) throw err;
                            else{
                            con.query('UPDATE login SET count=0 WHERE Name=?',[Name])
                            console.log('count updated!');
                          }
                    });
                    password1=req.body.password;
                    password2=req.body.confirmpassword;
                    if(password1==password2){
                        con.query('UPDATE login SET password=? WHERE Name=?',[password1,Name],function(error,result){
                            if(error) throw error;
                            else{
                                console.log('password changed');
                                if(Name=='Nish'){
                                    resp.redirect('datasc.html');
                                }else{
                                    resp.redirect('redirpage.html');
                                }
                            }
                        });
                    }else{
                        console.log('Passwords dont match');
                        resp.send('Passwords dont match!');
                    }
                });   
             }else{
                 console.log('password changed once!');
                 if(Name=='Nish'){
                     res.redirect('datasc.html');
                 }else{
                    res.redirect('redirpage.html');
                 }
                }              
             }else {
             console.log('name and password dont match');
             res.send('Wrong Password!');
              }
         }   
       else{
         console.log("name is not present");
         res.send('You haven\'t registerd! Sign up first!');    
          }
         }   
     });
});
/////

//DISPLAYING DATA FROM DATABASE
app.get('/datasc.html',function(req,res){
    con.query('SELECT * FROM login',function(error,rows,fields){
        if(error) throw error;
        else{
           var data=JSON.stringify(rows);
            res.render(__dirname+'/views/datasc.html',{data:rows});
        }
    });
}); 
////

app.listen(3000);

