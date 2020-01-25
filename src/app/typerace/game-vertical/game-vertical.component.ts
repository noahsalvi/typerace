import {
  Component,
  OnInit,
  HostListener,
  Host,
  OnDestroy
} from "@angular/core";
import { GameService } from "src/app/game.service";
import { BehaviorSubject } from "rxjs";
import { isDefined } from "@angular/compiler/src/util";
import { Router } from "@angular/router";

@Component({
  selector: "app-game-vertical",
  templateUrl: "./game-vertical.component.html",
  styleUrls: ["./game-vertical.component.scss"]
})
export class GameVerticalComponent implements OnInit, OnDestroy {
  words: string[];
  previews: BehaviorSubject<string[]> = new BehaviorSubject([
    "\n",
    "\n",
    "\n",
    "\n",
    "\n"
  ]);
  viewPreviews;
  expectedChars: string[];
  userInput: string = "";
  countdown;
  counter = 60;
  charsTotal = 0;
  isFinished = false;
  mistakes: string;
  isBackspacePressed = false;

  constructor(private gameService: GameService, private router: Router) {
    gameService.stage.next("game");
  }

  @HostListener("document:mousemove", ["$event"])
  mousemove(event) {
    this.toggleCursor(true);
  }

  @HostListener("document:keydown", ["$event"])
  keydown(event) {
    //check for caps lock
    let capsLock = document.getElementById("caps-lock");
    if (event.getModifierState("CapsLock")) {
      capsLock.style.opacity = "1";
    } else {
      capsLock.style.opacity = "0";
    }

    if (event.key == "Backspace") {
      document.getElementById("focusCatcher").focus();

      if (
        this.userInput.length > 0 &&
        !this.isBackspacePressed &&
        !this.isFinished
      ) {
        this.isBackspacePressed = true;
        this.userInput = this.userInput.slice(0, this.userInput.length - 1);
        if (
          document
            .getElementById("word")
            .children.item(
              document.getElementById("word").childElementCount - 1
            ).className == "excess"
        ) {
          document.getElementById("word").lastChild.remove();
        }
        this.updateChars();
      }
    }
  }

  @HostListener("document:keyup", ["$event"])
  keyup(event) {
    this.isBackspacePressed = false;
  }

  @HostListener("document:keypress", ["$event"])
  keypress(event) {
    if (event.key == " " && this.userInput != "" && !this.isFinished) {
      if (this.userInput == this.expectedChars.join("")) {
        this.charsTotal += this.userInput.length + 1;
      } else {
        this.gameService.wrongWords.next(this.gameService.wrongWords.value + 1);
      }

      this.shiftWords();
    } else if (
      event.key != "Enter" &&
      event.key != "Backspace" &&
      event.key != " "
    ) {
      document.getElementById("start-here").style.animation =
        "fade-out 0.35s ease-out forwards";
      this.userInput += event.key;
      if (!this.isFinished) this.updateChars();
      this.startCountdown();
    } else if (event.key == "Enter") {
      this.gameService.animationController.next("game-enter");

      clearInterval(this.countdown);
      document.getElementById("counter").classList.remove("blinking");
      document.getElementById("start-here").style.animationDirection =
        "reverse";
      document.getElementById("start-here").style.animation = "";
      this.counter = 60;
      this.userInput = "";
      this.mistakes = undefined;
      this.countdown = undefined;
      this.charsTotal = 0;
      this.gameService.resetGame();
      this.setupWords();
      this.gameService.wrongWords.subscribe(mistakes => {
        if (mistakes > 0) {
          this.mistakes = "x" + mistakes;
          document.getElementById("mistakes").style.animation =
            "attention 0.5s";
          setTimeout(
            () => (document.getElementById("mistakes").style.animation = ""),
            600
          );
        }
      });
    }
  }

