import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameHorizontalComponent } from './game-horizontal.component';

describe('GameHorizontalComponent', () => {
  let component: GameHorizontalComponent;
  let fixture: ComponentFixture<GameHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameHorizontalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
