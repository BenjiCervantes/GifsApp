import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.service';
import { GifListComponent } from "../../components/gif-list/gif-list.component";

@Component({
  selector: 'gif-history-page',
  imports: [GifListComponent],
  templateUrl: './gif-history-page.component.html'
})
export default class GifHistoryPageComponent {
  gifService = inject(GifService);

  query = toSignal(inject(ActivatedRoute).params.pipe(map(params => params['query'])));
  gifsByKey = computed( () => this.gifService.getHistoryGifs(this.query()));
 }
