declare module "next" {
  export type Metadata = {
    title?: string;
    description?: string;
    [key: string]: any;
  };
  export type NextConfig = Record<string, any>;
}

declare module "next/link" {
  import React from "react";
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    replace?: boolean;
    scroll?: boolean;
    prefetch?: boolean;
  }
  const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
  export default Link;
}

declare module "next/navigation" {
  export function usePathname(): string;
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
  };
  export function useSearchParams(): {
    get: (name: string) => string | null;
  };
  export function notFound(): never;
}

declare module "next/font/google" {
  export function Geist(options?: any): { variable: string; className: string };
  export function Geist_Mono(options?: any): { variable: string; className: string };
}

declare module "firebase/app" {
  export interface FirebaseApp {
    name: string;
    options: Record<string, any>;
  }
  export function initializeApp(config: any): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function getApp(): FirebaseApp;
}

declare module "firebase/auth" {
  export interface Auth {
    currentUser: any;
  }
  export class GoogleAuthProvider {}
  export function getAuth(app?: any): Auth;
}

declare module "firebase/firestore" {
  export interface Firestore {}
  export function getFirestore(app?: any): Firestore;
}

declare module "firebase/storage" {
  export interface FirebaseStorage {}
  export function getStorage(app?: any): FirebaseStorage;
}
