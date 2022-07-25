export interface IDatabaseConnection {
  connect: () => Promise<void>;
  disconect: () => Promise<void>;
}
