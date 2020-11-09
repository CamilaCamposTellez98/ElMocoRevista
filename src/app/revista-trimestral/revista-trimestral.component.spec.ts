import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevistaTrimestralComponent } from './revista-trimestral.component';

describe('RevistaTrimestralComponent', () => {
  let component: RevistaTrimestralComponent;
  let fixture: ComponentFixture<RevistaTrimestralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevistaTrimestralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevistaTrimestralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
