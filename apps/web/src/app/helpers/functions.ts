/* Returns point-A is bigger than point-B. **/
export function hasCollision(pointA: number, pointB: number): boolean {
  return pointA >= pointB;
}


/* Returns an random number between a range. **/
export function getRandomBetweenRange(min: number, max: number): number {
  return parseInt((
    Math.random() * (max - min) + min
    // Math.floor(Math.random() * max) + min
    ).toFixed(0));
}

/* Compare two numbers and returns the bigger value **/
export function getBiggerValue(value1: number, value2: number): number {
  return value1 > value2 ? value1 : value2;
}

/* Compare two numbers and returns the minor value **/
export function getMinorValue(value1: number, value2: number): number {
  return value1 < value2 ? value1 : value2;
}
