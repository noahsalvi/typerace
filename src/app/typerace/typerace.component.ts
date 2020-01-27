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

  ngOnInit() {
    this.game.animationController.subscribe(event => {
      if (event == "game-enter") {
        let enterHint = document.getElementById("enter-hint");
        enterHint.style.animation = "buttonClicked 0.4s";
        setTimeout(() => (enterHint.style.animation = ""), 400);
      } else if (event == "confirmation-enter") {
        let enterConfirmation = document.getElementById("enter-confirmation");
        enterConfirmation.style.animation = "buttonClicked 0.4s";
        setTimeout(() => (enterConfirmation.style.animation = ""), 400);
      } else if (event == "confirmation-escape") {
        let enterConfirmation = document.getElementById("esc-confirmation");
        enterConfirmation.style.animation = "buttonClicked 0.4s";
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

  toggleActive(bool: boolean) {
    let navigation = document.getElementById("navigation");
    let hamburger = document.getElementById("hamburger");
    if (bool) {
      navigation.className = "active";
      hamburger.style.display = "none";
      hamburger.style.opacity = "0";
    } else {
      navigation.className = "";
      hamburger.style.display = "";
      setTimeout(() => (hamburger.style.opacity = "1"), 100);
    }
  }
}
