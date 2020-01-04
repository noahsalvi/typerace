import { Component, OnInit } from "@angular/core";
import { GameService, stages } from "../game.service";

@Component({
  selector: "app-typerace",
  templateUrl: "./typerace.component.html",
  styleUrls: ["./typerace.component.scss"]
})
export class TyperaceComponent implements OnInit {
  stage: stages;

  constructor(private gameService: GameService) {
    gameService.stage.subscribe(stage => (this.stage = stage));
  }

  ngOnInit() {}
}
