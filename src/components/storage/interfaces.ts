export interface IStorageRoot {
    keys:   string[];
    empty:  boolean;
    clear:  () => void;
    data:   <T>(id:string, proxy?:IStorageProxy) => IStorageCollection<T>
}

export interface IStorageCollection<T> {
    keys:       string[];
    empty:      boolean;
    mostRecent: T;
    has:        (id:number) => boolean;
    get:        (id:number) => T;
    update:     (id:number, data:T) => void;
    meta:       (id:number, meta?:any) => any;
    list:       () => IStorageEntityRecord[];
    save:       (data:T) => IStorageEntityRecord;
    remove:     (id:number) => boolean;
    clear:      () => void;
}

export interface IStorageEntityRecord {
    id:         number;
    dataKey:    string;
    meta?:      any;
}

export interface IStorageProxy {
    read:   (data:any, options?:any) => any;
    write:  (data:any, options?:any) => any;
}

export interface IStorageProxyPicker {
    raw:            IStorageProxy;
    json:           IStorageProxy;
    compress:       IStorageProxy;
    compressedJson: IStorageProxy;
}