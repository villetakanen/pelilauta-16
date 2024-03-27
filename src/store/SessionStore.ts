import { atom } from 'nanostores';

/**
 * Lots of the elements would like to know details of the 
 * current session or user - but re-framing the same data is 
 * costly and time-consuming. So, we use the login/logout-button
 * to update the session details and then use the same details 
 * across the application.
 */

export const isActive = atom<boolean>(false);
export const isAuth = atom<boolean>(false);
export const $uid = atom<string>('');