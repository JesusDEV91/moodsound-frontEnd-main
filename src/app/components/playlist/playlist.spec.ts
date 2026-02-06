import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistComponent } from './playlist';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { YouTubePlayerModule } from '@angular/youtube-player';

describe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistComponent, YouTubePlayerModule],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});