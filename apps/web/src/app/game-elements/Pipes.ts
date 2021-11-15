import { AppComponent } from "../app.component";
import { getRandomBetweenRange, hasCollision } from "../helpers/functions";

export class Pipes {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement,
    private that: AppComponent,
  ) {
    this.that.screenSizeSubject.subscribe(() => {
      // this._y = this.canvas.height - 204;
    })
  }

  private _floorSpriteX = 0;
  private _floorSpriteY = 169;
  private _ceilingSpriteX = 52;
  private _ceilingSpriteY = 169;
  private _width = 52;
  private _height = 400;
  private _gapBetweenPipes = 90;
  private _collisionTrashHold = -10;
  private _pipePairs: any[] = [];

  public _y = this.canvas.height - 112;

  public update(): void {
    const frameChangeInterval = 100;
    const isIntervalPassed = this.that.frames % frameChangeInterval === 0;

    if (isIntervalPassed) {
      this._pipePairs.push({
        x: this.canvas.width,
        y: getRandomBetweenRange(this._height * -1, (this.canvas.height - this.that.floor._height) - this._height - this._gapBetweenPipes)
      })
    }


    this._pipePairs.forEach(pipe => {
      // Update pipe position.
      pipe.x = pipe.x -2;

      // Check collision.
      // if (hasCollision((this.that.bird._x + this.that.bird._width + this._collisionTrashHold), pipe.x)) {
      //   // Collision between head and ceiling pipe.
      //   if (hasCollision(pipe.ceilingPipe.y, this.that.bird._y)) {
      //     console.log('TOP');
      //     this.that.prepareToGaveOver();
      //     return true;
      //   }

        
      //   // Collision between foot and bottom pipe.
      //   if (hasCollision((this.that.bird._y + this.that.bird._height), pipe.floorPipe.y)) {
      //     console.log('BOTTOM');
      //     this.that.prepareToGaveOver();
      //     return true;
      //   }
      // }

      // remove pipes that already are outside of the screen.
      if (pipe.x + this._width <= 0) {
        this._pipePairs.shift();
      }
      return false;
    });
  }

  draw(): void {
    this._pipePairs.forEach(pipe => {
      const YVariation = pipe.y;
  
      const ceilingPipeX = pipe.x;
      const ceilingPipeY = YVariation;
  
      this.context.drawImage(
        this.sprites,
        this._ceilingSpriteX, this._ceilingSpriteY, // Sprite x and y coordination.
        this._width,   this._height,                // Width and Height of the sprite.
        ceilingPipeX,  ceilingPipeY,                // Position inside the canvas.
        this._width,   this._height,                // Size of the sprite inside the canvas.
      );
  
      const floorPipeX = pipe.x;
      const floorPipeY = this._height + this._gapBetweenPipes + YVariation;
      this.context.drawImage(
        this.sprites,
        this._floorSpriteX, this._floorSpriteY, // Sprite x and y coordination.
        this._width,   this._height,                // Width and Height of the sprite.
        floorPipeX,  floorPipeY,                // Position inside the canvas.
        this._width,   this._height,                // Size of the sprite inside the canvas.
      );

      pipe.ceilingPipe = {
        x: ceilingPipeX,
        y: this._height + ceilingPipeY
      }
      pipe.floorPipe = {
        x: floorPipeX,
        y: floorPipeY
      }
    });
  }
}