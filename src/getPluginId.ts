/** Get the reverse domain name id for this plugin at a given path */
export function getPluginId(path: string) {
  return `ranges.test/${path}`;
}