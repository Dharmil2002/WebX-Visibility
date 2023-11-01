import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitVoucherPreviewComponent } from './debit-voucher-preview.component';

describe('DebitVoucherPreviewComponent', () => {
  let component: DebitVoucherPreviewComponent;
  let fixture: ComponentFixture<DebitVoucherPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitVoucherPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitVoucherPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
