import { Component, OnInit } from "@angular/core";
import { GameService } from "../game.service";
import { Router } from "@angular/router";
import { isDefined } from "@angular/compiler/src/util";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"]
})
export class LandingComponent implements OnInit {
  playerName;

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit() {
    this.playerName = this.gameService.getName();
    let direction: string = localStorage.getItem("direction");

    if (direction == "vertical") {
      let switchCircle = document.getElementById("switch-circle");
      switchCircle.style.left = "auto";
      switchCircle.style.left = "35px";

      let arrows = document.getElementById("arrows");
      arrows.style.transform = "rotate(90deg)";
    } else if (direction == "horizontal") {
    } else {
      localStorage.setItem("direction", "horizontal");
    }
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  submitName() {
    if (this.playerName != "" && this.playerName != " ") {
      this.gameService.setName(this.playerName.trim());
      let direction = localStorage.getItem("direction");

      if (direction == "horizontal") {
        this.router.navigate(["race/horizontal"], { skipLocationChange: true });
      } else {
        this.router.navigate(["race/vertical"], { skipLocationChange: true });
      }
    }
  }

  onSwitch() {
    let direction: string = localStorage.getItem("direction");
    let switchCircle = document.getElementById("switch-circle");
    let arrows = document.getElementById("arrows");

    if (direction == "horizontal") {
      localStorage.setItem("direction", "vertical");

      switchCircle.style.left = "auto";
      switchCircle.style.left = "35px";
      arrows.style.transform = "rotate(90deg)";
    } else if (direction == "vertical") {
      localStorage.setItem("direction", "horizontal");

      switchCircle.style.left = "0";
      arrows.style.transform = "rotate(0)";
    }
  }

  toggleActive(bool: boolean) {
    let navigation = document.getElementById("navigation");
    let footer = document.getElementsByTagName("footer").item(0);
    let triangle = document.getElementById("triangle-down");
    let navigationChildren = document.getElementById("navigation").children;
    let hamburger = document.getElementById("hamburger");
    if (bool) {
      navigation.className = "active";
      footer.style.display = "none";
      triangle.style.opacity = "0";
      hamburger.style.display = "none";
      hamburger.style.opacity = "0";
    } else {
      navigation.className = "";
      footer.style.display = "";
      triangle.style.opacity = "";
      hamburger.style.display = "";
      setTimeout(() => (hamburger.style.opacity = "1"), 100);
    }
  }
}
