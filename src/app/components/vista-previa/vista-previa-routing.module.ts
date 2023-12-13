import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaPreviaComponent } from './pages/vista-previa.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: '', component: VistaPreviaComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VistaPreviaRoutingModule { }
