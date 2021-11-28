declare module 'universal-analytics' {
  const ua: (code: string) => any;

  export default ua;
}

declare module 'react-hook-media-query' {
  const useMediaQuery: (query: string) => boolean;

  export default useMediaQuery;
}
