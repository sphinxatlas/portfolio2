import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import toolsFile from '../content/tools.json';

export type Case = CollectionEntry<'cases'>;
export type Tool = CollectionEntry<'tools'>;

export async function getSite() {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('Missing src/content/site.json');
  return entry.data;
}

/** All cases, sorted by their `order` field. */
export async function getCases(): Promise<Case[]> {
  const cases = await getCollection('cases');
  return cases.sort((a, b) => a.data.order - b.data.order);
}

/** Concept cases shown under Selected work on the home page. */
export async function getSelectedCases(): Promise<Case[]> {
  return (await getCases()).filter((entry) => entry.data.type === 'concept');
}

/** Tools grouped by `group`, in the same order as tools.json. */
export async function getToolGroups(): Promise<{ group: string; tools: Tool['data'][] }[]> {
  const fileOrder = toolsFile.map((tool) => tool.id);
  const tools = (await getCollection('tools')).sort((a, b) => fileOrder.indexOf(a.id) - fileOrder.indexOf(b.id));
  const groups = new Map<string, Tool['data'][]>();
  for (const tool of tools) {
    const list = groups.get(tool.data.group) ?? [];
    list.push(tool.data);
    groups.set(tool.data.group, list);
  }
  return [...groups].map(([group, list]) => ({ group, tools: list }));
}
