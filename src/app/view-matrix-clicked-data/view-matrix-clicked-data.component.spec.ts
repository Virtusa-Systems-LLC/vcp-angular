import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMatrixClickedDataComponent } from './view-matrix-clicked-data.component';

describe('ViewMatrixClickedDataComponent', () => {
  let component: ViewMatrixClickedDataComponent;
  let fixture: ComponentFixture<ViewMatrixClickedDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMatrixClickedDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMatrixClickedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
