import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MocoAppComponent } from './moco-app.component';

describe('MocoAppComponent', () => {
  let component: MocoAppComponent;
  let fixture: ComponentFixture<MocoAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MocoAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MocoAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
