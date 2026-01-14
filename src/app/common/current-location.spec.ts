import { CurrentLocation } from './current-location';

describe('CurrentLocation', () => {
  it('should create an instance', () => {
    expect(new CurrentLocation({
      latitude: 25.0,
      longitude: 10.0
    })).toBeTruthy();
  });
});
