import { Component, OnInit, HostListener, OnDestroy } from "@angular/core";
import { GameService } from "src/app/game.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Component({
  selector: "app-scoreboard",
  templateUrl: "./scoreboard.component.html",
  styleUrls: ["./scoreboard.component.scss"]
})
export class ScoreboardComponent implements OnInit, OnDestroy {
  confirmationNeeded = false;
  game;
  keyCooldown;

  constructor(
    private gameService: GameService,
    private router: Router,
    private db: AngularFirestore
  ) {
    this.game = this.gameService;
    if (gameService.stage.value == "result") {
      this.confirmationNeeded = true;
      gameService.stage.next("confirmation");
    } else {
      gameService.stage.next("scoreboard");
    }
  }
  @HostListener("document:keypress", ["$event"])
  keypress(event: KeyboardEvent) {
    if (this.keyCooldown) {
      if (event.key == "Backspace") this.focusOnInput();
      else if (event.key == "Enter" && this.confirmationNeeded) {
        this.confirmEntry();
        this.gameService.animationController.next("confirmation-enter");
      } else if (event.key == "Escape" && this.confirmationNeeded) {
        this.closeConfirmation();
        this.gameService.animationController.next("confirmation-escape");
      } else if (event.key == "r" && !this.confirmationNeeded) {
        let direction = localStorage.getItem("direction");
        if (direction == "horizontal") {
          this.router.navigate(["race/horizontal"], {
            skipLocationChange: true
          });
        } else {
          this.router.navigate(["race/vertical"], { skipLocationChange: true });
        }
      }
    }
  }

  @HostListener("document:keydown", ["$event"])
  keydown(event: KeyboardEvent) {
    if (event.key == "Escape" && this.confirmationNeeded) {
      this.closeConfirmation();
      this.gameService.animationController.next("confirmation-escape");
    }
    if (event.key == "Backspace" && !this.confirmationNeeded)
      document.getElementById("focusCatcher").focus();
  }

  ngOnInit() {
    if (this.confirmationNeeded) this.setupConfirmation();
    setTimeout(() => (this.keyCooldown = true), 0);
    this.setupEntry();
  }

  confirmEntry() {
    let nameInput: HTMLInputElement = document.getElementById(
      "input-confirmation-name"
    ) as HTMLInputElement;

    let entryName = nameInput.value;
    let entryWPM = this.gameService.wpm.value;
    let entryTotal = this.gameService.totalWords.value;
    let entryWrong = this.gameService.wrongWords.value;
    let entryDate = new Date();

    this.db
      .collection("scores")
      .get()
      .toPromise()
      .then(scores => {
        let isBetter = true;

        scores.forEach(data => {
          let score = data.data();
          if (score.name == entryName) {
            if (score.wpm == entryWPM) {
              isBetter = false;
            } else if (score.wpm < entryWPM) {
              isBetter = false;
              this.db
                .collection("scores", ref => ref.where("name", "==", entryName))
                .stateChanges()
                .subscribe(doc => {
                  let id = doc[0].payload.doc.id;
                  this.db
                    .collection("scores")
                    .doc(id)
                    .update({
                      name: entryName,
                      wpm: entryWPM,
                      wrongWords: entryWrong,
                      totalWords: entryTotal,
                      date: entryDate
                    });
                });
            } else {
              isBetter = false;
            }
          }
        });
        if (isBetter)
          this.db.collection("scores").add({
            name: entryName,
            wpm: entryWPM,
            wrongWords: entryWrong,
            totalWords: entryTotal,
            date: entryDate
          });
      });

    this.closeConfirmation();
    this.gameService.setName(entryName);
    // this.gameService.resetGame();
  }

  setupEntry() {
    let nameInput: HTMLInputElement = document.getElementById(
      "input-confirmation-name"
    ) as HTMLInputElement;
    nameInput.value = this.gameService.getName();
  }

  setupConfirmation() {
    let newEntry = document.getElementById("new-entry");
    newEntry.style.display = "block";
    let input = document.getElementById("input-confirmation-name");
    this.moveCursorToEnd(input);
    setTimeout(() => {
      newEntry.style.opacity = "1";
    }, 0);

    let scoreboard = document.getElementById("scoreboard");
    scoreboard.style.opacity = "0.2";
    scoreboard.style.overflow = "hidden";
  }

  closeConfirmation() {
    let newEntry = document.getElementById("new-entry");
    newEntry.style.opacity = "";
    setTimeout(() => {
      newEntry.style.display = "";
    }, 300);

    let scoreboard = document.getElementById("scoreboard");
    scoreboard.style.opacity = "";
    scoreboard.style.overflow = "";

    this.confirmationNeeded = false;
    setTimeout(() => {
      this.gameService.stage.next("scoreboard");
    }, 500);
  }

  moveCursorToEnd(el) {
    if (typeof el.selectionStart == "number") {
      el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
      el.focus();
      var range = el.createTextRange();
      range.collapse(false);
      range.select();
    }
    el.focus();
  }

  //focus on input when clicking anywhere on new-entry container
  focusOnInput() {
    let input = document.getElementById("input-confirmation-name");
    input.focus();
  }

  //reset after navigating away
  ngOnDestroy() {
    this.gameService.stage.next("none");
  }
}
