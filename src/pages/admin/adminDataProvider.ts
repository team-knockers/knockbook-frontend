import type {
  DataProvider,
  GetListParams, GetListResult,
  GetOneParams, GetOneResult,
  CreateParams, CreateResult,
  UpdateParams, UpdateResult,
  DeleteParams, DeleteResult,
  GetManyParams, GetManyResult,
  GetManyReferenceParams, GetManyReferenceResult,
  UpdateManyParams, UpdateManyResult,
  DeleteManyParams, DeleteManyResult,
} from 'react-admin';
import { BookService } from '../../features/books/services/BookService';
import { ProductService } from '../../features/products/services/ProductService';
import type { RegisterBookRequest, UpdateBookRequest } from '../../features/books/types';
import type { CreateProductRequest, UpdateProductRequest } from '../../features/products/types';
import type { Order } from '../../features/purchase/type';
import { OrderService } from '../../features/purchase/services/OrderService';

export const adminDataProvider: DataProvider = {

  // ---- LIST ----

  async getList(resource: string, params: GetListParams)
  : Promise<GetListResult<any>> {

    const { page, perPage } = params.pagination ?? { page: 1, perPage: 10 };

    if (resource === 'books') {
      const res = await BookService.listBooks(page, perPage);
      return {
        data: res.content.map((b: any) => ({ ...b, id: b.id })),
        total: res.totalElements,
      };
    }

    if (resource === 'products') {
      const res = await ProductService.listProducts(page, perPage);
      return {
        data: res.content.map((p: any) => ({ ...p, id: p.productId })),
        total: res.totalElements,
      };
    }

    if (resource === 'orders') {
      const all: Order[] = await OrderService.getOrders();
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const pageSlice = all.slice(start, end);
      return { data: pageSlice.map(o => ({ ...o, id: o.id })), total: all.length };
    }

    return { data: [], total: 0 };
  },

  // ---- ONE ----

  async getOne(resource: string, params: GetOneParams)
  : Promise<GetOneResult<any>> {
    const { id } = params;

    if (resource === 'books') {
      const b = await BookService.getBookDetails(String(id));
      return { data: { ...b, id: b.id} };
    }

    return { data: { id } };
  },

  // ---- CREATE ----

  async create(resource: string, params: CreateParams)
  : Promise<CreateResult<any>> {

    if (resource === 'books') {
      const req = params.data as RegisterBookRequest;
      const created = await BookService.registerBook(req);
      return { data: { ...created, id: created.id } };
    }

    if (resource === 'products') {
      const req = params.data as CreateProductRequest;
      const created = await ProductService.registerProduct(req);
      return { data: { ...created, id: created.productId } };
    }
    
    return {
      data: { 
        id: crypto.randomUUID?.() ?? Date.now(),
        ...params.data 
      }};
  },

  // ---- UPDATE ----

  async update(resource: string, params: UpdateParams)
  : Promise<UpdateResult<any>> {
    
    if (resource === 'books') {
      const id = String(params.id);
      const req = params.data as UpdateBookRequest;
      const updated = await BookService.updateBook(id, req);
      return { data: { ...updated, id: updated.id } };
    }

    if (resource === 'products') {
      const id = String(params.id);
      const req = params.data as UpdateProductRequest;
      const updated = await ProductService.updateProduct(id, req);
      return { data: { ...updated, id: updated.productId } };
    }


    if (resource === 'orders') {
      // updateStatus(userId, orderId, status, rentalStatus)
      const orderId = String(params.id);
      const userId =
        (params.previousData && (params.previousData as Order).userId) ||
        (params.data as Partial<Order>).userId;

      const status = (params.data as Partial<Order>).status ?? (params.previousData as Order)?.status;
      const rentalStatus =
        (params.data as Partial<Order>).rentalStatus ?? (params.previousData as Order)?.rentalStatus;

      if (!userId) {
        throw new Error('orders.update: userId가 필요합니다.');
      }
      if (!status) {
        throw new Error('orders.update: status가 필요합니다.');
      }
      if (!rentalStatus) {
        throw new Error('orders.update: rentalStatus가 필요합니다.');
      }

      const updated = await OrderService.updateStatus(userId, orderId, status, rentalStatus);
      return { data: { ...updated, id: updated.id } };
    }
    
    return { data: params.data };
  },

  // ---- DELETE (not implemented yet) ----

  async delete(_resource: string, params: DeleteParams)
  : Promise<DeleteResult<any>> {
    return { data: { id: params.id } };
  },

  async getMany(_resource: string, _params: GetManyParams)
  : Promise<GetManyResult<any>> {
    return { data: [] };
  },

  async getManyReference(
    _resource: string,
    _params: GetManyReferenceParams
  ): Promise<GetManyReferenceResult<any>> {
    return { data: [], total: 0 };
  },

  async updateMany(
    _resource: string,
    _params: UpdateManyParams
  ): Promise<UpdateManyResult> {
    return { data: [] };
  },

  async deleteMany(
    _resource: string,
    _params: DeleteManyParams
  ): Promise<DeleteManyResult> {
    return { data: [] };
  },
};

