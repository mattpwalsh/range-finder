import { getPluginId } from "./getPluginId"
import { colors } from "./colors"

export interface RangeConfig {
  name: string;
  ranges: number[];
  color: Record<string, string>;
}

const defaultConfig: RangeConfig[] = [
  { 
    name: "Fireball",
    ranges: [240],
    color: colors[2]
  },
  {
    name: "Short Bow",
    ranges: [50, 100, 150],
    color: colors[3]
  }
]


export const saveConfig = (config: RangeConfig[]) => {
  localStorage.setItem(getPluginId("storage"), JSON.stringify(config))
}


export const getConfig =() => {
  const storedConfig = localStorage.getItem(getPluginId("storage"));

  return storedConfig ? JSON.parse(storedConfig):  defaultConfig;
}