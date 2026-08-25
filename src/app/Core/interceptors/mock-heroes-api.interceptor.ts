import { HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { delay, of } from "rxjs";



const API_PPREFIX = '/api/heroes';

export const mosckHeroesApiInterceptor: HttpInterceptorFn = (req,  next) => {
    if (!req.url.startsWith(API_PPREFIX)) {
        return next(req);
    }

    return of(new HttpResponse({ status: 200, body: null })).pipe(delay(800))
}