import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LandingComponent } from "./landing/landing.component";
import { TyperaceComponent } from "./typerace/typerace.component";
import { GameComponent } from "./typerace/game/game.component";
import { ScoreboardComponent } from "./typerace/scoreboard/scoreboard.component";
import { ResultComponent } from "./typerace/result/result.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { MinuteSecondsPipe } from "./minuteSeconds.pipe";

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    TyperaceComponent,
    GameComponent,
    ScoreboardComponent,
    ResultComponent,
    MinuteSecondsPipe
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
