import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRunSheetComponent } from './create-run-sheet.component';

describe('CreateRunSheetComponent', () => {
  let component: CreateRunSheetComponent;
  let fixture: ComponentFixture<CreateRunSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRunSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRunSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
