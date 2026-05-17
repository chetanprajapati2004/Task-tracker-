import { useState } from "react";
import api from "../services/api";

import {
useNavigate,
Link
} from "react-router-dom";

import {
User,
Mail,
Lock
} from "lucide-react";

export default function Register(){

const [name,setName]=
useState("");

const [email,setEmail]=
useState("");

const [password,setPassword]=
useState("");

const navigate=
useNavigate();


const register=
async()=>{

try{

await api.post(
"/auth/register",
{
name,
email,
password
}
);

alert(
"Registered Successfully"
);

navigate("/");

}

catch(err){

console.log(err);

alert(
"Registration Failed"
);

}

};


return(

<div className="

relative
min-h-screen

overflow-hidden

bg-gradient-to-br
from-slate-950
via-blue-900
to-indigo-950

flex
justify-center
items-center

p-6
">



<div className="
absolute

w-96
h-96

bg-blue-500/20

blur-3xl

rounded-full

top-10
left-10
"/>


<div className="
absolute

w-80
h-80

bg-purple-500/20

blur-3xl

rounded-full

bottom-0
right-0
"/>



<div className="

relative

bg-white/10

backdrop-blur-xl

border
border-white/20

shadow-2xl

rounded-[40px]

w-full
max-w-md

p-8
">

<div className="
text-center
mb-8
">

<h1 className="
text-4xl
font-bold
text-white
">

Create Account

</h1>

<p className="
text-gray-300
mt-2
">

Start tracking finances smarter

</p>

</div>



<div className="
space-y-5
">


<div className="
relative
">

<User
size={18}

className="
absolute
left-4
top-4
text-gray-400
"
/>


<input

value={name}

onChange={(e)=>
setName(
e.target.value
)}

placeholder="Name"

className="
w-full

pl-12
p-4

rounded-2xl

bg-white

outline-none
"

/>

</div>





<div className="
relative
">

<Mail
size={18}

className="
absolute
left-4
top-4
text-gray-400
"
/>


<input

value={email}

onChange={(e)=>
setEmail(
e.target.value
)}

placeholder="Email"

className="
w-full

pl-12
p-4

rounded-2xl

bg-white

outline-none
"

/>

</div>




<div className="
relative
">

<Lock
size={18}

className="
absolute
left-4
top-4
text-gray-400
"
/>


<input

type="password"

value={password}

onChange={(e)=>
setPassword(
e.target.value
)}

placeholder="Password"

className="
w-full

pl-12
p-4

rounded-2xl

bg-white

outline-none
"

/>

</div>




<button

onClick={register}

className="
w-full

bg-gradient-to-r
from-green-500
to-emerald-600

hover:scale-[1.02]

text-white

rounded-2xl

p-4

font-semibold

transition
"

>

Create Account

</button>



<p className="
text-center
text-gray-300
">

Already have account?

<Link

to="/"

className="
ml-2
font-semibold
text-blue-300
"

>

Login

</Link>

</p>

</div>

</div>

</div>

)

}