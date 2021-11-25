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
    });
    // debugMode(this);
  }

  private _ceilingSpriteX = 166;
  private _ceilingSpriteY = 545;
  private _floorSpriteX = 110;
  private _floorSpriteY = 545;
  private _bodySpriteX = 222;
  private _bodySpriteY = 545;

  private _width = 52;
  private _height = 24;
  private _gapBetweenPipes = 90;
  private _collisionTrashHold = 3;
  private _pipePairs: any[] = [];
  private _maximumYVariation = 200;
  public _y = this.canvas.height - 112;

  public update(): void {
    const frameChangeInterval = 100;
    const isIntervalPassed = this.that.frames % frameChangeInterval === 0;
    
    if (isIntervalPassed) {
      const maximumTop = 0;
      const maximumBottom = this.canvas.height - this.that.floor._height - this._gapBetweenPipes - (this._height * 2) ;

      const previousTop = (this._pipePairs[this._pipePairs.length - 1]?.y - 30) || 0;
      const previousBottom = (this._pipePairs[this._pipePairs.length - 1]?.y + this._gapBetweenPipes) || 0;

      const maximumAchievableCeilingValue = previousTop - this._maximumYVariation > maximumTop ? previousTop - this._maximumYVariation : maximumTop;
      const maximumAchievableBottomValue = previousBottom + this._maximumYVariation < maximumBottom ? previousBottom + this._maximumYVariation : maximumBottom;

      this._pipePairs.push({
        x: this.canvas.width,
        y: getRandomBetweenRange(maximumAchievableCeilingValue, maximumAchievableBottomValue)
      })
    }

    this._pipePairs.forEach(pipe => {
      // Update pipe position.
      pipe.x = pipe.x -2;

      // Check collision.
      const birdFrontCollision = this.that.bird._x + this.that.bird._width;
      const birdBackCollision = this.that.bird._x;

      if (
        hasCollision(birdFrontCollision, pipe.x + (this._collisionTrashHold * 3)) &&
        hasCollision(pipe.x + this._width, birdBackCollision + (this._collisionTrashHold * 3))
        ) {

        // Collision between head and ceiling pipe.
        if (hasCollision(pipe.ceilingPipe.y, this.that.bird._y + this._collisionTrashHold)) {
          // console.log('TOP', this.that.frames, pipe.ceilingPipe.y, this.that.bird._y + this._collisionTrashHold);
          this.that.prepareToGaveOver();
          return true;
        }

        // Collision between foot and bottom pipe.
        if (hasCollision((this.that.bird._y + this.that.bird._height), pipe.floorPipe.y + 3)) {
          // console.log('BOTTOM', this.that.frames, (this.that.bird._y + this.that.bird._height), pipe.floorPipe.y + 3);

          this.that.prepareToGaveOver();
          return true;
        }
      }

      // remove pipes that already are outside of the screen.
      if (pipe.x + this._width <= 0) {
        this._pipePairs.shift();
      }
      return false;
    });
  }

  draw(): void {
    this._pipePairs.forEach(pipe => {
      const pipesX = pipe.x;
      const ceilingPipeY = pipe.y;

      // Body of top
      this.context.drawImage(
        this.sprites,
        this._bodySpriteX, this._bodySpriteY,       // Sprite x and y coordination.
        this._width,   this._height,                // Width and Height of the sprite.
        pipesX + 2,  0,                             // Position inside the canvas.
        this._width,   ceilingPipeY + 20,           // Size of the sprite inside the canvas.
      );

      // head of top
      this.context.drawImage(
        this.sprites,
        this._ceilingSpriteX, this._ceilingSpriteY, // Sprite x and y coordination.
        this._width,   this._height,                // Width and Height of the sprite.
        pipesX,  ceilingPipeY,                      // Position inside the canvas.
        this._width,   this._height,                // Size of the sprite inside the canvas.
      );

      const floorPipeY = ceilingPipeY + this._height + this._gapBetweenPipes;

      // Body of bottom
      this.context.drawImage(
        this.sprites,
        this._bodySpriteX, this._bodySpriteY, // Sprite x and y coordination.
        this._width,   this._height,                // Width and Height of the sprite.
        pipesX + 2,  floorPipeY,                // Position inside the canvas.
        this._width, this.canvas.height - floorPipeY - this.that.floor._height,                // Size of the sprite inside the canvas.
      );

      // head of Bottom
      this.context.drawImage(
        this.sprites,
        this._floorSpriteX, this._floorSpriteY, // Sprite x and y coordination.
        this._width,   this._height,                // Width and Height of the sprite.
        pipesX,  floorPipeY,                      // Position inside the canvas.
        this._width,   this._height,                // Size of the sprite inside the canvas.
      );

      pipe.ceilingPipe = {
        x: pipesX,
        y: this._height + ceilingPipeY
      }
      pipe.floorPipe = {
        x: pipesX,
        y: floorPipeY
      }
    });
  }
}

const FAKE_PIPES = [
  {
      "x": 499,
      "y": 151.51497512631084,
      "ceilingPipe": {
          "x": 501,
          "y": 175.51497512631084
      },
      "floorPipe": {
          "x": 501,
          "y": 265.51497512631084
      }
  },
  {
      "x": 699,
      "y": 183.9215409604809,
      "ceilingPipe": {
          "x": 701,
          "y": 207.9215409604809
      },
      "floorPipe": {
          "x": 701,
          "y": 297.9215409604809
      }
  },
  {
      "x": 899,
      "y": 654.0484526846183,
      "ceilingPipe": {
          "x": 901,
          "y": 678.0484526846183
      },
      "floorPipe": {
          "x": 901,
          "y": 768.0484526846183
      }
  },
  {
      "x": 1099,
      "y": 495.2711446332272,
      "ceilingPipe": {
          "x": 1101,
          "y": 519.2711446332272
      },
      "floorPipe": {
          "x": 1101,
          "y": 609.2711446332272
      }
  }
];

function debugMode(that: any) {
  that.that.bird._gravity = 0;
    that.that.bird.jump = ()=>{}
    // that.that.bird._x = that.canvas.width / 2

    document.addEventListener("keydown", event => {
     switch (event.key) {
       case 'ArrowLeft':
         that.that.bird._x -= 1;
         break;
       case 'a':
         that.that.bird._x -= 10;
         break;

       case 'ArrowRight':
         that.that.bird._x += 1;
         break;
       case 'd':
         that.that.bird._x += 10;
         break;

         case 'ArrowUp':
           that.that.bird._y -= 1;
           break;
         case 'w':
           that.that.bird._y -= 10;
           break;
 
         case 'ArrowDown':
           that.that.bird._y += 1;
           break;
         case 's':
           that.that.bird._y += 10;
           break;
     }
   });
}