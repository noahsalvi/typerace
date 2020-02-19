import { Component } from "@angular/core";
import { GameService } from "./game.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "typerace";
  service;
  constructor(private gameService: GameService) {
    this.service = gameService;
  }
}
