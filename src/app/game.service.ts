import { Injectable, Type } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

export type stages = "game" | "result" | "scoreboard";

@Injectable({
  providedIn: "root"
})
export class GameService {
  stage: BehaviorSubject<stages>;
  wpm: BehaviorSubject<number>;
  wrongWords: BehaviorSubject<number>;
  words: BehaviorSubject<string[]>;

  constructor(private http: HttpClient) {
    this.getWords();
    this.resetGame();
  }

  getName() {
    return sessionStorage.getItem("name");
  }

  setName(name: string) {
    sessionStorage.setItem("name", name);
  }

  getWords() {
    this.http
      .get("assets/words.txt", { responseType: "text" })
      .subscribe(data => {
        this.words = new BehaviorSubject<string[]>(data.split(/\r?\n/));
      });
  }
  resetGame() {
    this.stage = new BehaviorSubject<stages>("game");
    this.wpm = new BehaviorSubject<number>(0);

    this.wrongWords = new BehaviorSubject<number>(0);
  }
}
