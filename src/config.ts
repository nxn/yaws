export interface IConfig {
    appName:            string;
    debug:              boolean;
    parentSelector?:    string;
}

const config: IConfig = { 
    appName: 'yaws',
    debug: true
};

export { config as default };
