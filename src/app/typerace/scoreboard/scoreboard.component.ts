import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/game.service";

@Component({
  selector: "app-scoreboard",
  templateUrl: "./scoreboard.component.html",
  styleUrls: ["./scoreboard.component.scss"]
})
export class ScoreboardComponent implements OnInit {
  constructor(private gameService: GameService) {
    gameService.stage.next("scoreboard");
  }
  ngOnInit() {}
}
