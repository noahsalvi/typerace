import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { TyperaceComponent } from './typerace/typerace.component';
import { GameComponent } from './typerace/game/game.component';
import { ScoreboardComponent } from './typerace/scoreboard/scoreboard.component';
import { ResultComponent } from './typerace/result/result.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    TyperaceComponent,
    GameComponent,
    ScoreboardComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
