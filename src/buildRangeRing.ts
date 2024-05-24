import { Image, buildShape }  from "@owlbear-rodeo/sdk";
import { getPluginId } from './getPluginId';

/**
 * Helper to build a circle shape with the proper size to match
 * the input image's size
 */
export function buildRangeRing(
  item: Image,
  color: string,
  dpi: number,
  scale: number,
  name: string,
  ranges: number[]
) {
  const dpiScale = dpi / item.grid.dpi;
  const width = item.image.width * dpiScale;
  const height = item.image.height * dpiScale;
  const offsetX = (item.grid.offset.x / item.image.width) * width;
  const offsetY = (item.grid.offset.y / item.image.height) * height;
  // Apply image offset and offset circle position so the origin is the top left
  const position = {
    x: item.position.x - offsetX + width / 2,
    y: item.position.y - offsetY + height / 2,
  };


  const shapes = ranges.map((range, idx) => 
    buildShape()
    .width((range/scale) * dpi * 2)
    .height((range/scale) * dpi * 2)
    .position(position)
    .fillOpacity(0.3 - (idx/10))
    .fillColor(color)
    .strokeColor(color)
    .strokeOpacity(1)
    .strokeWidth(5)
    .shapeType("CIRCLE")
    .attachedTo(item.id)
    .locked(true)
    .name("Range Ring")
    .metadata({ [getPluginId("metadata")]: { enabled: true, name } })
    .layer("MOUNT")
    .disableHit(true)
    .visible(item.visible)
    .build()
  )

  return shapes;
}