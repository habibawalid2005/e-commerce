import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);
  getAllProducts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products`);
  }
  getSpecificProduct(productId: string | null): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/${productId}`);
  }

  getAllProductsWithFilters(filters: any = {}, pageNum: number = 1): Observable<any> {
    let params = new HttpParams().set('page', pageNum.toString());
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products`, { params });
  }

  getProductsOnSearch(params: any, pageNum: number = 1, limit: number = 12): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products`, {
      params: {
        ...params,
        page: pageNum,
        limit: limit,
      },
    });
  }
}
