const jwt = require('jsonwebtoken');


function isAuth(req, res, next) {
	 const token = req.headers.authorization.split(' ')[1];
	
	 if (!token) {
	   return res.status(401).json({ message: 'Unauthorized: No token provided' });
	 }
   
	 jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
	   if (err) {
		 return res.status(401).json({ message: 'Unauthorized: Invalid token' });
	   }
	   req.userId = decoded.id;
	   next();
	 });
}

module.exports = isAuth;

