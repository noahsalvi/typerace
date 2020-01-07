import { Component, OnInit } from "@angular/core";
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

  ngOnInit() {}
}
