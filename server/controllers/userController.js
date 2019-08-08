const User = require('../models/User');
const jwtAuth = require('../utils/jwtAuth');
const bcrypt = require('bcrypt');

module.exports = {
	getUser: (req,res) => {
		console.log('rendered1');
	},

	getAllUsers: (req,res) => {
		console.log('rendered2');
	
	},

	login: (req,res) => {
		console.log(req.body,'rendered login');
		User.findOne({ email: req.body.email }, (err,user) => {
			if(err){
				return res.status(500).json({ error: err, success: false, massege: "Server error" });
			} else if(!user){ 
				return res.status(400).json({ success: false, massege: "User does'nt exist" });
			} else if(user){
					var isValidPassword = bcrypt.compareSync(req.body.password, user.password);
					console.log(isValidPassword, "isValidPassword..");
					var token = jwtAuth.signToken({ id: user._id }, process.env.JWT_SIGN);
					
					if(!isValidPassword){
						console.log(req.body, "login data check4");

						res.status(401).json({ success: false, massage: "Invalid pasword" })
					} else if(isValidPassword){
						var newUser = Object.keys(user).filter(v => !v === "password" );
						res.status(200).json({ success: true, user: newUser, token })
					}
			}
		})
	
	},

	signUp: (req,res) => {
		console.log(req.body,'rendered sign up');

		User.findOne({ email: req.body.email }, (err, user) => {
			if(err){
				return res.status(500).json({ error: err, success: false, massege: "Server error" });
			} else if(user){
				return res.status(403).json({ success: false, massege: "User alredy exist" });
			} else if(!user){
				User.create(req.body, (err, user) => {
					if(err){
						return res.status(500).json({ success: false, massege: "Server error" });
					}	else if(user){ 
						console.log(user,"check5");
						return res.status(200).json({ success: true, massege: "User registred sucessfully" });
					}
				})
			}
		})
	
	},

	updateUser: (req,res) => {
		console.log('rendered update');
	},

	deleteUser: (req,res) => {
		console.log('rendered delete');
	},

}