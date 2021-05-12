import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {InteractionType, IPublicClientApplication, PublicClientApplication} from '@azure/msal-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PublicPageComponent} from './public-page/public-page.component';
import {RestrictedPageComponent} from './restricted-page/restricted-page.component';
import {
  MsalInterceptor,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalInterceptorConfiguration,
  MSAL_INTERCEPTOR_CONFIG
} from '@azure/msal-angular';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: process.env.appId,
      redirectUri: process.env.redirectUri
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  const scopes = process.env.scopes.split(',');

  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', scopes);
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/users', scopes);
  protectedResourceMap.set('http://localhost:8000/api/v1.0', ['api://17b39df8-f88c-4c65-9fc0-50e1b1bc3f39/api']);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap
  };
}

@NgModule({
  declarations: [
    AppComponent,
    PublicPageComponent,
    RestrictedPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsalModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }, {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    }, {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
