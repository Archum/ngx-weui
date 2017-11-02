import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Uploader } from './uploader.class';
import * as sinon from 'sinon';

describe('Uploader: Class', () => {
    let instance: Uploader = null;
    let xhr: any, requests: any[];

    function addFiles(count: number = 1, ext: string = 'png') {
        for (let i = 0; i < count; i++) {
            const textFileAsBlob = new Blob(['a' + i], { type: 'text/plain' });
            const f = new File([textFileAsBlob], `${i + 1}.${ext}`);
            instance.addToQueue([f]);
        }
    }

    beforeEach(() => {
        instance = null;
        instance = new Uploader();
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    afterEach(() => {
        xhr.restore();
    });

    it('#setOptions should be set alias,auto,size,limit', () => {
        const args = {
            alias: 'image',
            auto: true,
            size: 10,
            limit: 10
        };
        instance.setOptions(args);
        // tslint:disable-next-line:forin
        for (const k in args) {
            expect(instance.options[k]).toBe(args[k], `参数${k}值应该是：${args[k]}`);
        }
    });

    xit('#addToQueue should be return 1', () => {
        addFiles(1, 'png');
        expect(instance.queue.length).toBe(1);
        expect(instance.queue[0].file.name).toBe('1.png');
    });

    xit('#removeFromQueue should be return 1', () => {
        addFiles(2, 'png');
        expect(instance.queue.length).toBe(2);
        instance.removeFromQueue(instance.queue[0]);
        expect(instance.queue.length).toBe(1);
    });

    xit('#clearQueue should be return 0', () => {
        addFiles(1, 'png');
        expect(instance.queue.length).toBe(1);
        instance.clearQueue();
        expect(instance.queue.length).toBe(0);
    });

    xit('#uploadItem should be isUploading=true', () => {
        addFiles(1, 'png');
        expect(instance.isUploading).toBe(false);
        instance.uploadItem(instance.queue[0]);
        expect(instance.isUploading).toBe(true);
    });

    xit('#cancelItem should be', fakeAsync(() => {
        addFiles(1, 'png');
        instance.uploadItem(instance.queue[0]);
        instance.cancelItem(instance.queue[0]);
        tick(100);
        expect(instance.queue[0].isCancel).toBe(true);
    }));

});
