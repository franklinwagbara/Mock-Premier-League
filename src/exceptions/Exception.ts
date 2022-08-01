export class Exception extends Error {
  [x: string]: any;
  constructor(message: string) {
    super(message);
  }
}
