import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalStateService } from 'src/app/services/globalServices/global-state.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const globalStateService = inject(GlobalStateService);
  const router = inject(Router);

  const user = await firstValueFrom(globalStateService.user$);

  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
