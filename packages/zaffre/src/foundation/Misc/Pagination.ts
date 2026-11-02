import { atom } from "../Atom";
import { zutil } from "../Util";

export type PaginationType = "cursor" | "offset";
export type PaginationCursorType = string | number;

export abstract class Pagination {
  static defaultPageSize = 20;

  totalCount = atom(0);
  page = atom(1);
  pageSize = atom(0);
  filter = "";

  constructor(
    pageSize = Pagination.defaultPageSize,
    public sortColumn = "",
    public sortDirection = "",
  ) {
    this.pageSize.set(pageSize);
  }
  abstract appendToURL(url: string): string;
  abstract setResult(totalCount: number, cursor: PaginationCursorType): void;
  abstract nextPage(): boolean;
  abstract previousPage(): boolean;
  abstract reset(): void;
  abstract nextDisabled(): boolean;
  abstract previousDisabled(): boolean;

  incrementTotalCount(): void {
    this.totalCount.set(this.totalCount.get() + 1);
  }
  decrementTotalCount(): void {
    this.totalCount.set(this.totalCount.get() - 1);
  }

  decrementPage(): void {
    this.setPage(this.page.get() - 1);
  }
  incrementPage(): void {
    this.setPage(this.page.get() + 1);
  }
  get numberOfPages(): number {
    return Math.floor((this.totalCount.get() + this.pageSize.get() - 1) / this.pageSize.get());
  }
  get firstIndex(): number {
    return this.totalCount.get() === 0 ? 0 : (this.page.get() - 1) * this.pageSize.get() + 1;
  }
  get lastIndex(): number {
    return Math.min(this.firstIndex + this.pageSize.get() - 1, this.totalCount.get());
  }
  setPage(page: number): void {
    this.page.set(zutil.clamp(page, 1, this.totalCount.get()));
  }
}

export class CursorPagination extends Pagination {
  constructor(
    pageSize: number,
    public cursor: PaginationCursorType,
  ) {
    super(pageSize);
  }
  appendToURL(url: string): string {
    const u = new URL(url);
    u.searchParams.append("cursor", this.cursor.toString());
    u.searchParams.append("pageSize", this.pageSize.toString());
    this.sortColumn && u.searchParams.append("sortColumn", this.sortColumn);
    this.sortDirection && u.searchParams.append("sortDirection", this.sortDirection);
    this.filter && u.searchParams.append("filter", this.filter);
    return u.toString();
  }
  nextDisabled(): boolean {
    return false;
  }
  previousDisabled(): boolean {
    // TODO
    return false;
  }
  nextPage(): boolean {
    this.incrementPage();
    return true;
  }
  previousPage(): boolean {
    this.decrementPage();
    // TODO
    return false;
  }
  reset(): void {
    this.cursor = 0;
  }
  setResult(totalCount: number, cursor: PaginationCursorType) {
    this.totalCount.set(totalCount);
    this.cursor = cursor;
  }
}
export class OffsetPagination extends Pagination {
  constructor(pageSize: number, startingPage = 1, sortColumn = "", sortDirection = "") {
    super(pageSize, sortColumn, sortDirection);
    this.setPage(startingPage);
  }
  appendToURL(url: string): string {
    const u = new URL(url);
    u.searchParams.append("page", this.page.get().toString());
    u.searchParams.append("pageSize", this.pageSize.get().toString());
    this.sortColumn && u.searchParams.append("sortColumn", this.sortColumn);
    this.sortDirection && u.searchParams.append("sortDirection", this.sortDirection);
    this.filter && u.searchParams.append("filter", this.filter);
    return u.toString();
  }
  setResult(totalCount: number, cursor: PaginationCursorType) {
    this.totalCount.set(totalCount);
  }
  nextDisabled(): boolean {
    return this.page.get() >= this.numberOfPages;
  }
  previousDisabled(): boolean {
    return this.page.get() <= 1;
  }
  nextPage(): boolean {
    const hasNextPage = !this.nextDisabled();
    if (hasNextPage) {
      this.incrementPage();
    }
    return hasNextPage;
  }
  previousPage(): boolean {
    const hasPreviousPage = !this.previousDisabled();
    if (hasPreviousPage) {
      this.decrementPage();
    }
    return hasPreviousPage;
  }
  reset(): void {
    this.setPage(1);
  }
}

export const cursorPagination = (cursor: number | string, pageSize = Pagination.defaultPageSize): CursorPagination => {
  return new CursorPagination(pageSize, cursor);
};

export const offsetPagination = (
  page = 1,
  pageSize = Pagination.defaultPageSize,
  sortColumn = "",
  sortDirection = "",
): OffsetPagination => {
  return new OffsetPagination(pageSize, page, sortColumn, sortDirection);
};

export const nullOffsetPagination = () => {
  return offsetPagination(1, Number.MAX_SAFE_INTEGER);
};
