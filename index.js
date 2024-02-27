import express from "express";
import mysql from "mysql";
import connection from "./database.js";
import asyncHandler from "express-async-handler";
import bodyParser from "body-parser";
import dotenv from "dotenv";


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());


app.get("/", asyncHandler(async(req, res)=>{
    let sql = "SELECT * FROM LOGIN_INFO";
    connection.query(sql, function(err, data){
        if(err){
            console.log("Error in query");
        }
            res.send(data);
    });
    // res.send("Hey there!");
}));

// import routes
import userRoutes from "./routes/userRoutes.js";

app.use(bodyParser.urlencoded({extended:true}));
app.use("/api/user", userRoutes);


app.listen(port, () =>{
    console.log(`Server listening on ${port}....`);
    connection.connect(function(err){
        if(err){
            console.log("error occured while connecting to database");
        }
        else{
            console.log("Database Connected!!");
        }
    });
});