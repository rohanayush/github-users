// search.component.ts
import { Component, OnDestroy } from '@angular/core';
import { Subject, Subscription, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnDestroy {
  searchTerm: string = '';
  private unsubscribe$ = new Subject<void>();
  private search$ = new Subject<string>();

  constructor(private githubService: GithubService) {
    this.loadDefaultUsers()
    this.initSearch();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private initSearch(): void {
    this.search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((term: string) => {
        if (term.length > 0 && term.trim() !== '') {
          this.githubService.searchUsers(term);
        } 
        else this.loadDefaultUsers();
      });
  }

  private loadDefaultUsers(): void {
    // Call a method in GithubService to load default users
    this.githubService.loadDefaultUsers();
  }

  onSearchChange(): void {
    this.search$.next(this.searchTerm);
  }
}
