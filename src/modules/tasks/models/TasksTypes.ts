export type SuggestionsByProject = Record<string, Suggestion[]>;

export type Suggestion = {
  text: string;
  frequency: number;
};
