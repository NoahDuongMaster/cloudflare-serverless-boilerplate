import { TEnvironments } from '@/configurations/env.configuration';

export class KVService {
  private kv: KVNamespace;
  constructor(env: TEnvironments) {
    this.kv = env.KV;
  }

  public async put(
    key: string,
    data: string | ArrayBuffer | ArrayBufferView | ReadableStream,
    options?: KVNamespacePutOptions,
  ): Promise<void> {
    await this.kv.put(key, data, options);
  }

  public async get(
    key: string,
    options?: Partial<KVNamespaceGetOptions<undefined>>,
  ): Promise<string | null> {
    const result = await this.kv.get(key, options);

    if (result === null) {
      return null;
    }

    return result;
  }

  public async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }
}
