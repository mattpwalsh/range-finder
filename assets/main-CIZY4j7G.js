import{O as i}from"./getPluginId-BWvJCvbn.js";import{c as g,g as m,s as u}from"./localStorage-BHjLgNnH.js";const v=(e,n)=>`<select name="${e}" style=>
  
   ${g.map(a=>(console.log(a,n),`<option name="${a.hex}" value="${a.hex}" ${n.color===a.hex?"selected":""}>
      ${a.label}
      </option>`))}
   </select>

  `;i.onReady(async()=>{const e=m();document.querySelector("#app").innerHTML=`
    <div class="range-finder" style="display: flex; flex-direction: column">
      <h4>Range Config</h4>
      <form id="rangeForm">
      ${e.map(n=>l(n)).join("")}
      </form>

    <button class="add-range">Add Range</button>

    <button class="save-ranges">Save Ranges</button>
    </div>
  `,document.querySelectorAll(".add-range").forEach(n=>n.addEventListener("click",p)),document.querySelectorAll(".save-ranges").forEach(n=>n.addEventListener("click",f))});const p=()=>{const e=document.getElementById("rangeForm");e==null||e.insertAdjacentHTML("beforeend",l({name:"",color:"",ranges:[]}))},f=()=>{const e=document.getElementById("rangeForm");if(e){const n=new FormData(e),a=n.getAll("name"),t=n.getAll("color"),r=n.getAll("ranges"),c=a.map((d,s)=>({name:d,color:t.find(o=>o===t[s])??{},ranges:r[s].split(",").map(o=>parseInt(o))}));u(c)}},l=e=>`<div class="range">
           <label>Name:</label> <div><input type="text" name="name" value="${e.name}" ></div>
           <label>Color:</label><div> ${v("color",e)}</div>
           <label>Ranges:</label> <div> <input type="text" name="ranges" value="${e.ranges.join(",")}" /></div>
        </div>`;
