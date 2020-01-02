import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/game.service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"]
})
export class GameComponent implements OnInit {
  constructor(private gameService: GameService) {
    gameService.stage.next("game");
  }

  ngOnInit() {}
}
