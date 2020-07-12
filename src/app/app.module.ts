import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LandingComponent } from "./landing/landing.component";
import { TyperaceComponent } from "./typerace/typerace.component";
import { GameVerticalComponent } from "./typerace/game-vertical/game-vertical.component";
import { ScoreboardComponent } from "./typerace/scoreboard/scoreboard.component";
import { ResultComponent } from "./typerace/result/result.component";
import { HttpClientModule } from "@angular/common/http";
import { MinuteSecondsPipe } from "./minuteSeconds.pipe";
import { GameHorizontalComponent } from "./typerace/game-horizontal/game-horizontal.component";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "src/environments/environment";
import { SideNavComponent } from './side-nav/side-nav.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    TyperaceComponent,
    GameVerticalComponent,
    ScoreboardComponent,
    ResultComponent,
    MinuteSecondsPipe,
    GameHorizontalComponent,
    SideNavComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
