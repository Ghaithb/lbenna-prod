/// <reference types="react" />

declare module 'react' {
  // Re-export all types from React
  export * from 'react';

  // Add explicit types for common hooks and components
  export const useState: typeof import('react').useState;
  export const useEffect: typeof import('react').useEffect;
  export const useRef: typeof import('react').useRef;
  export const useContext: typeof import('react').useContext;
  export const createContext: typeof import('react').createContext;
  export const Fragment: typeof import('react').Fragment;
  export const StrictMode: typeof import('react').StrictMode;
  
  export type ReactNode = import('react').ReactNode;
  export type ReactElement = import('react').ReactElement;

  export interface PropsWithChildren<P = unknown> {
    children?: ReactNode;
    [key: string]: any;
  }
}