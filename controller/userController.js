import express from "express";
import asyncHandler from "express-async-handler";
import connection  from "../database.js";
import bcrypt from "bcrypt";
import util from "util";

const queryAsync = util.promisify(connection.query).bind(connection);


//@desc regsiter user, if not exists
//@route POST /api/user/registerUser
//@access public
const registerUser = asyncHandler(async(req, res) =>{
    const { userName, password } = req.body;
    if(!userName || !password){
        res.status(400).send("All fields are mandatory.!!!!!!");
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    console.log("Hashed Password : ", hashedPassword);
    const newUser = { userName, password: hashedPassword };

    connection.query("SELECT COUNT(userName) AS userCount FROM LOGIN_INFO WHERE userName = ?", userName, (err, results) =>{
        if(err){
            console.log("Error in finding existing user.");
            res.status(500).send("Error in finding existing user.");
        }

        const userCount = results[0].userCount;

        if(userCount > 0 ){
            res.status(200).send("User already exists!!!");
        }
        else{
            connection.query("INSERT INTO LOGIN_INFO SET ?", newUser, (err, data) => {
                if(err){
                    console.log("Error inserting user!", err);
                    return res.status(500).send("Error in adding user.");
                }
                return res.status(201).send("User added succesfully.");
            });
        }
    });

});


// const loginUser = asyncHandler(async (req, res) => {
//     const { userName, password } = req.body;
//     if (!userName || !password) {
//         res.status(400).send("All fields are mandatory.!!!!!!");
//     }

//     connection.query("SELECT COUNT(*) AS userCount FROM LOGIN_INFO WHERE userName = ?", [userName], function (err, result) {
//         if (err) {
//             console.log("Error in finding the user..");
//             res.status(500).send("Error in login.");
//         } else {
//             const userCount = result[0].userCount;
//             const userPassword = result[0].password;
//             if (userCount > 0 && bcrypt.compareSync(password, userPassword)) {
//                 console.log("User Login successful.");
//                 res.status(200).send("Login Succesfull.");
//             } else {
//                 return res.status(200).send("User doesn't exists, to login, first you need to register.");
//             }
//         }
//     });
// });

const loginUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) {
        res.status(400).send("All fields are mandatory.!!!!!!");
    }

    connection.query("SELECT * FROM LOGIN_INFO WHERE userName = ?", [userName], function (err, result) {
        if (err) {
            console.log("Error in finding the user..");
            res.status(500).send("Error in login.");
        } else {
            if (result.length === 0) {
                return res.status(200).send("User doesn't exist. Please register first.");
            }

            const userPassword = result[0].password;
            if (bcrypt.compareSync(password, userPassword)) {
                console.log("User Login successful.");
                res.status(200).send("Login Successful.");
            } else {
                console.log("Incorrect password.");
                res.status(401).send("Incorrect Password.");
            }
        }
    });
});



export {registerUser, loginUser};