  ngOnInit() {
    this.gameService.resetGame();

    this.previews.subscribe(previews => (this.viewPreviews = previews));

    this.gameService.wrongWords.subscribe(mistakes => {
      if (mistakes > 0) {
        this.mistakes = "x" + mistakes;
        document.getElementById("mistakes").style.animation = "attention 0.5s";
        setTimeout(
          () => (document.getElementById("mistakes").style.animation = ""),
          600
        );
      }
    });

    //Here is the start of the usual code
    this.setupWords();
  }

  updateChars() {
    this.toggleCursor(false);
    let wordElement = document.getElementById("word");

    this.expectedChars.forEach((char, index) => {
      if (this.expectedChars[index] == this.userInput[index]) {
        wordElement.children.item(index).className = "";
      } else if (!isDefined(this.userInput[index])) {
        wordElement.children.item(index).className = "preview";
      } else {
        wordElement.children.item(index).className = "wrong";
      }
    });

    if (this.userInput.length > this.expectedChars.length) {
      let startIndex = this.expectedChars.length;
      let excessChars: string[] = this.userInput.slice(startIndex).split("");

      excessChars.forEach((char, index) => {
        if (!wordElement.children.item(startIndex + index)) {
          let node = document.createElement("span");
          node.innerText = char;
          node.className = "excess";

          wordElement.appendChild(node);
        }
      });
    }
  }

  setupWords() {
    let nextPreviews = this.previews.getValue();
    this.previews.getValue().forEach((preview, index: number) => {
      let randomNumber = Math.floor(
        Math.random() * this.gameService.words.value.length
      );
      nextPreviews[index] = this.gameService.words.value[randomNumber];
    });
    this.previews.next(nextPreviews);
    let randomNumber = Math.floor(
      Math.random() * this.gameService.words.value.length
    );

    let wordToType = this.gameService.words.value[randomNumber];
    this.setupChars(wordToType);
  }

  setupChars(word: string) {
    let wordElement = document.getElementById("word");
    wordElement.innerText = ""; //remove br-tag & existing characters
    this.userInput = ""; //remove typed Input

    this.expectedChars = word.split("");
    this.expectedChars.forEach((char, index) => {
      let node = document.createElement("span");
      node.innerText = char;
      node.className = "preview";

      wordElement.appendChild(node);
    });
  }

  shiftWords() {
    this.gameService.totalWords.next(this.gameService.totalWords.value + 1);

    let nextPreviews = this.previews.getValue();
    let wordToType = nextPreviews[0];
    this.setupChars(wordToType);

    for (let x = 0; x < 4; x++) {
      nextPreviews[x] = nextPreviews[x + 1];
    }
    let randomNumber = Math.floor(
      Math.random() * this.gameService.words.value.length
    );
    nextPreviews[nextPreviews.length - 1] = this.gameService.words.value[
      randomNumber
    ];
    this.previews.next(nextPreviews);
  }

  toggleCursor(bool: boolean) {
    if (bool) {
      document.body.style.cursor = "";
    } else {
      document.body.style.cursor = "none !important";
    }
  }

  startCountdown() {
    if (!isDefined(this.countdown)) {
      this.countdown = setInterval(() => {
        this.counter--;
        this.gameService.wpm.next(
          Math.floor(this.charsTotal / 5 / ((60 - this.counter) / 60))
        );
        if (this.counter <= 0) {
          clearInterval(this.countdown);

          this.isFinished = true;
          this.getRemainingChars();

          this.router.navigate(["race/result"], { skipLocationChange: true });
        } else if (this.counter == 5)
          document.getElementById("counter").classList.add("blinking");
      }, 1000);
    }
  }

  getRemainingChars() {
    let correctChars = 0;
    let hasMistake = false;
    this.userInput.split("").forEach((char, index) => {
      if (char == this.expectedChars[index]) {
        correctChars++;
      } else {
        hasMistake = true;
      }
    });

    if (!hasMistake) this.charsTotal += correctChars;
    this.gameService.wpm.next(
      Math.floor(this.charsTotal / 5 / ((60 - this.counter) / 60))
    );
  }

  ngOnDestroy() {
    clearInterval(this.countdown);
  }
}
