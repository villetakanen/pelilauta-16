// src/i18n/t.ts

import { locales } from '../locales'; // Your default locale structure

// Define a recursive type to handle nested translations
export type NestedTranslation = string | { [key: string]: NestedTranslation };

export type Locale = {
  [namespace: string]: NestedTranslation;
};

export interface Locales {
  [locale: string]: {
    [namespace: string]: NestedTranslation;
  };
}

const defaultLocale = 'fi'; // Your default locale

export function t(key: string, currentLocale = defaultLocale): string {
    // Split the key into namespace (optional) and path
    const [namespace = 'app', ...pathSegments] = key.split(':');
    const path = pathSegments.join(':'); // Join the remaining segments
  
    // Function to recursively traverse and find the translation
    function findTranslation(obj: NestedTranslation | undefined, path: string): string | undefined {
        if (!obj) return undefined; // Handle undefined object
        
      const keys = path.split('.');
      let currentObj = obj;
  
      for (const key of keys) {
        if (typeof currentObj === 'string') return undefined; // Reached a string before the end of the path
        currentObj = currentObj[key];
        if (currentObj === undefined) return undefined; // Key not found
      }
  
      return currentObj as string; // Found the translation
    }
  
    // Start with default locale
    let translation = findTranslation(locales[currentLocale]?.[namespace], path);
  
    // If not found in default locale, check the current locale (you'll need to get this from somewhere)
    if (!translation) {
      // ... logic to get currentLocale ...
      translation = findTranslation(locales[defaultLocale]?.[namespace], path);
    }
  
    // Return original input if no translation found
    return translation ?? key;
  }
