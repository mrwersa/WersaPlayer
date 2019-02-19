import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicControlsComponent } from './music-controls.component';

describe('MusicControlsComponent', () => {
  let component: MusicControlsComponent;
  let fixture: ComponentFixture<MusicControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
