import OBR, { isShape, Item, Image, buildShape }  from "@owlbear-rodeo/sdk";
import { getPluginId } from './getPluginId';

/**
 * Helper to build a circle shape with the proper size to match
 * the input image's size
 */
export function buildRangeRing(
  item: Image,
  color: string,
  dpi: number,
  scale: number
) {
  const dpiScale = dpi / item.grid.dpi;
  const width = item.image.width * dpiScale;
  const height = item.image.height * dpiScale;
  const diameter = Math.min(width, height);
  const offsetX = (item.grid.offset.x / item.image.width) * width;
  const offsetY = (item.grid.offset.y / item.image.height) * height;
  // Apply image offset and offset circle position so the origin is the top left
  const position = {
    x: item.position.x - offsetX + width / 2,
    y: item.position.y - offsetY + height / 2,
  };
  const circle = buildShape()
    .width(diameter)
    .height(diameter)
    .scale({ x: scale, y: scale })
    .position(position)
    .fillOpacity(0)
    .strokeColor(color)
    .strokeOpacity(1)
    .strokeWidth(5)
    .shapeType("CIRCLE")
    .attachedTo(item.id)
    .locked(true)
    .name("Status Ring")
    .metadata({ [getPluginId("metadata")]: { enabled: true } })
    .layer("ATTACHMENT")
    .disableHit(true)
    .visible(item.visible)
    .build();

  return circle;
}