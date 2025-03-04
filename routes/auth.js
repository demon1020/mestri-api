const express = require("express");
const { failed, success } = require("../helpers/constants");
const { hashPassword } = require("../helpers/GeneralHelper");
var initModels = require("../models/init-models");
var models = initModels();
const router = express.Router();

router.post("/register-user-with-number", async (req, res) => {
    var payload = req.body;
    console.log(payload);
    //Set default values;
    payload.loginType = "PHONE";
    payload.roleId = 2;
    payload.countryCode = "+91";
    try {
        const user = await models.Users.findOne({
            where: {
                phone: payload.phone,
                countryCode: "+91"
            }
        })
        if(user != null){
            res.status(400).json(failed("Phone number is already used."))
            return
        }
        //generatePassword 
        var password = hashPassword(payload.password)
        payload.password = password;
        const newUser = await models.Users.create(payload)
        res.json(success("User created successfully", newUser));
    } catch (error) {
        res.status(400).json(error)
    }
})


module.exports = router;
