const win = (typeof window !== 'undefined' && window) || <any>{};

export { win as window };
export let document = win.document;
export let location = win.location;
export let gc = win['gc'] ? () => win['gc']() : (): any => null;
export let performance = win['performance'] ? win['performance'] : null;
export const Event = win['Event'];
export const MouseEvent = win['MouseEvent'];
export const KeyboardEvent = win['KeyboardEvent'];
export const EventTarget = win['EventTarget'];
export const History = win['History'];
export const Location = win['Location'];
export const EventListener = win['EventListener'];