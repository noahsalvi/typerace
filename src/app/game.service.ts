import { Injectable, Type } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AngularFirestore } from "@angular/fire/firestore";

export type stages = "game" | "result" | "scoreboard" | "confirmation";

@Injectable({
  providedIn: "root"
})
export class GameService {
  stage: BehaviorSubject<stages>;
  wpm: BehaviorSubject<number>;
  wrongWords: BehaviorSubject<number>;
  totalWords: BehaviorSubject<number>;
  words: BehaviorSubject<string[]>;
  animationController: BehaviorSubject<string>;
  scores: Observable<any[]>;

  constructor(private http: HttpClient, private db: AngularFirestore) {
    this.animationController = new BehaviorSubject("");
    this.getWords();
    this.resetGame();
    this.scores = db
      .collection("scores", ref => ref.orderBy("wpm", "desc"))
      .valueChanges();
  }

  getName() {
    return localStorage.getItem("name");
  }

  setName(name: string) {
    localStorage.setItem("name", name);
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
    this.totalWords = new BehaviorSubject<number>(0);
  }
}
