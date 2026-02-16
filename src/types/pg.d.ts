declare module 'pg' {
    export class Pool {
        constructor(config?: any)
        connect(): Promise<any>
        end(): Promise<void>
        query(text: string, values?: any[]): Promise<any>
        on(event: string, listener: (...args: any[]) => void): this
    }

    export class Client {
        constructor(config?: any)
        connect(): Promise<void>
        end(): Promise<void>
        query(text: string, values?: any[]): Promise<any>
    }
}
