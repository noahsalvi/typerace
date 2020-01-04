import { Component, OnInit, HostListener, Host } from "@angular/core";
import { GameService } from "src/app/game.service";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Key } from "protractor";
import { isDefined } from "@angular/compiler/src/util";
import { start } from "repl";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"]
})
export class GameComponent implements OnInit {
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
  counter = 5;
  charsTotal = 0;
  isFinished = false;

  constructor(private gameService: GameService, private http: HttpClient) {
    gameService.stage.next("game");
  }

  ngOnInit() {
    this.previews.subscribe(previews => (this.viewPreviews = previews));
    let isBackspacePressed = false;
    document.addEventListener("keydown", event => {
      if (event.key == "Backspace") {
        document.getElementById("focusCatcher").focus();

        if (
          this.userInput.length > 0 &&
          !isBackspacePressed &&
          !this.isFinished
        ) {
          isBackspacePressed = true;
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
    });

    document.addEventListener("keyup", event => {
      isBackspacePressed = false;
    });

    document.addEventListener("keypress", event => {
      if (event.key == " " && this.userInput != "" && !this.isFinished) {
        if (this.userInput == this.expectedChars.join("")) {
          this.charsTotal += this.userInput.length + 1;
        } else {
          this.gameService.wrongWords.next(
            this.gameService.wrongWords.value + 1
          );
        }

        this.shiftWords();
      } else if (event.key != "Enter" && event.key != "Backspace") {
        this.userInput += event.key;
        if (!this.isFinished) this.updateChars();
        this.startCountdown();
      }
    });

    document.addEventListener("mousemove", event => {
      this.toggleCursor(true);
    });

    //Here is the start of the usual code
    this.getWords();
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

  getWords() {
    this.http
      .get("assets/words.txt", { responseType: "text" })
      .subscribe(data => {
        this.words = data.split(/\r?\n/);
        this.setupWords();
      });
  }

  setupWords() {
    let nextPreviews = this.previews.getValue();
    this.previews.getValue().forEach((preview, index: number) => {
      let randomNumber = Math.floor(Math.random() * this.words.length);
      nextPreviews[index] = this.words[randomNumber];
    });
    this.previews.next(nextPreviews);
    let randomNumber = Math.floor(Math.random() * this.words.length);

    let wordToType = this.words[randomNumber];
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
    let nextPreviews = this.previews.getValue();
    let wordToType = nextPreviews[0];
    this.setupChars(wordToType);

    for (let x = 0; x < 4; x++) {
      nextPreviews[x] = nextPreviews[x + 1];
    }
    let randomNumber = Math.floor(Math.random() * this.words.length);
    nextPreviews[nextPreviews.length - 1] = this.words[randomNumber];
    this.previews.next(nextPreviews);
  }

  toggleCursor(bool: boolean) {
    if (bool) {
      document.getElementById("word").style.cursor = "text";
      document.body.style.cursor = "default";
    } else {
      document.getElementById("word").style.cursor = "none";
      document.body.style.cursor = "none";
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
          console.log(this.charsTotal / 5, " wpm");
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
}
