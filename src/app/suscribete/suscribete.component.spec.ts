import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuscribeteComponent } from './suscribete.component';

describe('SuscribeteComponent', () => {
  let component: SuscribeteComponent;
  let fixture: ComponentFixture<SuscribeteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuscribeteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuscribeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
