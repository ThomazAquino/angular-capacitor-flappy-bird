import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'flappy-bird-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  public context!: CanvasRenderingContext2D;
  public bird!: Bird;
  public floor!: Floor;
  public backGround!: BackGround;
  private sprites = new Image();
  private counter = 0;

  constructor() {
    this.sprites.src = '/assets/sprites.png';
  }

  ngOnInit(): void {
    console.log();
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.bird = new Bird(this.canvas.nativeElement, this.context, this.sprites);
    this.floor = new Floor(this.canvas.nativeElement, this.context, this.sprites);
    this.backGround = new BackGround(this.canvas.nativeElement, this.context, this.sprites);

    this.sprites.onload = () => {
      this.loop();
    };
  }

  loop(): void {
    // if (this.counter % 100 === 0) {
    //   console.log(this.counter / 100);
    // }
    // this.counter++;

    this.backGround.draw();
    this.floor.draw();
    this.bird.draw();
    window.requestAnimationFrame(this.loop.bind(this));
  }
}

class Bird {
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private sprites: HTMLImageElement
  ) {}

  private _spriteX = 0;
  private _spriteY = 0;
  private _width = 33;
  private _height = 24;
  private _x = 10;
  private _y = 50;

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
  private _y = this.canvas.height - 112;

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
