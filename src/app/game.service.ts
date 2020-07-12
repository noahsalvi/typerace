import { Injectable, Type } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";

export type stages = "none" | "game" | "result" | "scoreboard" | "confirmation";

@Injectable({
  providedIn: "root",
})
export class GameService {
  stage: BehaviorSubject<stages>;
  wpm: BehaviorSubject<number>;
  wrongWords: BehaviorSubject<number>;
  totalWords: BehaviorSubject<number>;
  words: BehaviorSubject<string[]>;
  animationController: BehaviorSubject<string>;
  scores: Observable<any[]>;
  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.animationController = new BehaviorSubject("");
    this.getWords();
    this.resetGame();
    this.scores = db
      .collection("scores", (ref) => ref.orderBy("wpm", "desc"))
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
      .subscribe((data) => {
        this.words = new BehaviorSubject<string[]>(data.split(/\r?\n/));
      });
  }
  resetGame() {
    this.stage = new BehaviorSubject<stages>("game");
    this.wpm = new BehaviorSubject<number>(0);

    this.wrongWords = new BehaviorSubject<number>(0);
    this.totalWords = new BehaviorSubject<number>(0);
  }

  toggleActive(bool: boolean) {
    let navigation = document.getElementById("navigation");
    let hamburger = document.getElementById("hamburger");
    let children = navigation.children.item(1).children;
    for (let i = 0; i < children.length; i++) {
      children.item(i).className = "";
    }
    let currentRoute = this.router.url.split("/").pop();

    if (bool) {
      let footer = document.getElementsByTagName("footer").item(0);
      let triangle = document.getElementById("triangle-down");
      switch (currentRoute) {
        case "":
          footer.style.display = "none";
          triangle.style.opacity = "0";
          children.item(0).className = "current";
          break;

        case "scoreboard":
          children.item(1).className = "current";
          break;
        case "about":
          children.item(2).className = "current";
          break;
      }

      navigation.className = "active";
      hamburger.style.display = "none";
      hamburger.style.opacity = "0";
    } else {
      switch (currentRoute) {
        case "":
          let triangle = document.getElementById("triangle-down");
          triangle.style.opacity = "";
          let footer = document.getElementsByTagName("footer").item(0);
          footer.style.display = "";
          break;
      }

      navigation.className = "";
      hamburger.style.display = "";
      setTimeout(() => (hamburger.style.opacity = "1"), 100);
    }
  }
}
