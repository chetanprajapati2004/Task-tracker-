const router=
require("express").Router();

const User=
require("../models/User");

const bcrypt=
require("bcryptjs");

const jwt=
require("jsonwebtoken");

const auth=
require("../middleware/auth");



// Register

router.post(
"/register",

async(req,res)=>{

try{

const{
name,
email,
password,
targetGoal
}=req.body;


const exist=
await User.findOne({
email
});

if(exist){

return res
.status(400)
.json({

msg:
"User already exists"

});

}


const hash=
await bcrypt.hash(
password,
10
);


const user=
new User({

name,
email,
password:hash,

targetGoal:
Number.isFinite(
Number(targetGoal)
)

?

Math.max(
0,
Number(targetGoal)
)

:

0

});


await user.save();


res.json({

msg:
"Registration successful"

});

}

catch(err){

console.log(err);

res
.status(500)
.json({

msg:
"Server Error"

});

}

}

);




// Login

router.post(
"/login",

async(req,res)=>{

try{

const{
email,
password
}=req.body;


const user=
await User.findOne({
email
});


if(!user){

return res
.status(400)
.json({

msg:
"User not found"

});

}


const match=
await bcrypt.compare(
password,
user.password
);


if(!match){

return res
.status(400)
.json({

msg:
"Invalid password"

});

}


const token=
jwt.sign(

{
id:user._id
},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);


res.json({

token,

user:{

name:
user.name,

email:
user.email,

targetGoal:
user.targetGoal

}

});

}

catch(err){

console.log(err);

res
.status(500)
.json({

msg:
"Server Error"

});

}

}

);




// Current user

router.get(
"/me",
auth,

async(req,res)=>{

try{

const user=
await User.findById(
req.user.id
)

.select(
"name email targetGoal"
);


if(!user){

return res
.status(404)
.json({

msg:
"User not found"

});

}


res.json(
user
);

}

catch(err){

console.log(err);

res
.status(500)
.json({

msg:
"Server Error"

});

}

}

);




// Update target goal

router.patch(
"/target-goal",
auth,

async(req,res)=>{

try{

const nextGoal=
Number(
req.body.targetGoal
);


if(
!Number.isFinite(
nextGoal
)
||
nextGoal<0
){

return res
.status(400)
.json({

msg:
"Enter valid target"

});

}


const user=
await User.findByIdAndUpdate(

req.user.id,

{
targetGoal:
nextGoal
},

{
new:true
}

)

.select(
"name email targetGoal"
);


res.json(
user
);

}

catch(err){

console.log(err);

res
.status(500)
.json({

msg:
"Server Error"

});

}

}

);


module.exports=
router;