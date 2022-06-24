declare module 'universal-analytics' {
  export interface Visitor {
    pageview(path: string): Visitor;
    event(category: string, action: string): Visitor;
    send(): void;
  }

  const ua: (code: string, uid?: string) => Visitor;

  export default ua;
}

declare module 'react-hook-media-query' {
  const useMediaQuery: (query: string) => boolean;

  export default useMediaQuery;
}
