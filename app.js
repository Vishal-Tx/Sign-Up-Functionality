require('dotenv').config()
const express=require("express")
const bodyParser=require("body-parser")
const https=require("https")
const app=express()
const port=process.env.PORT || 3000



app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",(req,res)=>{
    
    const firstName=req.body.firstName
    const lastName=req.body.lastName
    const email=req.body.email

    const data={
        members:[{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
        }]

    };
    const jsonData = JSON.stringify(data);

    const url = process.env.URL
    const options={
        method:"POST",
        auth: process.env.AUTH
    }

    const request=https.request(url, options, response => {
        

        response.on("data", (data)=>{
            // console.log(JSON.parse(data));

            if (response.statusCode===200){
                res.sendFile(__dirname+"/success.html");
            }

            else if(response.statusCode===400){
                res.sendFile(__dirname+"/failure.html")
            }
        })

    });

    request.write(jsonData);
    request.end();  




    console.log(firstName, lastName, email);
    // res.send(`${firstName} ${lastName} ${email}`)
})


app.post("/failure",(req,res)=>{
    res.redirect("/")
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}.`);
})

