import { HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { delay, of } from "rxjs";



const API_PREFIX = '/api/heroes';

export const mockHeroesApiInterceptor: HttpInterceptorFn = (req, next) => {
    if (!req.url.startsWith(API_PREFIX)) {
        return next(req);
    }

    return of(new HttpResponse({ status: 200, body: null })).pipe(delay(800))
}