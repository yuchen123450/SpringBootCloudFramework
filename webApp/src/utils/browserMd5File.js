import CryptoJS from 'crypto-js';

/* 分段读取文件 */
const readBinaryChunked = (file, chunkCallback, endCallback) => {
    const fileSize = file.size;
    const chunkSize = 4 * 1024 * 1024; // 4MB
    let offset = 0;

    const reader = new FileReader();

    function readNext() {
        const fileSlice = file.slice(offset, offset + chunkSize);
        reader.readAsArrayBuffer(fileSlice);
    }

    reader.onload = () => {
        if (reader.error) {
            endCallback(reader.error || {});
            return;
        }
        offset += reader.result.byteLength;
        try {
            chunkCallback(reader.result, offset, fileSize);
        } catch (err) {
            endCallback(err);
            return;
        }
        if (offset >= fileSize) {
            endCallback(null);
            return;
        }
        readNext();
    };

    reader.onerror = (err) => {
        endCallback(err || {});
    };
    readNext();
};

/* 调用 CryptoJS 计算 MD5, cbProgress 用于控制进度条*/
export const getFileMD5 = (blob, cbProgress) =>
    new Promise((resolve, reject) => {
        const md5 = CryptoJS.algo.MD5.create();
        readBinaryChunked(
            blob,
            (chunk, offs, total) => {
                md5.update(CryptoJS.lib.WordArray.create(chunk));
                if (cbProgress) {
                    cbProgress(offs / total);
                }
            },
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    const digest = md5.finalize();
                    resolve(digest.toString());
                }
            }
        );
    });
