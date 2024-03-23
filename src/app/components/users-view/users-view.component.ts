import { Component } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { Observable } from 'rxjs';
import { GithubUser } from '../../model/github-users-model';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrl: './users-view.component.scss',
})
export class UsersViewComponent {
  users: Observable<GithubUser[]> | undefined;
  constructor(private githubService: GithubService) {}

  ngOnInit() {
    this.users = this.githubService.users$;
  }
}
