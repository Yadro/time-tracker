import { Task, TasksByProject } from './models/TasksByProject';
import { Suggestion, SuggestionsByProject } from './models/TasksTypes';
import TreeModelHelper from '../../helpers/TreeModelHelper';

export function findSuggestionsByProject(
  tasksByProject: TasksByProject
): SuggestionsByProject {
  return Object.entries(tasksByProject).reduce<SuggestionsByProject>(
    (acc, [project, tasks]) => {
      const suggestions = findSuggestions(tasks);
      acc[project] = prepareSuggestions(suggestions);
      return acc;
    },
    {}
  );
}

function prepareSuggestions(suggestions: Suggestion[]) {
  return suggestions
    .filter((item) => item.frequency > 1)
    .sort((a, b) => a.frequency - b.frequency);
}

function findSuggestions(tasks: Task[]) {
  const suggestions: Record<number, Suggestion> = {};

  TreeModelHelper.iterate(tasks, (task) => {
    const text = task.title;
    // TODO ignore long strings?
    const hash = hashCode(text);
    if (hash in suggestions) {
      suggestions[hash].frequency++;
    } else {
      suggestions[hash] = {
        text,
        frequency: 1,
      };
    }
  });

  return Object.values(suggestions);
}

// from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
function hashCode(str: string) {
  let hash = 0;
  let i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
