import { Injectable, Type } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type stages = "game" | "result" | "scoreboard";

@Injectable({
  providedIn: "root"
})
export class GameService {
  stage: BehaviorSubject<stages> = new BehaviorSubject<stages>("game");
  constructor() {
    setInterval(() => console.log(this.getName()), 1000);
  }

  getName() {
    return sessionStorage.getItem("name");
  }

  setName(name: string) {
    sessionStorage.setItem("name", name);
  }
}
