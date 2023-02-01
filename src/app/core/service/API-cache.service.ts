import { Injectable } from "@angular/core";
import { AbstractCacheService } from "./cache.service";

@Injectable({
  providedIn: "root",
})
export class APICacheService extends AbstractCacheService<any> {}
