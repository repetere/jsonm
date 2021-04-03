export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor:number, ceiling:number): R;
    }
    interface Expect{
      toBeWithinRange(floor:number, ceiling:number): object;
    }
    interface InverseAsymmetricMatchers{
      toBeWithinRange(floor:number, ceiling:number): object;
    }
  }
}