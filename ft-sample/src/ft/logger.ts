export default class Logger{
    public value: String;
    public constructor(value: String){
        this.value = value;
    }
    public static green(value: String) {
        console.log("\x1b[32m%s\x1b[0m", value);
    }
    public static yellow(value: String) {
        console.log("\x1b[33m%s\x1b[0m", value);
    }
    public static blue(value: String) {
        console.log("\x1b[34m%s\x1b[0m", value);
    }
    public static bold(value: String) {
        console.log("\x1b[1m%s\x1b[0m", value);
    }
    public static red(value: String) {
        console.log("\x1b[31m%s\x1b[0m", value);
    }
    public static white(value: String) {
        console.log(value);
    }
}