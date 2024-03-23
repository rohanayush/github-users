import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$: Observable<any[]> = this.usersSubject.asObservable();
  url:string=`https://api.github.com/search/users?q=`
  
  constructor(private http: HttpClient) {}

  searchUsers(query: string): void {
    console.log("called service",query  )
    const url = this.url + `${query}&per_page=50`
    this.http.get(url).subscribe((data: any) => {
      this.usersSubject.next(data.items);
    });
  }

  loadDefaultUsers(): void {
    // Fetch trending repositories from GitHub
    this.http.get<any[]>('https://api.github.com/search/repositories?q=created:>2022-01-01&sort=stars&order=desc&per_page=50')
      .pipe(
        map( (data:any) => data.items.map((item: { owner: any; }) => item.owner)) // Extract users from repositories
      )
      .subscribe((users: any[]) => {
        this.usersSubject.next(users);
      });
  }
}
