import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/game.service";

@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"]
})
export class ResultComponent implements OnInit {
  constructor(private gameService: GameService) {
    gameService.stage.next("result");
  }
  ngOnInit() {}
}
