import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTodoComponent } from './game-todo.component';

describe('GameTodoComponent', () => {
  let component: GameTodoComponent;
  let fixture: ComponentFixture<GameTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameTodoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
