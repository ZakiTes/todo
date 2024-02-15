var express = require('express');
var router = express.Router();
var jsend = require('jsend');
var db = require('../models');
var crypto = require('crypto');
var UserService = require('../services/userService');
var userService = new UserService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var jwt = require('jsonwebtoken')
require('dotenv').config()



router.use(jsend.middleware);

// Post for registered users to be able to login
router.post("/login", jsonParser, async (req, res, next) => {
	  // #swagger.tags = ['Users']
      // #swagger.description = "Signed up user loggsin."
      // #swagger.produces = ['application/json']
	const { email, password } = req.body;
	if (email == null) {
	  return res.jsend.fail({"email": "Email is required."});
	}
	if (password == null) {
	  return res.jsend.fail({"password": "Password is required."});
	}
	try {
		const user = await userService.getOne(email);
		if(!user) {
			return res.jsend.fail({"result": "Incorrect email or password"});
		}

		crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
			if (err) {
				return next(err);
			}

			if (!crypto.timingSafeEqual(user.encryptedPassword, hashedPassword)) {
				return res.jsend.fail({"result": "Incorrect email or password"});
			}

			let token;
			try {
				token = jwt.sign(
					{id: user.id, email: user.email},
					process.env.TOKEN_SECRET,
					{ expiresIn: "2h" }
				);
			} catch (err) {
				return res.jsend.error("Something went wrong with creating JWT token");
			}

			return res.jsend.success({"result": "You are logged in", "id": user.id, email: user.email, token: token});
		});
	} catch (error) {
		return next(error);
	}
  });

// Post for new users to register / signup
router.post("/signup", async (req, res, next) => {
	 // #swagger.tags = ['Users']
      // #swagger.description = "Post to register a user."
      // #swagger.produces = ['application/json']
	const { name, email, password } = req.body;
	if (name == null) {
	  return res.jsend.fail({"name": "Name is required."});
	}
	if (email == null) {
	  return res.jsend.fail({"email": "Email is required."});
	}
	if (password == null) {
	  return res.jsend.fail({"password": "Password is required."});
	}
	var user = await userService.getOne(email);
	if (user != null) {
	  return res.jsend.fail({"email": "Provided email is already in use."});
	}
	var salt = crypto.randomBytes(16);
	crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async(err, hashedPassword) => {
	  if (err) { return next(err); }
	  try {
	  await userService.create(name, email, hashedPassword, salt)
	  res.jsend.success({"result": "You created an account."});
	  } catch (createError) {
		next(createError);
	  }
	});
  });

router.get('/fail', (req, res) => {
	 // #swagger.tags = ['Users']
      // #swagger.description = "Failed request"
      // #swagger.produces = ['application/json']
	return res.status(401).jsend.error({ statusCode: 401, message: 'message', data: 'data' });
});

module.exports = router;

