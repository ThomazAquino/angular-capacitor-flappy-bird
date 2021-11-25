import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import * as gameElement from './game-elements';
import { Plugins } from '@capacitor/core';
const { SplashScreen, StatusBar } = Plugins;

const enum GameState {
  INITIAL_SCREEN,
  GAME_OVER_SCREEN,
  PLAYING,
}

export const enum ScreenSizeHeightEvent {
  INCREASING_HEIGH,
  DECREASING_HEIGH,
}

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

  public bird!: gameElement.Bird;
  public floor!: gameElement.Floor;
  public pipes!: gameElement.Pipes;
  public backGround!: gameElement.BackGround;
  public score!: gameElement.Score;
  public welcomeScreen!: gameElement.WelcomeScreen;
  public gameOverScreen!: gameElement.GameOverScreen;

  public frames = 0;
  public gameOver = true;
  public isWaitingForDelay = false;
  // public gameState: GameState = GameState.INITIAL_SCREEN;
  public gameState: GameState = GameState.PLAYING;

  public screenSizeSubject: Subject<ScreenSizeHeightEvent> = new Subject();
  public previousWindowHeight = window.innerHeight;
  

  private sprites = new Image();
  private collisionSound = new Audio();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {

    const screenSizeHeightEvent = event.target.innerHeight > this.previousWindowHeight ? ScreenSizeHeightEvent.INCREASING_HEIGH : ScreenSizeHeightEvent.DECREASING_HEIGH;
    this.previousWindowHeight = event.target.innerHeight
    if (this.context) {
      this.context.canvas.width = event.target.innerWidth - 3;
      this.context.canvas.height = event.target.innerHeight - 3;
    }
    this.screenSizeSubject.next(screenSizeHeightEvent);
  }

  constructor() {
    this.sprites.src = '/assets/sprites.png';
    
    const hideStatusBar = async () => {
      // await StatusBar.hide();
    };

    const test = async () => {
      await SplashScreen.show({
        showDuration: 10000,
        autoHide: true
      });

    };

    // test();
    

    hideStatusBar();

  }

  ngOnInit(): void {
    console.log();
  }

  ngAfterViewInit(): void {
    // window.screen.orientation.lock('landscape');

    this.collisionSound.src = '/assets/audio/collision.mp3';
    this.context = this.canvas.nativeElement.getContext('2d');
    this.context.canvas.width = window.innerWidth - 3;
    this.context.canvas.height = window.innerHeight - 3;
    this.initializeGameElements();

    this.sprites.onload = () => {
      this.backGround.draw();
      this.floor.draw();
      // this.welcomeScreen.draw();
      this.loop();
    };
  }

  initializeGameElements(): void {
    this.bird = new gameElement.Bird(this.canvas.nativeElement, this.context, this.sprites, this);
    this.floor = new gameElement.Floor(this.canvas.nativeElement, this.context, this.sprites, this);
    this.pipes = new gameElement.Pipes(this.canvas.nativeElement, this.context, this.sprites, this);
    this.backGround = new gameElement.BackGround(this.canvas.nativeElement, this.context, this.sprites, this);
    this.score = new gameElement.Score(this.canvas.nativeElement, this.context, this.sprites, this);
    this.welcomeScreen = new gameElement.WelcomeScreen(this.canvas.nativeElement, this.context, this.sprites, this);
  }

  loop(): void {
    switch (this.gameState) {
      case GameState.INITIAL_SCREEN:
        this.backGround.draw();
        this.pipes.draw();
        this.pipes.update();
        this.floor.update();
        this.floor.draw();
        this.bird.draw();
        this.welcomeScreen.draw();
        break;

      case GameState.GAME_OVER_SCREEN:
        this.gameOverScreen = new gameElement.GameOverScreen(this.canvas.nativeElement, this.context, this.sprites, this);
        this.gameOverScreen.draw();
        break;

      case GameState.PLAYING:
        this.backGround.draw();
        this.pipes.draw();
        this.pipes.update();
        this.floor.update();
        this.floor.draw();
        this.bird.update();
        this.bird.draw();
        this.score.update();
        this.score.draw();
        break;
    
      default:
        break;
    }

    this.frames = this.frames + 1;
    window.requestAnimationFrame(this.loop.bind(this));
  }

  handleClick() {
    if (this.isWaitingForDelay) {
      return;
    }

    switch (this.gameState) {
      case GameState.INITIAL_SCREEN:
      case GameState.GAME_OVER_SCREEN:
        this.initializeGameElements();

        this.gameOver = false;
        this.gameState = GameState.PLAYING;
        break;

      case GameState.PLAYING:
        this.bird.jump();
        break;
    
      default:
        break;
    }
  }

  public prepareToGaveOver() {
    this.collisionSound.load();
    this.collisionSound.play();
    this.gameOver = true;
    this.gameState = GameState.GAME_OVER_SCREEN;
    this.isWaitingForDelay = true;
    setTimeout(() => this.isWaitingForDelay = false, 1500);
  }
}
