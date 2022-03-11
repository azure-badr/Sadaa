export default interface EventObject {
  name: string;
  once: boolean;
  execute: (...args: [any]) => Promise<void>;
}
