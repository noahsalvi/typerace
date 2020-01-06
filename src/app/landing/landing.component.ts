import { Component, OnInit } from "@angular/core";
import { GameService } from "../game.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"]
})
export class LandingComponent implements OnInit {
  playerName = "";
  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit() {}

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  submitName() {
    if (this.playerName != "" && this.playerName != " ") {
      this.gameService.setName(this.playerName.trim());
      this.router.navigate(["race"], { skipLocationChange: true });
    }
  }
}
