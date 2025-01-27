import { TEnvironments } from '@/configurations/env.configuration';

export class R2Service {
  private r2: R2Bucket;
  constructor(env: TEnvironments) {
    this.r2 = env.BUCKET;
  }

  public async put(
    key: string,
    data: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob,
    options?: R2PutOptions,
  ): Promise<R2Object> {
    return this.r2.put(key, data, options);
  }

  public async get(key: string) {
    const object = await this.r2.get(key);

    if (object === null) {
      return null;
    }

    return object.body;
  }

  public async delete(key: string): Promise<void> {
    await this.r2.delete(key);
  }
}
