import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipListStaticComponent } from './chip-list-static.component';

describe('ChipListStaticComponent', () => {
  let component: ChipListStaticComponent;
  let fixture: ComponentFixture<ChipListStaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipListStaticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChipListStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
