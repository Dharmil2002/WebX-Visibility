import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EwaybillConfigComponent } from './ewaybill-config.component';

describe('EwaybillConfigComponent', () => {
  let component: EwaybillConfigComponent;
  let fixture: ComponentFixture<EwaybillConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EwaybillConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EwaybillConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
