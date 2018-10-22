import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstpieceComponent } from './firstpiece.component';

describe('FirstpieceComponent', () => {
  let component: FirstpieceComponent;
  let fixture: ComponentFixture<FirstpieceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstpieceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstpieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
