import { Component, OnInit, HostListener } from "@angular/core";
import { GameService } from "src/app/game.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"]
})
export class ResultComponent implements OnInit {
  feedback: string;
  game;
  constructor(private gameService: GameService, private router: Router) {
    this.game = gameService;
    gameService.stage.next("result");
  }

  @HostListener("document:keypress", ["$event"])
  keypress(event: KeyboardEvent) {
    if (event.key == "r") {
      let direction = localStorage.getItem("direction");
      if (direction == "horizontal") {
        this.router.navigate(["race/horizontal"], { skipLocationChange: true });
      } else {
        this.router.navigate(["race/vertical"], { skipLocationChange: true });
      }
    }
  }

  ngOnInit() {
    this.evaluate();
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
}
