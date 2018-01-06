import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({ selector: '[touch]' })
export class TouchDirective {

    @Output() public touch = new EventEmitter<string>();

    private touchStartX;
    private touchStartY;

    @HostListener('touchstart', ['$event'])
    public onTouchStart (e) {
        this.touchStartX = e.changedTouches[0].clientX;
        this.touchStartY = e.changedTouches[0].clientY;
    }

    @HostListener('touchend', ['$event'])
    public onTouchEnd (e) {
        const changedTouches = e.changedTouches[0];
        const moveX = changedTouches.clientX - this.touchStartX;
        const moveY = changedTouches.clientY - this.touchStartY;
        /**
         * Y轴移动小于X轴 判定为横向滑动
         */
        if (Math.abs(moveY) < Math.abs(moveX)) {
            if (moveX > 50) {
                this.touch.emit('right');
            } else if (moveX < -50) {
                this.touch.emit('left');
            }
        }
        /**
         * Y轴移动大于X轴 判定为纵向滑动
         */
        if (Math.abs(moveY) > Math.abs(moveX)) {
            if (moveY > 50) {
                this.touch.emit('down');
            } else if (moveY < -50) {
                this.touch.emit('up');
            }
        }
        this.touchStartX = this.touchStartY = -1;
    }
}
