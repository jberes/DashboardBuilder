import { APP_INITIALIZER, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// import { BuilderComponent } from './builder/builder.component';
import { IGX_LIST_DIRECTIVES, IgxAvatarComponent, IgxIconComponent } from 'igniteui-angular';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IGX_LIST_DIRECTIVES, IgxAvatarComponent, IgxIconComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [{provide: APP_INITIALIZER, 
                useFactory: initializeRevealSdk(),
                multi: true}]
})

export class AppComponent {
  title = 'Reveal Dashboard Builder';  
}

// Reveal: Add the following code to src/app/app.component.ts:
  declare let $: any; 
  export function initializeRevealSdk() {
    $.ig.RevealSdkSettings.setBaseUrl(`${environment.BASE_URL}`);
    const style = window.getComputedStyle(document.body);
    const theme = new $.ig.RevealTheme();
    theme.regularFont = style.getPropertyValue('--ig-font-family').replace(/\s/g, '+') ?? 'sans-serif';
    theme.mediumFont = theme.regularFont;
    theme.boldFont = theme.regularFont;
    theme.fontColor = style.getPropertyValue('--ig-surface-500-contrast');
    theme.isDark = theme.fontColor !== 'black';
    theme.dashboardBackgroundColor = `hsl(${style.getPropertyValue('--ig-gray-100')})`;
    theme.visualizationBackgroundColor = `hsl(${style.getPropertyValue('--ig-surface-500')})`;
    theme.useRoundedCorners = false;

    $.ig.RevealSdkSettings.enableBetaFeatures = true;
    $.ig.RevealSdkSettings.enableActionsOnHoverTooltip = true;
    $.ig.RevealSdkSettings.theme = theme;

    return () => {};
  };