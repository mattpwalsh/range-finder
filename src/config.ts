import './style.css'
import OBR, { isShape, Item, Image, Shape }  from "@owlbear-rodeo/sdk";
import { colors } from "./colors";

import { getConfig, saveConfig, RangeConfig } from './localStorage';

OBR.onReady(async () => {

  const currentConfig = getConfig();
  // Setup the document with the colored buttons
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div class="range-finder" style="display: flex; flex-direction: column">
      <h4>Range Config</h4>
      <form id="rangeForm">
      ${currentConfig.map((config, index) => (
        rangeConfig(config, index)
      )).join("")}
      </form>

    <button class="add-range">Add Range</button>

    <button class="save-ranges">Save Ranges</button>
    </div>
  `;

  document.querySelectorAll(".add-range").forEach(button => button.addEventListener("click", addRange));
  document.querySelectorAll(".save-ranges").forEach(button => button.addEventListener("click", saveRanges));
});


const addRange = () => {
  const form = document.getElementById("rangeForm");
  const ranges = document.querySelectorAll(".range");

  form?.insertAdjacentHTML('beforeend', rangeConfig({name: "", color: "", ranges: []}, ranges.length))
}


const saveRanges = () => {
  const form = document.getElementById("rangeForm");
  if (form) {
    const data = new FormData(form as HTMLFormElement);

    const names = data.getAll("name");
    const colors = data.getAll("color");
    const ranges = data.getAll("ranges");
    console.log(names);
    const newConfig = names.map((name, idx) => ({
      name: name as string,
      color: colors.find(color => color === colors[idx]) ?? {},
      ranges: (ranges as string[])[idx].split(",").map(value => parseInt(value))
    }))
    console.log(newConfig);
    saveConfig(newConfig);
  }
}

const rangeConfig = (config, index) => (
  `<div class="range">
           <label>Name:</label> <div><input type="text" name="name" value="${config.name}" ></div>
           <label>Color:</label><div> ${colorDropdown(`color`, config.color)}</div>
           <label>Ranges:</label> <div> <input type="text" name="ranges" value="${config.ranges.join(",")}" /></div>
        </div>`
)


const colorDropdown = (id, selected) => (
  `<select name="${id}" style=>
  
   ${colors.map(color => (
    `<option name="${color.hex}" value="${color.hex}" ${selected.hex === color.hex? "selected": ""}>
      ${color.label}
      </option>`
   ))}
   </select>

  `
)


