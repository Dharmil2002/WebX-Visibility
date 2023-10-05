import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualLoginComponent } from './virtual-login.component';

describe('VirtualLoginComponent', () => {
  let component: VirtualLoginComponent;
  let fixture: ComponentFixture<VirtualLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
