import { AppComponent } from "../app.component";

export class WelcomeScreen {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement,
    private that: AppComponent
  ) {
    this.that.screenSizeSubject.subscribe(() => {
      this._x = (this.canvas.width / 2) -174 / 2;
    })
  }

  private _spriteX = 134;
  private _spriteY = 0;
  private _width = 174;
  private _height = 152;
  private _x = (this.canvas.width / 2) -174 / 2;
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