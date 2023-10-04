import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerContractServiceSelectionComponent } from './customer-contract-service-selection.component';

describe('CustomerContractServiceSelectionComponent', () => {
  let component: CustomerContractServiceSelectionComponent;
  let fixture: ComponentFixture<CustomerContractServiceSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerContractServiceSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerContractServiceSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
