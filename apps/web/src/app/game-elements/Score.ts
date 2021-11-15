import { AppComponent } from "../app.component";

export class Score {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement,
    private that: AppComponent
  ) {}

  public score = 0;
  public update(): void {
    const frameChangeInterval = 20;
    const isIntervalPassed = this.that.frames % frameChangeInterval === 0;

    if (isIntervalPassed) {
      this.score += 1;
    }
  }

  draw(): void {
    this.context.font = '35px "main-font"';
    this.context.textAlign = 'right';
    this.context.fillStyle = 'white';
    this.context.fillText(`${this.score}`, this.canvas.width - 10, 35);
  }
}
