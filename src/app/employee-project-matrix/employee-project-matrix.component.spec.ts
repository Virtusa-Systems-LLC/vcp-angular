import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeProjectMatrixComponent } from './employee-project-matrix.component';

describe('EmployeeProjectMatrixComponent', () => {
  let component: EmployeeProjectMatrixComponent;
  let fixture: ComponentFixture<EmployeeProjectMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeProjectMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeProjectMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
