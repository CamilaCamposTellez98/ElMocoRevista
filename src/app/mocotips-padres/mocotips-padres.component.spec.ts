import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MocotipsPadresComponent } from './mocotips-padres.component';

describe('MocotipsPadresComponent', () => {
  let component: MocotipsPadresComponent;
  let fixture: ComponentFixture<MocotipsPadresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MocotipsPadresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MocotipsPadresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
