const btn=document.getElementById("themeBtn");

let dark=false;

btn.onclick=()=>{

dark=!dark;

if(dark){

document.body.style.background="#0f172a";

document.body.style.color="white";

btn.innerHTML="☀️";

}else{

document.body.style.background="#f4f6fa";

document.body.style.color="#222";

btn.innerHTML="🌙";

}

};

document.getElementById("search").addEventListener("keyup",(e)=>{

console.log("Search:",e.target.value);

});
