import { Component, OnInit, HostListener, OnDestroy } from "@angular/core";
import { GameService } from "src/app/game.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"]
})
export class ResultComponent implements OnInit, OnDestroy {
  cooldown = true;
  feedback: string;
  game;
  correctWords;
  totalWords;
  percentage;

  constructor(private gameService: GameService, private router: Router) {
    this.game = gameService;
    gameService.stage.next("result");
  }

  @HostListener("document:keydown", ["$event"])
  keydown(event: KeyboardEvent) {
    if (event.key == "Backspace")
      document.getElementById("focusCatcher").focus();
  }

  @HostListener("document:keypress", ["$event"])
  keypress(event: KeyboardEvent) {
    if (event.key == "r" && !this.cooldown) {
      let direction = localStorage.getItem("direction");
      if (direction == "horizontal") {
        this.router.navigate(["race/horizontal"], { skipLocationChange: true });
      } else {
        this.router.navigate(["race/vertical"], { skipLocationChange: true });
      }
    } else if (event.key == "Enter" && !this.cooldown) {
      this.router.navigate(["race/scoreboard"], { skipLocationChange: true });
    }
  }

  ngOnInit() {
    setTimeout(() => (this.cooldown = false), 600);
    this.evaluate();
    this.totalWords = this.game.totalWords.value;
    this.correctWords = this.totalWords - this.game.wrongWords.value;
    this.percentage = (100 / this.totalWords) * this.correctWords;
  }

  evaluate() {
    let wpm = this.gameService.wpm.value;
    if (wpm >= 100) this.feedback = "Godlike!";
    else if (wpm >= 90) this.feedback = "Amazing!";
    else if (wpm >= 80) this.feedback = "Good Job!";
    else if (wpm >= 70) this.feedback = "Not Bad!";
    else if (wpm >= 60) this.feedback = "Pretty Okay";
    else if (wpm >= 44) this.feedback = "Above Average";
    else this.feedback = "Terrible";
  }

  ngOnDestroy() {
    this.gameService.stage.next("none");
  }
}
