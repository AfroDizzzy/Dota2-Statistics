import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlayerDetailsComponent} from './player-details/player-details.component';
import { HomeMessageComponent } from './home-message/home-message.component';

const routes: Routes = [
  { path: 'player-details/:id', component: PlayerDetailsComponent },
  { path: 'player-details', component: PlayerDetailsComponent },
  { path: 'home-message', component: HomeMessageComponent },
  { path: '',   redirectTo: 'home-message', pathMatch: 'full' },
  { path: '**', component: HomeMessageComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

