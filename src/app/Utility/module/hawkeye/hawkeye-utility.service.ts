import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HawkeyeService } from 'src/app/core/service/hawkeye/hawkeye.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class HawkeyeUtilityService {

  constructor(
    private hawkeye: HawkeyeService,
    private storage: StorageService,
  ) { }
  async pushToCTCommon(data){
    const { res } = await firstValueFrom(this.hawkeye.hawkeyePost("hawkeye/pushToCTCommon", data));
    return res;
  }
}
