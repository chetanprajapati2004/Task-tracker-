export default function StatCard({title,value}){
return(
<div className='bg-white p-5 rounded-2xl shadow'>
<p>{title}</p>
<h1 className='font-bold text-3xl'>₹{value}</h1>
</div>
)
}