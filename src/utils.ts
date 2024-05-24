import { colors } from "./colors";

export const colorDropdown = (id: string, selected: any) => (
  `<select name="${id}" style=>
  
   ${colors.map(color => { 
    console.log(color,selected)
    return (
    `<option name="${color.hex}" value="${color.hex}" ${selected.color === color.hex? "selected": ""}>
      ${color.label}
      </option>`
   )})}
   </select>

  `
)