import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-favoritos',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './favoritos.html',
})
export class FavoritosComponent {
    title = 'Favoritos';
}