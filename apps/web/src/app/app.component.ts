import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'flappy-bird-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '(click)' : 'handleClick()'
  }
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  public context!: CanvasRenderingContext2D;
  public bird!: Bird;
  public floor!: Floor;
  public pipes!: Pipes;
  public backGround!: BackGround;
  public welcomeScreen!: WelcomeScreen;
  public gameOver = true;
  public frames = 0;

  private sprites = new Image();
  private collisionSound = new Audio();
  private counter = 0;

  constructor() {
    this.sprites.src = '/assets/sprites.png';
  }

  ngOnInit(): void {
    console.log();
  }

  ngAfterViewInit(): void {
    this.collisionSound.src = '/assets/audio/collision.mp3';
    this.context = this.canvas.nativeElement.getContext('2d');
    this.bird = new Bird(this.canvas.nativeElement, this.context, this.sprites, this);
    this.floor = new Floor(this.canvas.nativeElement, this.context, this.sprites);
    this.pipes = new Pipes(this.canvas.nativeElement, this.context, this.sprites);
    this.backGround = new BackGround(this.canvas.nativeElement, this.context, this.sprites);
    this.welcomeScreen = new WelcomeScreen(this.canvas.nativeElement, this.context, this.sprites);

    this.sprites.onload = () => {
      this.backGround.draw();
      this.floor.draw();
      this.welcomeScreen.draw();
      this.loop();
    };
  }

  loop(): void {
    // if (this.counter % 100 === 0) {
    //   console.log(this.counter / 100);
    // }
    // this.counter++;

    if (this.gameOver) {
      this.welcomeScreen.draw();
      this.floor.update();
      this.floor.draw();
      this.pipes.draw()

    } else {
      this.backGround.draw();

      this.floor.update();
      this.floor.draw();


      this.bird.update();
      this.bird.draw();

      this.pipes.draw()

    }

    this.frames = this.frames + 1;
    // console.log(this.frames)
    window.requestAnimationFrame(this.loop.bind(this));
  }

  handleClick() {
    if (this.gameOver) {
      this.bird = new Bird(this.canvas.nativeElement, this.context, this.sprites, this);
      this.gameOver = false;
    } else {
      this.bird.jump();
    }
  }

  public prepareToGaveOver() {
    this.collisionSound.load();
    this.collisionSound.play();
    this.gameOver = true;
  }
}

class Bird {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement,
    private that: AppComponent,
  ) {}
  private _width = 33;
  private _height = 24;
  private _x = 10;
  private _y = 50;
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

class Floor {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement
  ) {}

  private _spriteX = 0;
  private _spriteY = 610;
  private _width = 224;
  private _height = 112;
  private _x = 0;
  public _y = this.canvas.height - 112;

  public update(): void {
    const floorSpeed = 1;
    const repeatAt = this._width / 2;
    const movement = this._x - floorSpeed;

    // The rest of the division will always be minor that "repeatAt"
    this._x = movement % repeatAt
  }

  draw(): void {
    this.context.drawImage(
      this.sprites,
      this._spriteX, this._spriteY, // Sprite x and y coordination.
      this._width,   this._height,  // Width and Height of the sprite.
      this._x,       this._y,       // Position inside the canvas.
      this._width,   this._height,  // Size of the sprite inside the canvas.
    );
    this.context.drawImage(
      this.sprites,
      this._spriteX, this._spriteY,     // Sprite x and y coordination.
      this._width,   this._height,      // Width and Height of the sprite.
      (this._x + this._width), this._y, // Position inside the canvas.
      this._width,   this._height,      // Size of the sprite inside the canvas.
    );
  }
}

class Pipes {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement
  ) {}

  private _floorSpriteX = 0;
  private _floorSpriteY = 169;
  private _ceilingSpriteX = 52;
  private _ceilingSpriteY = 169;
  private _width = 52;
  private _height = 400;
  private _gap = 80;


  private _x = 0;
  public _y = this.canvas.height - 112;

  public update(): void {
     
  }

  draw(): void {
    const spaceBetweenPipes = 90;
    const YVariation = -250;

    const ceilingPipeX = 220;
    const ceilingPipeY = YVariation;
    this.context.drawImage(
      this.sprites,
      this._ceilingSpriteX, this._ceilingSpriteY, // Sprite x and y coordination.
      this._width,   this._height,                // Width and Height of the sprite.
      ceilingPipeX,  ceilingPipeY,                // Position inside the canvas.
      this._width,   this._height,                // Size of the sprite inside the canvas.
    );

    const floorPipeX = 220;
    const floorPipeY = this._height + spaceBetweenPipes + YVariation;
    this.context.drawImage(
      this.sprites,
      this._floorSpriteX, this._floorSpriteY, // Sprite x and y coordination.
      this._width,   this._height,                // Width and Height of the sprite.
      floorPipeX,  floorPipeY,                // Position inside the canvas.
      this._width,   this._height,                // Size of the sprite inside the canvas.
    );
  }
}

class BackGround {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement
  ) {}

  private _spriteX = 390;
  private _spriteY = 0;
  private _width = 275;
  private _height = 204;
  private _x = 0;
  private _y = this.canvas.height - 204;

  public draw(): void {
    this.context.fillStyle = '#70c5ce';
    this.context.fillRect(0,0, this.canvas.width, this.canvas.height)

    this.context.drawImage(
      this.sprites,
      this._spriteX, this._spriteY, // Sprite x and y coordination.
      this._width,   this._height,  // Width and Height of the sprite.
      this._x,       this._y,       // Position inside the canvas.
      this._width,   this._height,  // Size of the sprite inside the canvas.
    );

    this.context.drawImage(
      this.sprites,
      this._spriteX, this._spriteY,     // Sprite x and y coordination.
      this._width,   this._height,      // Width and Height of the sprite.
      (this._x + this._width), this._y, // Position inside the canvas.
      this._width,   this._height,      // Size of the sprite inside the canvas.
    );
  }
}

class WelcomeScreen {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement
  ) {}

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

function hasCollision(pointA: number, pointB: number): boolean {
  return pointA >= pointB;
}
