import { Component, OnInit } from '@angular/core';
import { SpinService } from './spin.service';

/**
 * 旋转组件
 */
@Component({
    selector: 'spin',
    template: `
        <div class="spin-container" *ngIf="showSpin">
            <div>
                <p class="msg">正在载入...</p>
            </div>
        </div>
    `,
    styleUrls: ['./spin.component.less']
})
export class SpinComponent implements OnInit {

    // 标识
    showSpin: boolean = false;

    // 数量
    count: number = 0;

    constructor (private spinService: SpinService) {}

    ngOnInit () {
        this.spinService.spinSub.subscribe((showSpin: boolean) => {
            if (showSpin) {
                this.openSpin();
            } else {
                this.closeSpin();
            }
        });
    }

    /**
     * 打开
     */
    private openSpin () {
        if (!this.showSpin) {
            this.showSpin = true;
        }
        this.count++;
    }

    /**
     * 关闭
     */
    private closeSpin () {
        this.count--;
        if (this.count <= 0) {
            this.showSpin = false;
            this.count = 0;
        }
    }
}
