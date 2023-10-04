import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerContractBasicInformationComponent } from './customer-contract-basic-information.component';

describe('CustomerContractBasicInformationComponent', () => {
  let component: CustomerContractBasicInformationComponent;
  let fixture: ComponentFixture<CustomerContractBasicInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerContractBasicInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerContractBasicInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
