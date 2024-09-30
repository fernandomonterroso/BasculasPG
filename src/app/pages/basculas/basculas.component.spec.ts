import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasculasComponent } from './basculas.component';

describe('BasculasComponent', () => {
  let component: BasculasComponent;
  let fixture: ComponentFixture<BasculasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasculasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
