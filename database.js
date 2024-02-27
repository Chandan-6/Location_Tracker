import mysql from "mysql";
import dotenv from "dotenv";
import exp from "constants";
dotenv.config();


const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '#zxyGO@**10',
    database : 'login_details'
});

export default connection;