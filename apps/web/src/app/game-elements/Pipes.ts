import { AppComponent, ScreenSizeHeightEvent } from "../app.component";
import { getBiggerValue, getMinorValue, getRandomBetweenRange, hasCollision } from "../helpers/functions";

export class Pipes {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement,
    private that: AppComponent,
  ) {
    this.that.screenSizeSubject.subscribe((screenSizeHeightEvent: ScreenSizeHeightEvent) => {
      this._maximumBottom = this.canvas.height - this.that.floor._height - this._gapBetweenPipes - (this._height * 2);

      if (screenSizeHeightEvent === ScreenSizeHeightEvent.DECREASING_HEIGH) {
        this._pipePairs.forEach(pipe => {
          pipe.y = getMinorValue(pipe.y, this._maximumBottom);
        });
      } 
      
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

  private _collisionTrashHold = 3;
  private _maximumYVariation = 200;

  // Level based?
  private _gapBetweenPipes = 90;
  // private _repeatFrequency = 200;
  private _repeatFrequency = 200;
  
  private _maximumTop = 0;
  private _maximumBottom = this.canvas.height - this.that.floor._height - this._gapBetweenPipes - (this._height * 2);
  private _pipePairs: any[] = [{x: this.canvas.width, y: getRandomBetweenRange(this._height, this._maximumBottom)}];



  public update(): void {

    const shouldAddNewPipe = this.canvas.width - this._pipePairs[this._pipePairs.length - 1].x >= this._repeatFrequency;
    if (shouldAddNewPipe) {

      const previousTop = this._pipePairs[this._pipePairs.length - 1].y - 30;
      const previousBottom = this._pipePairs[this._pipePairs.length - 1].y + this._gapBetweenPipes;
      
      const maximumAchievableCeilingValue = getBiggerValue(previousTop - this._maximumYVariation, this._maximumTop);
      const maximumAchievableBottomValue = getMinorValue(previousBottom + this._maximumYVariation, this._maximumBottom);
      
      this._pipePairs.push({
        x: this._pipePairs[this._pipePairs.length - 1]?.x + this._repeatFrequency,
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
          this.reactToCollision();
          return true;
        }

        // Collision between foot and bottom pipe.
        if (hasCollision((this.that.bird._y + this.that.bird._height), pipe.floorPipe.y + 3)) {
          // console.log('BOTTOM', this.that.frames, (this.that.bird._y + this.that.bird._height), pipe.floorPipe.y + 3);

          this.reactToCollision();
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

  reactToCollision() {
    this.that.prepareToGaveOver();
  }
}


function debugMode(that: any) {
  that._pipePairs = FAKE_PIPES;
  that.reactToCollision = () => {console.log('COLLISION')}


  document.addEventListener('click', e => that.that.bird.jump(e.clientX, e.clientY));
  that.that.bird._gravity = 0;
  that.that.bird.jump = (x: number, y: number) => { that.that.bird._x = x, that.that.bird._y = y }

  that.that.floor.update = () => {};


  document.addEventListener("keydown", event => {
    switch (event.key) {
      case 'ArrowLeft':
        that.that.bird._x -= 1;
        break;
      case 'a':
        that.that.bird._x -= 20;
        break;

      case 'ArrowRight':
        that.that.bird._x += 1;
        break;
      case 'd':
        that.that.bird._x += 20;
        break;

        case 'ArrowUp':
          that.that.bird._y -= 1;
          break;
        case 'w':
          that.that.bird._y -= 20;
          break;

        case 'ArrowDown':
          that.that.bird._y += 1;
          break;
        case 's':
          that.that.bird._y += 20;
          break;
    }
  });
}


const FAKE_PIPES = [
  {
    x: 499,
    y: 151,
    ceilingPipe: {
      x: 501,
      y: 175
    },
    floorPipe: {
      x: 501,
      y: 265
    }
  },
  {
    x: 699,
    y: 183,
    ceilingPipe: {
      x: 701,
      y: 207
    },
    floorPipe: {
      x: 701,
      y: 297
    }
  },
  {
    x: 899,
    y: 654,
    ceilingPipe: {
      x: 901,
      y: 678
    },
    floorPipe: {
      x: 901,
      y: 768
    }
  },
  {
    x: 1099,
    y: 495,
    ceilingPipe: {
      x: 1101,
      y: 519
    },
    floorPipe: {
      x: 1101,
      y: 609
    }
  }
];