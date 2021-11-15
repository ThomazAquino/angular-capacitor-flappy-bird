import { AppComponent } from "../app.component";

export class BackGround {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement,
    private that: AppComponent
  ) {
    this.that.screenSizeSubject.subscribe(() => {
      this._y = this.canvas.height - 204;
      this.drawRepetition = Math.ceil(this.canvas.width / this._width);
    })
  }

  private _spriteX = 390;
  private _spriteY = 0;
  private _width = 275;
  private _height = 204;
  private _x = 0;
  private _y = this.canvas.height - 204;
  private drawRepetition = Math.ceil(this.canvas.width / this._width);

  public draw(): void {
    this.context.fillStyle = '#70c5ce';
    this.context.fillRect(0,0, this.canvas.width, this.canvas.height);

    for (let index = 0; index < this.drawRepetition; index++) {
      this.context.drawImage(
        this.sprites,
        this._spriteX, this._spriteY,               // Sprite x and y coordination.
        this._width,   this._height,                // Width and Height of the sprite.
        (this._x + (this._width * index)), this._y, // Position inside the canvas.
        this._width,   this._height,                // Size of the sprite inside the canvas.
      );
    }
  }
}