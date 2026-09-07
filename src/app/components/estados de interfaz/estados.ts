import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

export type EstadoVista =
  | 'loading'
  | 'error'
  | 'empty'
  | 'not-found';

@Component({
  selector: 'app-estados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './estados.html',
  styleUrl: './estados.css'
})
export class EstadosComponent {
  @Input() estado: EstadoVista = 'not-found';
  @Input() mensaje = '';
  @Input() mostrarReintentar = false;
  @Input() mostrarVolver = true;

  @Output() reintentar = new EventEmitter<void>();
}