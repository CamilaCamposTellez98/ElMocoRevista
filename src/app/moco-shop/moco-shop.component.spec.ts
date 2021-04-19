import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MocoShopComponent } from './moco-shop.component';

describe('MocoShopComponent', () => {
  let component: MocoShopComponent;
  let fixture: ComponentFixture<MocoShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MocoShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MocoShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
