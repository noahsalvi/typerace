import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameVerticalComponent } from "./game-vertical.component";

describe("GameVerticalComponent", () => {
  let component: GameVerticalComponent;
  let fixture: ComponentFixture<GameVerticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameVerticalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
