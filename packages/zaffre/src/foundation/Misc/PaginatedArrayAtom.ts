import { offsetPagination, OffsetPagination, Pagination } from "./Pagination";
import { Atom, atom, ArrayAtom, ArrayAtomOptions } from "../Atom";

export interface PaginatedArrayAtomOptions<T> extends ArrayAtomOptions<T> {
  pagination?: Pagination;
  pageFn?: PaginationQuery<T>;
}

export type PaginationQuery<T> = (list: PaginatedArrayAtom<T>) => Promise<void>;

export class PaginatedArrayAtom<T> extends ArrayAtom<T> {
  static defaultPageSize = 20;
  range: Atom<string>;

  constructor(public options: PaginatedArrayAtomOptions<T>) {
    super([], options);
    // if paginated, get the first page
    this.load();
    this.range = atom(
      () => `${this.pagination.firstIndex}-${this.pagination.lastIndex} of ${this.pagination.totalCount.get()}`,
    );
  }

  load(): void {
    if (this.options.pageFn) {
      this.options.pageFn(this);
      //this.updateRangeText();
    }
  }
  setResult(list: T[], total: number, cursor: number): void {
    this.set(list);
    if (this.options.pagination) {
      this.options.pagination.setResult(total, cursor);
      //this.updateRangeText();
    }
  }

  delete(value: T): void {
    super.delete(value);
    this.options.pagination?.decrementTotalCount();
  }
  deleteIndex(index: number): void {
    super.deleteIndex(index);
    this.options.pagination?.decrementTotalCount();
  }

  get pagination(): Pagination {
    return this.options.pagination ? this.options.pagination : offsetPagination(1, Number.MAX_SAFE_INTEGER);
  }
  isPaginated(): boolean {
    return this.pagination.pageSize.get() < Number.MAX_SAFE_INTEGER;
  }
  setPageSize(sz: number): void {
    this.pagination.pageSize.set(sz);
    this.load();
  }

  // range = atom("");
  // updateRangeText(): void {
  //   this.range.set(`${this.pagination.firstIndex}-${this.pagination.lastIndex} of ${this.pagination.totalCount.get()}`);
  // }

  async setPage(page: number) {
    if (this.pagination instanceof OffsetPagination) {
      this.pagination.setPage(page);
      this.load();
    }
  }
  firstPageDisabled(): boolean {
    return this.pagination.page.get() <= 1;
  }
  nextDisabled(): boolean {
    return this.pagination.nextDisabled();
  }
  previousDisabled(): boolean {
    return this.pagination.previousDisabled();
  }
  nextPage(): void {
    if (this.pagination.nextPage()) {
      this.load();
    }
  }

  previousPage(): void {
    if (this.pagination.previousPage()) {
      this.load();
    }
  }
  firstPage(): void {
    this.setPage(1);
  }
  get pageSize(): number {
    return this.pagination.pageSize.get();
  }
  get totalCount(): number {
    return this.pagination.totalCount.get();
  }
  get numberOfPages(): number {
    return this.pagination.numberOfPages;
  }

  sortWith(compareFn: (a: T, b: T) => number, sortField: string, sortDirection: string): void {
    this.pagination.sortColumn = sortField;
    this.pagination.sortDirection = sortDirection;
    this.setPage(1);
  }

  clear(): void {
    super.clear();
    this.pagination.reset();
    //this.updateRangeText();
  }
}
