import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Ajusta la ruta según donde creaste la carpeta finalmente
import { MiniPlayerComponent } from './components/mini-player/mini-player'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    MiniPlayerComponent // <--- ESTO ES LO QUE SOLUCIONA EL ERROR
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  
  ngOnInit() {
    // Esto asegura que el reproductor de YouTube funcione globalmente
    if (!window['YT']) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }
}