import { AppComponent } from "../app.component";

export class Floor {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement,
    private that: AppComponent
  ) {
    this.that.screenSizeSubject.subscribe(() => {
      this._y = this.canvas.height - 112;
      this.drawRepetition = Math.ceil(this.canvas.width / this._width);
    })
  }

  private _spriteX = 0;
  private _spriteY = 610;
  private _width = 224;
  public _height = 112;
  private _x = 0;
  public _y = this.canvas.height - 112;
  private drawRepetition = Math.ceil(this.canvas.width / this._width);

  public update(): void {
    const floorSpeed = 2;
    const movement = this._x - floorSpeed;

    const repeatAt = this._width / 8; // 111

    // The rest of the division will always be minor that "repeatAt"
    // -1 % 12 = -1 // how in the fuck?
    this._x = movement % repeatAt
  }

  draw(): void {
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
