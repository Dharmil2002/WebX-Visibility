import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DKTTemplateComponent } from './dkttemplate.component';

describe('DKTTemplateComponent', () => {
  let component: DKTTemplateComponent;
  let fixture: ComponentFixture<DKTTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DKTTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DKTTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
