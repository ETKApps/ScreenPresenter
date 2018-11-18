import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ScreenComponent } from './screen/screen.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'screen', component: ScreenComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { useHash: true }
    ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
