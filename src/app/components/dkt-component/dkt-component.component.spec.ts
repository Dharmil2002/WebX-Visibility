import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DktComponentComponent } from './dkt-component.component';

describe('DktComponentComponent', () => {
  let component: DktComponentComponent;
  let fixture: ComponentFixture<DktComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DktComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DktComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
