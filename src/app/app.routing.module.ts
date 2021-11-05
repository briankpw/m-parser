import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';
import { GoogleComponent } from './google/google.component';
import { WechatComponent } from './wechat/wechat.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'google',
        component: GoogleComponent,
        data: { preload: true },
      },
      {
        path: 'wechat',
        component: WechatComponent,
        data: { preload: true },
      },
      { path: '**', redirectTo: '/google', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      // useHash: true,
      // preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
