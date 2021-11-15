import { AppComponent } from "../app.component";

export class GameOverScreen {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement,
    private that: AppComponent
  ) {}

  private _spriteX = 134;
  private _spriteY = 153;
  private _width = 226;
  private _height = 200;
  private _x = (this.canvas.width / 2) -226 / 2;
  private _y = 100;

  public draw(): void {
    this.context.drawImage(
      this.sprites,
      this._spriteX, this._spriteY, // Sprite x and y coordination.
      this._width,   this._height,  // Width and Height of the sprite.
      this._x,       this._y,       // Position inside the canvas.
      this._width,   this._height,  // Size of the sprite inside the canvas.
    );
  }
} 