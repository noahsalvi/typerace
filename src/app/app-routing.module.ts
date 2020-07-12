import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { TyperaceComponent } from "./typerace/typerace.component";
import { GameVerticalComponent } from "./typerace/game-vertical/game-vertical.component";
import { ResultComponent } from "./typerace/result/result.component";
import { ScoreboardComponent } from "./typerace/scoreboard/scoreboard.component";
import { GameHorizontalComponent } from "./typerace/game-horizontal/game-horizontal.component";
import { AboutComponent } from "./about/about.component";

const routes: Routes = [
  {
    path: "",
    component: LandingComponent,
  },
  {
    path: "race",
    component: TyperaceComponent,
    children: [
      {
        path: "vertical",
        component: GameVerticalComponent,
      },
      {
        path: "horizontal",
        component: GameHorizontalComponent,
      },
      {
        path: "result",
        component: ResultComponent,
      },
      {
        path: "scoreboard",
        component: ScoreboardComponent,
      },
    ],
  },
  {
    path: "scoreboard",
    redirectTo: "race/scoreboard",
  },
  {
    path: "about",
    component: AboutComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
