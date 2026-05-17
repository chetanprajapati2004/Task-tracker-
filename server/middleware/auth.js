const jwt=
require("jsonwebtoken");

module.exports=
(req,res,next)=>{

try{

const token=
req.header("token") ||
req.header("authorization");

const normalizedToken=
token &&
token.startsWith("Bearer ")
?
token.slice(7)
:
token;

if(!normalizedToken){

return res
.status(401)
.json({
msg:"No token"
});

}

const decoded=
jwt.verify(
normalizedToken,
process.env.JWT_SECRET
);


req.user={

id:
decoded.id

};

next();

}

catch(err){

console.log(err);

res
.status(401)
.json({

msg:
"Invalid token"

});

}

};
