import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { TyperaceComponent } from "./typerace/typerace.component";
import { GameComponent } from "./typerace/game/game.component";
import { ResultComponent } from "./typerace/result/result.component";
import { ScoreboardComponent } from "./typerace/scoreboard/scoreboard.component";

const routes: Routes = [
  {
    path: "",
    component: LandingComponent
  },
  {
    path: "race",
    component: TyperaceComponent,
    children: [
      {
        path: "",
        component: GameComponent
      },
      {
        path: "result",
        component: ResultComponent
      },
      {
        path: "scoreboard",
        component: ScoreboardComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
