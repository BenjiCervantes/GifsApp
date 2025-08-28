import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";

import { environment } from "@environments/environment";
import { Gif } from "../interfaces/gif.interface";
import { GifMapper } from "../mapper/gif.mapper";

import type { GiphyResponse } from "../interfaces/giphy.interfaces";

const loadFromLocalStorage = () : Record<string, Gif[]> => {
  const history = localStorage.getItem('searchHistory');
  return history ? JSON.parse(history) : {};
}

@Injectable({
  providedIn:'root'
})
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

  constructor(){
    this.loadTrendingGifs();
  }

  loadTrendingGifs(){
    this.http.get<GiphyResponse>(`${ environment.giphyUrl }/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20
      }
    }).subscribe( (resp) =>{
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
    });
  }

  searchGifs = ( query : string ) : Observable<Gif[]> => {
    return this.http.get<GiphyResponse>(`${ environment.giphyUrl}/gifs/search`,
      {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          q: query
        }
      }
    ).pipe(
      map(({data}) => data ),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      tap(items => {
        this.searchHistory.update( history => ({
          [query.toLowerCase()] : items,
          ...history
        }));

      })
    );
  }

  getHistoryGifs = ( query : string) : Gif[] => {
    return this.searchHistory()[query] ?? [];
  }

  saveToLocalStorage = effect( () => {
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory()));
  });
}
