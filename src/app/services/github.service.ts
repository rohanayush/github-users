import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private usersSubject = new BehaviorSubject<any[]>([]);
  private searchedTermSubject = new BehaviorSubject<string>('');
  private countResultSubject = new BehaviorSubject<number>(0);
  private errorSubject = new BehaviorSubject<string>("");
  private destroy$: Subject<void> = new Subject<void>();

  users$: Observable<any[]> = this.usersSubject.asObservable();
  searchTerm$: Observable<string> = this.searchedTermSubject.asObservable();
  countResult$: Observable<number> = this.countResultSubject.asObservable();
  error$: Observable<string> = this.errorSubject.asObservable();
  url: string = `https://api.github.com/search/users?q=`;

  constructor(private http: HttpClient) {}

  searchUsers(query: string): void {
    console.log('called service', query);
    this.searchedTermSubject.next(query);
    const url = this.url + `${query}&per_page=50`;
    this.http
      .get<any>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.usersSubject.next(data.items);
          this.countResultSubject.next(Number(data.total_count));
          this.errorSubject.next("");
        },
        error: (error) => {
          this.errorSubject.next(error.message);
          console.error('Error searching users:', error);
        },
        complete: () => {
          console.log('Search completed');
        }
      });
  }

 
  loadDefaultUsers(): void {
    const url =
      'https://api.github.com/search/repositories?q=created:>2022-01-01&sort=stars&order=desc&per_page=50';
    this.http
      .get<any[]>(url)
      .pipe(
        map((data: any) => data.items.map((item: { owner: any }) => item.owner)),
        takeUntil(this.destroy$) 
      )
      .subscribe({
        next: (users: any[]) => {
          this.usersSubject.next(users);
          this.errorSubject.next("");
          this.countResultSubject.next(Number(1));


        },
        error: (error) => {
          console.error('Error fetching users:', error);
          this.errorSubject.next(error.message);
        },
        complete: () => {
          console.log('Fetching users completed');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
