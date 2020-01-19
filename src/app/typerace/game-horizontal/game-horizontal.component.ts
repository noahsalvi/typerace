import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener,
  OnDestroy
} from "@angular/core";
import { GameService } from "src/app/game.service";
import { isDefined } from "@angular/compiler/src/util";
import { Router } from "@angular/router";

@Component({
  selector: "app-game-horizontal",
  templateUrl: "./game-horizontal.component.html",
  styleUrls: ["./game-horizontal.component.scss"]
})
export class GameHorizontalComponent implements OnInit, OnDestroy {
  words: string[] = [];
  viewPreviews;
  expectedChars: string[];
  userInput: string = "";
  countdown;
  counter = 60;
  charsTotal = 0;
  isFinished = false;
  mistakes: string;
  isBackspacePressed = false;
  wordIndex = 0;

  constructor(private gameService: GameService, private router: Router) {
    gameService.stage.next("game");
  }

  @HostListener("document:mousemove", ["$event"])
  mousemove(event) {
    this.toggleCursor(true);
  }

  @HostListener("document:keydown", ["$event"])
  keydown(event) {
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
            .getElementById("currentWord")
            .children.item(
              document.getElementById("currentWord").childElementCount - 1
            ).className == "excess"
        ) {
          document.getElementById("currentWord").lastChild.remove();
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

        let wordPreviewElement = document.getElementById(
          "word-" + this.wordIndex
        );
        for (let i = 0; i < wordPreviewElement.childElementCount; i++) {
          if (wordPreviewElement.children.item(i).className == "preview")
            wordPreviewElement.children.item(i).className = "excess";
        }
      }
      this.wordIndex++;
      this.nextLine();
      this.nextWord();
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
      this.resetGame();
    }
  }

  ngOnInit() {
    setTimeout(() => this.setupGame(), 0); //timeout is needed for it display the length correctly
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
  }

  setupGame() {
    this.getWords();
    this.resetGame();

    this.words.forEach((word, index) => {
      let node = document.createElement("span");
      node.id = "word-" + index;
      word.split("").forEach(char => {
        let span = document.createElement("span");
        span.innerText = char;
        span.className = "preview";
        node.appendChild(span);
      });
      let text = document.getElementById("text");
      text.appendChild(node);
    });

    this.setupWordToType();
  }

  resetGame() {
    clearInterval(this.countdown);

    document.getElementById("counter").classList.remove("blinking");
    this.counter = 60;
    this.userInput = "";
    this.mistakes = undefined;
    console.log("undfeined");
    this.countdown = undefined;
    this.charsTotal = 0;
    this.gameService.resetGame();
    this.wordIndex = 0;

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

    this.getWords();

    let text = document.getElementById("text");
    text.style.bottom = "";

    let lastChild = text.lastElementChild;
    while (text.lastElementChild) {
      text.removeChild(lastChild);
      lastChild = text.lastElementChild;
    }

    this.words.forEach((word, index) => {
      let node = document.createElement("span");
      node.id = "word-" + index;

      word.split("").forEach(char => {
        let span = document.createElement("span");
        span.innerText = char;
        span.className = "preview";
        node.appendChild(span);
      });

      text.appendChild(node);
    });

    this.setupWordToType();
  }

  getWords() {
    for (let index = 0; index < 300; index++) {
      let words = this.gameService.words.value;
      let randomNumber = Math.floor(Math.random() * words.length);
      this.words[index] = words[randomNumber];
    }
  }

  setupWordToType() {
    let wordElement = document.getElementById("currentWord");
    wordElement.innerText = ""; //remove br-tag & existing characters
    this.userInput = ""; //remove typed Input

    let word = this.words[this.wordIndex];

    this.expectedChars = word.split("");
    this.expectedChars.forEach((char, index) => {
      let node = document.createElement("span");
      node.innerText = char;
      node.className = "preview";

      wordElement.appendChild(node);
    });
  }

  updateChars() {
    this.toggleCursor(false);
    let wordElement = document.getElementById("currentWord");
    let wordPreviewElement = document.getElementById("word-" + this.wordIndex);

    console.log("test");

    this.expectedChars.forEach((char, index) => {
      if (this.expectedChars[index] == this.userInput[index]) {
        wordElement.children.item(index).className = "";
        wordPreviewElement.children.item(index).className = "";
      } else if (!isDefined(this.userInput[index])) {
        wordElement.children.item(index).className = "preview";
        wordPreviewElement.children.item(index).className = "preview";
      } else {
        wordElement.children.item(index).className = "wrong";
        wordPreviewElement.children.item(index).className = "wrong";
      }
    });

    if (this.userInput.length > this.expectedChars.length) {
      let startIndex = this.expectedChars.length;
      let excessChars: string[] = this.userInput.slice(startIndex).split("");

      for (let i = 0; i < wordPreviewElement.childElementCount; i++) {
        wordPreviewElement.children.item(i).className = "excess";
      }

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

  nextWord() {
    this.setupWordToType();

    let wordPreviewElement = document.getElementById("word-" + this.wordIndex);
    wordPreviewElement.className = "active-preview";
  }

  toggleCursor(bool: boolean) {
    if (bool) {
      document.body.style.cursor = "";
      document.getElementById("logo").style.cursor = "";
    } else {
      document.body.style.cursor = "none";
      document.getElementById("logo").style.cursor = "none";
    }
  }

  nextLine() {
    let previewsWord = document.getElementById("word-" + (this.wordIndex - 1));
    let currentWord = document.getElementById("word-" + this.wordIndex);
    let text = document.getElementById("text");

    if (
      currentWord.getBoundingClientRect().left <
      previewsWord.getBoundingClientRect().left
    ) {
      let currentOffset = parseInt(text.style.bottom);

      if (isNaN(currentOffset)) {
        text.style.bottom = "55px";
      } else {
        let newOffset = currentOffset + 55;
        text.style.bottom = newOffset + "px";
      }
    }

    previewsWord.className = "";
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
          this.toggleCursor(true);

          this.router.navigate(["race/result"], { skipLocationChange: true });
        } else if (this.counter == 5)
          document.getElementById("counter").classList.add("blinking");
      }, 1000);
    }
  }

  ngOnDestroy() {
    clearInterval(this.countdown);
  }
}
