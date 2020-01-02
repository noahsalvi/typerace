import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TyperaceComponent } from './typerace.component';

describe('TyperaceComponent', () => {
  let component: TyperaceComponent;
  let fixture: ComponentFixture<TyperaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyperaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyperaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
