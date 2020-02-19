import { Component, OnInit } from "@angular/core";
import { GameService } from "../game.service";

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"]
})
export class SideNavComponent implements OnInit {
  service;
  constructor(private gameService: GameService) {
    this.service = gameService;
  }

  ngOnInit() {}
}
