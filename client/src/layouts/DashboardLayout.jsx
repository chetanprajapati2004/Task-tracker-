import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function DashboardLayout(){

const [open,setOpen]=
useState(false);

const [user,setUser]=
useState(()=>{

try{

return JSON.parse(
localStorage.getItem(
"user"
) || "null"
);

}

catch{

return null;

}

});


useEffect(()=>{

let active=true;

const loadProfile=
async()=>{

try{

const res=
await api.get(
"/auth/me"
);

if(!active){
return;
}

setUser(
res.data
);

localStorage.setItem(
"user",
JSON.stringify(
res.data
));

}

catch(err){

console.log(err);

}

};

loadProfile();

return()=>{

active=false;

};

},[]);



return(

<div className="
min-h-screen

bg-white
">

<div className="
flex
min-h-screen
">

<Sidebar
open={open}
setOpen={setOpen}
user={user}
/>


<main className="
flex-1
min-w-0

p-4
md:p-6

lg:ml-[300px]

bg-gray-50
">

<Navbar
setOpen={setOpen}
user={user}
/>

<Outlet
context={{
user,
setUser
}}
/>

</main>

</div>

</div>

)

}