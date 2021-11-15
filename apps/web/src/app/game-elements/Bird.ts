import { AppComponent } from "../app.component";
import { hasCollision } from "../helpers/functions";

export class Bird {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement,
    private that: AppComponent,
  ) {}
  public _width = 33;
  public _height = 24;
  public _x = 10;
  public _y = 50;
  private _gravity = 0.25;
  private _speed = 0;
  private _jumpSize = 4.5;
  private _currentSpriteFrame = 0;
  private _movements = [
    {spriteX: 0, spriteY: 0 },
    {spriteX: 0, spriteY: 26 },
    {spriteX: 0, spriteY: 51 },
    {spriteX: 0, spriteY: 26 },
  ];


  public update(): void {
    if (hasCollision((this._y + this._height), this.that.floor._y)) {
      this.that.prepareToGaveOver();
      return;
    }

    this._speed = this._speed + this._gravity;
    this._y = this._y + this._speed;
  }

  public jump(): void {
    this._speed = - this._jumpSize;
    this._y = this._y + this._speed;
  }

  public updateSpriteFrame(): void {
    const frameChangeInterval = 10;
    const isIntervalPassed = this.that.frames % frameChangeInterval;

    if (!isIntervalPassed) {
      const incrementBase = 1;
      const increment = incrementBase + this._currentSpriteFrame;
      const repetitionBase = this._movements.length;
      this._currentSpriteFrame = increment % repetitionBase;
    }
  }

  public draw(): void {
    this.updateSpriteFrame();
    const { spriteX, spriteY } = this._movements[this._currentSpriteFrame];
    this.context.drawImage(
      this.sprites,
      spriteX, spriteY, // Sprite x and y coordination.
      this._width,   this._height,  // Width and Height of the sprite.
      this._x,       this._y,       // Position inside the canvas.
      this._width,   this._height,  // Size of the sprite inside the canvas.
    );
  }
}
