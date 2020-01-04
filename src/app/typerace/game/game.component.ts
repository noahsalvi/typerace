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
  counter = 60;
  charsTotal = 0;

  constructor(private gameService: GameService, private http: HttpClient) {
    gameService.stage.next("game");
  }

  ngOnInit() {
    this.previews.subscribe(previews => (this.viewPreviews = previews));
    let isBackspacePressed = false;
    document.addEventListener("keydown", event => {
      if (event.key == "Backspace") {
        document.getElementById("focusCatcher").focus();

        if (this.userInput.length > 0 && !isBackspacePressed) {
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
      if (event.key == " ") {
        if (this.userInput == this.expectedChars.join("")) {
          this.charsTotal += this.userInput.length;

          this.shiftWords();
        }
      } else if (event.key != "Enter" && event.key != "Backspace") {
        this.userInput += event.key;
        this.updateChars();
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
      console.log(this.expectedChars.length);
      let excessChars: string[] = this.userInput.slice(startIndex).split("");

      excessChars.forEach((char, index) => {
        if (!wordElement.children.item(startIndex + index)) {
          console.log(char);
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
    console.log(this.previews.value);
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
      this.counter--;
      this.countdown = setInterval(() => {
        this.counter--;
        console.log(this.counter);
        console.log(this.charsTotal);
        this.gameService.wpm.next(
          Math.floor(this.charsTotal / 5 / ((60 - this.counter) / 60))
        );
        if (this.counter <= 0) {
          clearInterval(this.countdown);
          console.log(this.charsTotal / 5, " wpm");
        }
      }, 1000);
    }
  }
}
