import { Component, OnInit, HostListener } from "@angular/core";
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
  ngOnInit() {}
}
