/* Returns point-A is bigger than point-B. **/
export function hasCollision(pointA: number, pointB: number): boolean {
  return pointA >= pointB;
}


/* Returns an random number between a range. **/
export function getRandomBetweenRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
