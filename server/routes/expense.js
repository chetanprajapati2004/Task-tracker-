const router=
require("express")
.Router();

const Expense=
require("../models/Expense");

const auth=
require("../middleware/auth");



// Add Expense

router.post(
"/",
auth,

async(req,res)=>{

try{

const expense=
await Expense.create({

...req.body,

userId:
req.user.id

});

res.status(201)
.json(
expense
);

}

catch(err){

console.log(err);

res
.status(500)
.json({

message:
"Server Error"

});

}

}

);




// Get User Expenses

router.get(
"/",
auth,

async(req,res)=>{

try{

const data=

await Expense.find({

userId:
req.user.id

})

.sort({

date:-1

});


res.json(
data
);

}

catch(err){

console.log(err);

res
.status(500)
.json({

message:
"Server Error"

});

}

}

);




// Delete Expense

router.delete(
"/:id",
auth,

async(req,res)=>{

try{

const expense=

await Expense.findOne({

_id:
req.params.id,

userId:
req.user.id

});


if(
!expense
){

return res
.status(404)
.json({

message:
"Expense not found"

});

}


await Expense.findByIdAndDelete(
req.params.id
);


res.json({

message:
"Deleted successfully"

});

}

catch(err){

console.log(err);

res
.status(500)
.json({

message:
"Server Error"

});

}

}

);



module.exports=
router;