import { Injectable, Type } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type stages = "game" | "result" | "scoreboard";

@Injectable({
  providedIn: "root"
})
export class GameService {
  stage: BehaviorSubject<stages>;
  wpm: BehaviorSubject<number>;
  wrongWords: BehaviorSubject<number>;
  mistakes: BehaviorSubject<number>;

  constructor() {
    this.resetGame();
  }

  getName() {
    return sessionStorage.getItem("name");
  }

  setName(name: string) {
    sessionStorage.setItem("name", name);
  }

  resetGame() {
    this.stage = new BehaviorSubject<stages>("game");
    this.wpm = new BehaviorSubject<number>(0);

    this.wrongWords = new BehaviorSubject<number>(0);
  }
}
