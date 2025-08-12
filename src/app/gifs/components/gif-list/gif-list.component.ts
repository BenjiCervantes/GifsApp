import { Component, input } from '@angular/core';
import { GifListItemComponent } from "../gif-list-item/gif-list-item.component";
import { Gif } from '../../interfaces/gif.intergace';

@Component({
  selector: 'gifs-gif-list',
  imports: [GifListItemComponent],
  templateUrl: './gif-list.component.html'
})
export class GifListComponent {
  gifs = input.required<Gif[]>();

}
