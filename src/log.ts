import inputs from "./inputs";

const log = {
    info: (...args: any[]): void => {
        if (inputs.debug) {
            console.log(...args);
        }
    },
    error: (...args: any[]): void => {
        if (inputs.debug) {
            console.error(...args);
        }
    },
};

export default log;
