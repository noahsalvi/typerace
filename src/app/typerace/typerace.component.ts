import { Component, OnInit, HostListener, AfterViewInit } from "@angular/core";
import { GameService, stages } from "../game.service";

@Component({
  selector: "app-typerace",
  templateUrl: "./typerace.component.html",
  styleUrls: ["./typerace.component.scss"]
})
export class TyperaceComponent implements OnInit {
  game;
  constructor(private gameService: GameService) {
    this.game = gameService;
  }

  @HostListener("document:keydown", ["$event"])
  keydown(event) {
    if (event.key == "Backspace")
      document.getElementById("focusCatcher").focus();
  }
  ngOnInit() {
    this.game.animationController.subscribe(event => {
      if (event == "enter") {
        console.log("tes");
        let enterHint = document.getElementById("enter-hint");
        enterHint.style.animation = "buttonClicked 0.4s";

        setTimeout(() => (enterHint.style.animation = ""), 400);
      }
    });

    this.gameService.wrongWords.subscribe(mistakes => {
      if (mistakes > 0) {
        document.getElementById("mistakes").style.animation = "attention 0.5s";
        setTimeout(
          () => (document.getElementById("mistakes").style.animation = ""),
          600
        );
      }
    });
  }
}
