import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";

/**
 * This file represents the background script run when the plugin loads.
 * It creates the context menu item for the status ring.
 */

OBR.onReady(() => {
  OBR.contextMenu.create({
    id: getPluginId("menu"),
    icons: [
      {
        icon: "/radar.svg",
        label: "Ranges",
        filter: {
          every: [
            { key: "type", value: "IMAGE" },
            { key: "layer", value: "CHARACTER" },
          ],
          permissions: ["UPDATE"],
        },
      },
    ],
    embed: {
      url: "/menu.html",
      height: 88,
    },
  });
});