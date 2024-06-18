import './style.css'
import OBR, { isShape, Item, Image, Shape }  from "@owlbear-rodeo/sdk";

import { getPluginId } from './getPluginId';
import { buildRangeRing } from './buildRangeRing';

import { getConfig } from './localStorage';



OBR.onReady(async () => {

  const currentConfig = getConfig();


  // Setup the document with the colored buttons
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div class="ranges-menu">
    <select class="range-select">
      <option value="none">None</option>
      ${currentConfig.map((config: any) => `<option value="${config.name}">${config.name}</option>`)}
      </select>
    </div>
  `;

    document
    .querySelectorAll<HTMLSelectElement>(".range-select")
    .forEach((select) => {
      select.addEventListener("change", () => {
        handleRangeSelect(select);
      });
    });
  // Update the button states with the current selection
  const allItems = await OBR.scene.items.getItems();
  updateRangeSelect(allItems);
  // Add change listener for updating button states
  OBR.scene.items.onChange(updateRangeSelect);
});

const handleRangeSelect = async (select: HTMLSelectElement) => {
  const selection = await OBR.player.getSelection();
  const currentConfig = getConfig();
  const rangeConfig = currentConfig.find((config: any) =>  config.name === select.value);
  if(!rangeConfig && select.value !== "none") return

  if (selection) {
    const rangesToAdd: Shape[] = [];
    const rangesToDelete: string[] = [];
    // Get all selected items
    const items = await OBR.scene.items.getItems<Image>(selection);
    // Get all status rings in the scene
    const rangeRings = await OBR.scene.items.getItems<Shape>((item) => {
      const metadata = item.metadata[getPluginId("metadata")];
      return Boolean(isPlainObject(metadata) && metadata.enabled);
    });

    // if (!rangeRing) return;

    // if (rangeRing && rangeRing.name === select.value)  return;
    // if (rangeRing && select.value === "none") {
    //   await OBR.scene.items.deleteItems([rangeRing.id]);
    //   return;
    // }



    // Get the grid dpi so we can scale the rings
    const dpi = await OBR.scene.grid.getDpi();
    const scale = await OBR.scene.grid.getScale();

    for (const item of items) {
      const attachedRanges = rangeRings.filter(
        (ring) => ring.attachedTo === item.id
      );
      if (attachedRanges.length > 0) {
        if (select.value === "none") rangesToDelete.push(...attachedRanges.map(ar => ar.id));
        if (select.value !== item.metadata[getPluginId("metadata")]) {
          rangesToDelete.push(...attachedRanges.map(ar => ar.id));
        }
      }
      if (rangeConfig) {
        rangesToAdd.push(...buildRangeRing(
          item,
              rangeConfig.color,
              dpi,
              scale.parsed.multiplier,
              select.value,
              rangeConfig.ranges,
        ))
      }
    }
    if (rangesToAdd.length > 0) {
      await OBR.scene.items.addItems(rangesToAdd);
    }
    if (rangesToDelete.length > 0) {
      await OBR.scene.items.deleteItems(rangesToDelete);
    }
  }
}

// async function handleButtonClick(button: HTMLButtonElement) {
//   // Get the color and selection state
//   const color = button.id;
//   const selected = button.classList.contains("selected");
//   const selection = await OBR.player.getSelection();
//   if (selection) {
//     const circlesToAdd: Shape[] = [];
//     const circlesToDelete: string[] = [];
//     // Get all selected items
//     const items = await OBR.scene.items.getItems<Image>(selection);
//     // Get all status rings in the scene
//     const statusRings = await OBR.scene.items.getItems<Shape>((item) => {
//       const metadata = item.metadata[getPluginId("metadata")];
//       return Boolean(isPlainObject(metadata) && metadata.enabled);
//     });
//     // Get the grid dpi so we can scale the rings
//     const dpi = await OBR.scene.grid.getDpi();
//     for (const item of items) {
//       // Find all rings attached to this item
//       const attachedRings = statusRings.filter(
//         (ring) => ring.attachedTo === item.id
//       );
//       // Find all rings of the selected color attached to this item
//       const currentColorRings = attachedRings.filter(
//         (ring) => ring.style.strokeColor === color
//       );
//       // Delete the ring if it is selected else add a new ring
//       if (selected) {
//         circlesToDelete.push(...currentColorRings.map((ring) => ring.id));
//       } else {
//         circlesToAdd.push(
//           buildRangeRing(
//             item,
//             color,
//             dpi,
//             item.scale.x * (1 - attachedRings.length * 0.1)
//           )
//         );
//       }
//     }
//     if (circlesToAdd.length > 0) {
//       await OBR.scene.items.addItems(circlesToAdd);
//     }
//     if (circlesToDelete.length > 0) {
//       await OBR.scene.items.deleteItems(circlesToDelete);
//       // After deleting a ring adjust the scale of the selected rings
//       // so that we don't have any gaps
//       await updateStatusRingScales(items);
//     }
//   }
// }




export function isPlainObject(
  item: unknown
): item is Record<keyof any, unknown> {
  return (
    item !== null && typeof item === "object" && item.constructor === Object
  );
}

/** Update the selected state of the color buttons */
export async function updateRangeSelect(items: Item[]) {
  const selection = await OBR.player.getSelection();
  // Remove all previous selected states
  const rangeSelectBox = document.querySelectorAll(".range-select");
  // Get all the status rings that are attached to our current selection
  for (const item of items) {
    const metadata = item.metadata[getPluginId("metadata")];
    if (
      isPlainObject(metadata) &&
      metadata.enabled &&
      isShape(item) &&
      item.attachedTo &&
      selection?.includes(item.attachedTo)
    ) {
      (rangeSelectBox[0] as HTMLSelectElement).value = metadata.name as string;
    }
  }
}

