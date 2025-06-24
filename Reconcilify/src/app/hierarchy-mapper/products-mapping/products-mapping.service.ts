import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IExtendedFilterPageDTO,
  IItemDataFilterDTO,
  IItemDto,
  IItemFilterDTO,
  IProduct,
  IProductFilters,
  IProductRequestParams,
} from './models/products-mapping-table.interface';
import { environment } from '../../../environments/environment';
import { ProductsMappingStatusEnum } from './models/products-mapping-status.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductsMappingService {
  apiUrl = environment.apiUrl + '/api/ghm/';

  constructor(private readonly httpClient: HttpClient) {}

  getTableData(
    params: Partial<IProductRequestParams> & Partial<IProductFilters>
  ): Observable<{ items: IItemDto[]; filter: Partial<IItemFilterDTO> }> {
    const body: Partial<IItemFilterDTO> = this.buildFiltersBody(params);

    return this.httpClient.post<{ items: IItemDto[]; filter: IItemFilterDTO }>(
      this.apiUrl + 'items',
      { ...body }
    );
  }

  globalSearch(globalSearchTerm: string, pageSize: number, pageNumber: number): Observable<{ items: IItemDto[]; pagination: Partial<IExtendedFilterPageDTO> }> {
    return this.httpClient.get<{ items: IItemDto[]; pagination: Partial<IExtendedFilterPageDTO> }>(
      this.apiUrl + 'items/global-search', {params: {globalSearchTerm: globalSearchTerm, pageSize: pageSize, pageNumber: pageNumber}}
    );
  }

  getFilters(): Observable<IItemDataFilterDTO> {
    return this.httpClient.get<IItemDataFilterDTO>(
      this.apiUrl + 'items/filters'
    );
  }

  saveChanges(product: Partial<IProduct>): Observable<IItemDto> {
    const body: {
      proposedCategoryCode: string;
      proposedGroupCode: string;
      proposedSubgroupCode: string;
      proposedCategoryName: string;
      proposedGroupName: string;
      proposedSubgroupName: string;
      comment: string;
    } = {
      proposedCategoryCode: product.proposedCategoryName?.code ?? '',
      proposedGroupCode: product.proposedGroupName?.code ?? '',
      proposedSubgroupCode: product.proposedSubgroupName?.code ?? '',
      comment: product.comment ?? '',
      proposedCategoryName: product.proposedCategoryName?.name ?? '',
      proposedGroupName: product.proposedGroupName?.name ?? '',
      proposedSubgroupName: product.proposedSubgroupName?.name ?? '',
    };

    return this.httpClient.patch<IItemDto>(
      this.apiUrl + `items/${product.id}`,
      { ...body }
    );
  }

  selectAll(
    params: Partial<IProductRequestParams> & Partial<IProductFilters>
  ): Observable<number[]> {
    const body: Partial<IItemFilterDTO> = {
      ...this.buildFiltersBody(params)
    };

    const hasNonFalsyValue = (obj: Partial<IItemFilterDTO>): boolean => {
      return Object.values(obj).some((value) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return Boolean(value);
      });
    };

    const hasValue = hasNonFalsyValue(body);

    return this.httpClient.post<number[]>(
      this.apiUrl + 'items/select-all',
      hasValue ? { ...body } : null
    );
  }

  exportTableData(
    params: Partial<IProductRequestParams> & Partial<IProductFilters>,
    selectedItems: Partial<IProduct>[] | null = null
  ): Observable<HttpResponse<object>> {
    const body: Partial<IItemFilterDTO> = this.buildFiltersBody(params);

    return this.httpClient.post<Blob>(
      this.apiUrl + 'items/export',
      {
        filters: { ...body },
        selectedItemIds: selectedItems?.map((item) => item.id),
      },
      {
        observe: 'response',
        responseType: 'blob' as 'json',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  buildFiltersBody(
    params: Partial<IProductRequestParams> & Partial<IProductFilters>
  ): Partial<IItemFilterDTO> {
    return {
      id: '',
      sourceSystemDesc: params.selectedSourceSystems?.length ? params.selectedSourceSystems : null,
      itemCode: params.itemCode,
      itemName: params.itemName,
      globalCategoryName: params.globalCategoryName,
      globalCategoryCode: params.globalCategoryCode,
      globalGroupName: params.globalGroupName,
      globalGroupCode: params.globalGroupCode,
      globalSubgroupName: params.globalSubgroupName,
      globalSubgroupCode: params.globalSubgroupCode,
      proposedCategoryName: params.proposedCategoryName,
      proposedCategoryCode: params.proposedCategoryCode,
      proposedGroupName: params.proposedGroupName,
      proposedGroupCode: params.proposedGroupCode,
      proposedSubgroupName: params.proposedSubgroupName,
      proposedSubgroupCode: params.proposedSubgroupCode,
      localSubgroupName: params.localSubgroupName,
      localSubgroupCode: params.localSubgroupCode,
      localCategoryName: params.localCategoryName,
      localCategoryCode: params.localCategoryCode,
      localGroupName: params.localGroupName,
      localGroupCode: params.localGroupCode,
      invalidityReasonMessage: params.invalidityReasonMessage,
      invalidityReasonTypes: params.invalidityReasonTypes,
      comment: params.comment,
      globalSearchTerm: params.globalSearchInput,
      fieldToSort: params.fieldToSort ?? '',
      sortDirection: params.sortDirection ?? '',
      retrievedOn: params.retrievedOn?.slice(0, 10),
      validationStatus: this.determineValidationStatus(params.selectedStatus),
      lastUpdatedAt: params.lastUpdatedAt?.slice(0, 10),
      lastUpdatedBy: params.lastUpdatedBy ?? null,
      extendedFilterPageDTO: {
        pageSize: params.pageSize,
        pageNumber: params.pageNumber,
      },
    };
  }

  determineValidationStatus(selectedStatus: string[] | undefined | null): ProductsMappingStatusEnum[] | null {
    if (selectedStatus?.includes(ProductsMappingStatusEnum[-1])) return null;
    return selectedStatus?.length
      ? selectedStatus.map(
        (status) => ProductsMappingStatusEnum[status as keyof typeof ProductsMappingStatusEnum]
      )
      : null;
  }
}
