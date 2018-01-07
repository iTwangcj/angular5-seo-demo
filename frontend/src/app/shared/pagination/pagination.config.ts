import { Injectable } from '@angular/core';

/** Provides default values for Pagination and pager components */
@Injectable()
export class PaginationConfig {
    main: any = {
        maxSize: void 0,
        itemsPerPage: 10,
        boundaryLinks: true,
        directionLinks: true,
        firstText: '&laquo;',
        previousText: '&lsaquo;',
        nextText: '&rsaquo;',
        lastText: '&raquo;',
        pageBtnClass: '',
        rotate: true
    };
}
