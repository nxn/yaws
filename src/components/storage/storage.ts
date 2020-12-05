import type { 
    IStorageRoot, 
    IStorageCollection, 
    IStorageEntityRecord, 
    IStorageProxy, 
    IStorageProxyPicker
} from '@components/contracts/storageprovider';

import { encodeBytes as encode, decodeBytes as decode } from '@lib/base32k/base32k';

import { 
    deflateRaw as compress,
    inflateRaw as expand,
    DeflateFunctionOptions as compressOptions,
    InflateFunctionOptions as expandOptions
} from '@lib/pako/pako';

type TStorageIndex = { [key:string] : IStorageEntityRecord };

//#region Proxies
const rawProxy = { read: (d:any) => d, write: (d:any) => d };

const compressionProxy = {
    read: function(data: any, options?: expandOptions) {
        if (data === null) {
            return null;
        }

        if (data === undefined) {
            return undefined;
        }
        return expand(decode(data), options);
    },
    write: function(data: any, options?: compressOptions) {
        if (data === null) {
            return null;
        }

        if (data === undefined) {
            return undefined;
        }

        if (typeof options !== 'object') {
            options = { level: 9 };
        }

        return encode(compress(data, options));
    }
};

const jsonProxy = {
    read: (d:any) => d === undefined ? undefined: JSON.parse(d),
    write: JSON.stringify
};

const compressedJsonProxy = {
    read: (d:any) => jsonProxy.read(compressionProxy.read(d, { to: 'string' })),
    write: (d:any) => compressionProxy.write(jsonProxy.write(d))
};

// The default proxy behavior serializes data to JSON, compresses it with pako/zlib's deflate algorithm, and finally
// base32k encodes it before returning it for storage. This procedure minimizes the overhead involved with storing data
// as UTF-16 strings.
const defaultProxy = compressedJsonProxy;

export const proxies: IStorageProxyPicker = Object.create(null,
    { raw:            { value: rawProxy }
    , json:           { value: jsonProxy }
    , compress:       { value: compressionProxy }
    , compressedJson: { value: compressedJsonProxy }
    }
);
Object.freeze(proxies);
//#endregion

// const manager = storage(appName).data(catalogId);
// const manager = storage(appName, proxy).data(catalogId, proxy);
const namespaces: Map<string, IStorageRoot> = new Map();

export function storage(appName:string, proxy?:IStorageProxy) : IStorageRoot {
    let ns = namespaces.get(appName);

    if (ns === undefined) {
        ns = createNamespaceObject(appName, proxy);
        namespaces.set(appName, ns);
    }
    
    return ns;
}
export { storage as default };

function createNamespaceObject(appName:string, nsProxy?:IStorageProxy) : IStorageRoot {
    const managers:Map<string, IStorageCollection<any>> = new Map();

    const keys  = () => Object.keys(localStorage).filter(k => k.startsWith(appName));
    const empty = () => keys().length === 0;
    const clear = () => keys().forEach(k => localStorage.removeItem(k));

    const data = (id:string, dmProxy?:IStorageProxy) => {
        let dm = managers.get(id);

        if (dm === undefined) {
            // The Read/Write data proxy object should only be bound to a data manager when it is being created. The 
            // proxy should be selected in the following order of priority:
            //      1) Was supplied to the 'data' function
            //          - In the event that this specific data collection requires unique read/write logic.
            //      2) Was supplied to the 'namespace' function
            //          - In the event the app requires its own read/write logic.
            //      3) Is the default proxy
            const isValid = (p:IStorageProxy) => 
                typeof p === 'object' &&
                typeof p['read']  === 'function' &&
                typeof p['write'] === 'function';

            let proxy = defaultProxy;

            if (isValid(dmProxy)) {
                proxy = dmProxy;
            }
            else if (isValid(nsProxy)) {
                proxy = nsProxy;
            }
            
            dm = createDataManager(appName, id, proxy);
            managers.set(id, dm);
        }

        return dm
    };

    return Object.create(null,
        { keys:  { get:   keys }
        , empty: { get:   empty }
        , clear: { value: clear }
        , data:  { value: data }
        }
    );
}

function createDataManager<T>(appName:string, indexId:string, proxy:IStorageProxy): IStorageCollection<T> {
    const indexKey = `${appName}:index:${indexId}`;
    const dataKey  = (id:number) => `${appName}:data:${id}`;

    const getIndex : () => TStorageIndex = 
        () => compressedJsonProxy.read(localStorage.getItem(indexKey)) || Object.create(null);

    const setIndex = (index: TStorageIndex) =>
        localStorage.setItem(indexKey, compressedJsonProxy.write(index));

    const keys       = () => Object.keys(getIndex());
    const clear      = () => keys().forEach(k => remove(parseInt(k)));
    const empty      = () => keys().length === 0;
    const has        = (id:number) => getIndex()[id] !== undefined;
    const get        = (id:number) => proxy.read(localStorage.getItem(dataKey(id)));
    const mostRecent = () => get(Math.max(...keys().map(parseInt)));
    const list:(() => IStorageEntityRecord[]) = () => {
        const index = getIndex();
        return Object.keys(index).map(k => index[k]);
    };

    // Only update if a property with the given id already exists.
    // New entries should be added via 'save' instead.
    const update = (id:number, data:T) => {
        const key = dataKey(id);

        if (localStorage.getItem(key) != null) {
            localStorage.setItem(key, proxy.write(data));
        }
    };

    const setMeta = (id:number, meta:any) => {
        const index = getIndex();
        if (index[id] !== undefined) {
            index[id].meta = meta;
        }
        return setIndex(index);
    };

    const getMeta = (id:number) => {
        const entity = getIndex()[id];
        if (entity && entity.meta) {
            return entity.meta;
        }
        return undefined;
    };

    const meta = (id:number, metaData?:any) => {
        if (metaData !== undefined) {
            return setMeta(id, metaData);
        }

        return getMeta(id);
    };

    const save = (data:T, metaData?:any) => {
        const timestamp = Date.now();
        const index     = getIndex();
        const entity    = { id:      timestamp
                          , dataKey: dataKey(timestamp)
                          , meta:    metaData
                          };

        index[timestamp] = entity;
        setIndex(index);

        localStorage.setItem(entity.dataKey, proxy.write(data));

        return entity;
    };

    const remove = (id:number) => {
        const index  = getIndex();
        const entity = index[id];
        
        if (!entity || !entity.dataKey) {
            return false;
        }

        localStorage.removeItem(entity.dataKey);
        delete index[entity.id];

        setIndex(index);

        return true;
    };

    return Object.create(null,
        { keys:         { get: keys }
        , empty:        { get: empty }
        , mostRecent:   { get: mostRecent }
        , get:          { value: get }
        , has:          { value: has }
        , update:       { value: update }
        , meta:         { value: meta }
        , list:         { value: list }
        , save:         { value: save }
        , remove:       { value: remove }
        , clear:        { value: clear }
        }
    );
}
