import { Component, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-mini-player',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, YouTubePlayerModule],
  templateUrl: './mini-player.html',
  styleUrls: ['./mini-player.css']
})
export class MiniPlayerComponent {
  @ViewChild('playerContainer') playerContainer!: ElementRef;
  public playerService = inject(PlayerService);

  // Variables para el drag and drop
  isDragging = false;
  offsetX = 0;
  offsetY = 0;
  posX = 24; // Posición inicial derecha
  posY = 24; // Posición inicial inferior

  /**
   * Inicia el drag del reproductor
   */
  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    const element = this.playerContainer.nativeElement;
    
    // Calcular el offset entre el click y la esquina del elemento
    this.offsetX = event.clientX - element.getBoundingClientRect().left;
    this.offsetY = event.clientY - element.getBoundingClientRect().top;
  }

  /**
   * Mueve el reproductor mientras se arrastra
   */
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.playerContainer) return;

    const element = this.playerContainer.nativeElement;
    const newX = event.clientX - this.offsetX;
    const newY = event.clientY - this.offsetY;

    // Limitar el movimiento dentro de los límites de la ventana
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;

    this.posX = Math.max(0, Math.min(newX, maxX));
    this.posY = Math.max(0, Math.min(newY, maxY));

    // Actualizar posición del elemento
    element.style.left = this.posX + 'px';
    element.style.bottom = 'auto';
    element.style.right = 'auto';
    element.style.top = this.posY + 'px';
  }

  /**
   * Finaliza el drag
   */
  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
  }
}