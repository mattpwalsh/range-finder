import './style.css'
import OBR from "@owlbear-rodeo/sdk";

import { getConfig, saveConfig } from './localStorage';
import { colorDropdown } from './utils';

OBR.onReady(async () => {

  const currentConfig = getConfig();
  // Setup the document with the colored buttons
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div class="range-finder" style="display: flex; flex-direction: column">
      <h4>Range Config</h4>
      <form id="rangeForm">
      ${currentConfig.map((config: any) => (
        rangeConfig(config)
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

  form?.insertAdjacentHTML('beforeend', rangeConfig({name: "", color: "", ranges: []}))
}


const saveRanges = () => {
  const form = document.getElementById("rangeForm");
  if (form) {
    const data = new FormData(form as HTMLFormElement);

    const names = data.getAll("name");
    const colors = data.getAll("color");
    const ranges = data.getAll("ranges");

    const newConfig = names.map((name, idx) => ({
      name: name as string,
      color: colors.find(color => color === colors[idx]) ?? {},
      ranges: (ranges as string[])[idx].split(",").map(value => parseInt(value))
    }))
    saveConfig(newConfig);
  }
}

const rangeConfig = (config:any) => (
  `<div class="range">
           <label>Name:</label> <div><input type="text" name="name" value="${config.name}" ></div>
           <label>Color:</label><div> ${colorDropdown(`color`, config)}</div>
           <label>Ranges:</label> <div> <input type="text" name="ranges" value="${config.ranges.join(",")}" /></div>
           <div style="display: flex; justify-content: end;"><button onclick="(e) => console.log(e.target.parentElement)">Delete</button></div>
        </div>`
)



