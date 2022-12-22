import { Injectable } from "@angular/core";
import { HttpHeaders, HttpParams, HttpClient } from "@angular/common/http";

import { catchError, timeout } from "rxjs/operators";
import { of } from "rxjs";

export interface HttpServiceOptions {
  headers?:
  | any
  | HttpHeaders
  | {
    [header: string]: string | string[];
  };

  params?:
  | HttpParams
  | {
    [param: string]: string | string[];
  };
}

@Injectable({
  providedIn: "root",
})
export class HttpService {
  time: number = 45 * 1000;
  constructor(private http: HttpClient) { }

  async get<T>(url: string, options?: HttpServiceOptions): Promise<T | null> {
    if (options) {
      return this.http
        .get<T>(url, {
          ...options,
        })
        .pipe(
          timeout(this.time),
          catchError((e) => {
            return of(e.error);
          })
        )
        .toPromise();
    } else {
      return this.http
        .get<T>(url, {
          responseType: "json",
        })
        .pipe(
          timeout(this.time),
          catchError((e) => {
            return of(e.error);
          })
        )
        .toPromise();
    }
  }

  async post<T>(
    url: string,
    body?: any,
    options?: HttpServiceOptions,
    customTimeoutInMS?: number
  ): Promise<T | null> {

    console.log("POST", { url, body });

    if (options) {
      return this.http
        .post<T>(url, body, {
          ...options,
        })
        .pipe(
          timeout(customTimeoutInMS || this.time),
          catchError((e) => {
            return of(e.error);
          })
        )
        .toPromise();
    } else {
      return this.http
        .post<T>(url, body, {
        })
        .pipe(
          timeout(customTimeoutInMS || this.time),
          catchError((e) => {
            return of(e.error);
          })
        )
        .toPromise();
    }
  }
}
