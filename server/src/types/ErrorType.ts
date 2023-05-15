export default interface Error {
  name: string;
  message: string;
  type: string;
  stack?: string;
}