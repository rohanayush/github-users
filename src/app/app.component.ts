import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GithubService } from './services/github.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'github-users-app';
  searchedTerm: Observable<string> | undefined;
  countResults: Observable<number> | undefined;
  error: Observable<string> | undefined;

  constructor(private githubService: GithubService) {}

  ngOnInit() {
    this.searchedTerm = this.githubService.searchTerm$;
    this.countResults = this.githubService.countResult$;
    this.error = this.githubService.error$;
    
  }
}
