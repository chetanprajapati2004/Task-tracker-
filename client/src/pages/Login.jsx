import { useState } from "react";
import api from "../services/api";

import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  Wallet,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

export default function Login(){

const[email,setEmail]=
useState("");

const[password,setPassword]=
useState("");

const navigate=
useNavigate();


const login=
async()=>{

try{

const res=
await api.post(
"/auth/login",
{
email,
password
}
);

localStorage.setItem(
"token",
res.data.token
);

localStorage.setItem(
"user",
JSON.stringify(
res.data.user
)
);

navigate(
"/dashboard"
);

}

catch(err){

console.log(err);

alert(
"Login failed"
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

grid
grid-cols-1
md:grid-cols-2

max-w-6xl
w-full

rounded-[40px]

overflow-hidden

backdrop-blur-xl

bg-white/10

border
border-white/20

shadow-2xl

">

<div className="
hidden
md:flex

flex-col
justify-center

text-white

p-12

bg-gradient-to-br
from-blue-700/50
to-indigo-900/50
">

<h1 className="
text-5xl
font-bold
mb-6
">

Expense Tracker

</h1>

<p className="
text-lg
text-gray-200
mb-10
">

Manage spending, track savings and stay in control.

</p>


<div className="
space-y-6
">

<div className="
flex
items-center
gap-4
">

<Wallet/>

<p>

Track all transactions

</p>

</div>


<div className="
flex
items-center
gap-4
">

<TrendingUp/>

<p>

Monitor savings growth

</p>

</div>


<div className="
flex
items-center
gap-4
">

<ShieldCheck/>

<p>

Secure account access

</p>

</div>

</div>

</div>



<div className="
bg-white

p-10
md:p-12
">

<div className="
text-center
mb-8
">

<h1 className="
text-4xl
font-bold
mb-2
">

Welcome Back 👋

</h1>

<p className="
text-gray-500
">

Login to continue

</p>

</div>


<input

placeholder="Email"

className="
w-full

border
border-gray-300

rounded-2xl

p-4

mb-5

outline-none

focus:border-blue-500
focus:ring-4
focus:ring-blue-100

transition
"

onChange={(e)=>
setEmail(
e.target.value
)}

/>



<input

type="password"

placeholder="Password"

className="
w-full

border
border-gray-300

rounded-2xl

p-4

mb-6

outline-none

focus:border-blue-500
focus:ring-4
focus:ring-blue-100

transition
"

onChange={(e)=>
setPassword(
e.target.value
)}



/>


<button

onClick={login}

className="
w-full

bg-gradient-to-r
from-blue-600
to-indigo-600

hover:scale-[1.02]

text-white

font-semibold

rounded-2xl

p-4

transition
"

>

Login

</button>


<p className="
text-center
mt-6
text-gray-500
">

No account?

<Link

to="/register"

className="
ml-2
font-semibold
text-blue-600
"

>

Create Account

</Link>

</p>

</div>

</div>

</div>

)

}