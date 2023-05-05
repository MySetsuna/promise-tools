class PromiseTool {
  _resovleMap: Map<string, (value: unknown) => void> = new Map();
  _rejectMap: Map<string, (value: unknown) => void> = new Map();
  _promiseMap: Map<string, Promise<unknown>> = new Map();
  _paramsMap: Map<string, unknown> = new Map();
  _getFetch: (key?: string, params?: unknown) => Promise<unknown>;
  _max?: number = 2;
  _batching?: boolean = false;
  _batchTimeout: number;
  _batchTimeStep: number;
  _timer?: NodeJS.Timeout;
  _promiseTimeout?: number;
  _promiseExpire?: number;
  _timeoutTimerMap: Map<string, NodeJS.Timeout> = new Map();
  constructor(
    getFetch: (key?: string, params?: unknown) => Promise<unknown>,
    options?: {
      batchTimeout?: number;
      batchTimeStep?: number;
      promiseTimeout?: number;
      promiseExpire?: number;
      max?: number;
    }
  ) {
    this._getFetch = getFetch;
    if (options?.max && options?.max > 0) {
      this._max = options.max;
    } else if (typeof options?.max === "number") {
      console.warn("非法max值，将使用默认值max=2");
    }
    this._batchTimeout = options?.batchTimeout ?? 2000;
    this._batchTimeStep = options?.batchTimeStep ?? 10;
    this._promiseTimeout = options?.promiseTimeout ?? 3000;
    this._promiseExpire = options?.promiseExpire ?? 30000;
  }

  _setBatchTimeout = (
    _resovleMap: Map<string, (value: unknown) => void>,
    _paramsMap: Map<string, unknown>,
    _promiseMap: Map<string, Promise<unknown>>,
    key: string,
    resovle: (value: unknown) => void,
    params: unknown,
    timeout: number
  ) => {
    this._timer = setTimeout(() => {
      // this.resovleMap 的指向会被batch改变
      if (this._resovleMap.get(key) === resovle || timeout < 0) {
        if (!this._batching || timeout < 0) {
          if (timeout < 0) console.warn("batch请求超时，将逐个返回请求");
          this._getFetch(key, params).then((rs) => {
            _resovleMap.delete(key);
            _paramsMap.delete(key);
            resovle(rs);
            const timer = this._timeoutTimerMap.get(key);
            this._timeoutTimerMap.delete(key);
            clearTimeout(timer);
          });
        } else {
          clearTimeout(this._timer);
          this._setBatchTimeout(
            _resovleMap,
            _paramsMap,
            _promiseMap,
            key,
            resovle,
            params,
            timeout - this._batchTimeStep
          );
        }
      }
    }, this._batchTimeStep);
  };

  // 生成用户的请求的promise，如果已经请求过，返回同一promise，如果resovleMap未被清理，则发起请求
  /**
   * key 避免重复请求设置的唯一值 params 请求方法所需的参数
   */
  getPromise = async (options: {
    key: string;
    params?: unknown;
    timeout?: number;
    expire?: number;
  }) => {
    const { key, params, timeout, expire } = options;
    if (timeout && expire && timeout >= expire) {
      throw new Error("expire time should more than timeout time");
    }
    const { _resovleMap, _paramsMap, _promiseMap, _rejectMap } = this;
    const getPromiseInner = () => {
      return new Promise((resovle, reject) => {
        _resovleMap.set(key, resovle);
        _rejectMap.set(key, reject);
        _paramsMap.set(key, params);
        // 设置timeout，让单个请求在下个事件循环中发起
        this._setBatchTimeout(
          _resovleMap,
          _paramsMap,
          _promiseMap,
          key,
          resovle,
          params,
          this._batchTimeout
        );
      });
    };
    if (!_promiseMap.has(key)) {
      const promise = getPromiseInner();
      _promiseMap.set(key, promise);
      setTimeout(() => {
        const preReject = _rejectMap.get(key);
        _promiseMap.delete(key);
        _resovleMap.delete(key);
        _paramsMap.delete(key);
        _rejectMap.delete(key);
        if (preReject) preReject(`pre Promise expire: ${expire}`);
      }, expire ?? this._promiseExpire);

      const timeoutTimer = setTimeout(() => {
        if (_promiseMap.get(key) === promise)
          _rejectMap.get(key)?.(`beyond custom timeout: ${timeout}`);
      }, timeout ?? this._promiseTimeout);
      this._timeoutTimerMap.set(key, timeoutTimer);
      if (_promiseMap.size === this._max) await this._batchFetch();
    }
    return _promiseMap.get(key);
  };

  _batchFetch = async () => {
    this._batching = true;
    const { _resovleMap, _paramsMap } = this;
    const tempMap = _resovleMap;
    this._resovleMap = new Map();
    const tempParamsMap = _paramsMap;
    const resultList = await Promise.all(
      [...tempMap.keys()].map((key) =>
        this._getFetch(key, tempParamsMap.get(key))
      )
    );
    [...tempMap.keys()].forEach((key) => {
      const timer = this._timeoutTimerMap.get(key);
      this._timeoutTimerMap.delete(key);
      clearTimeout(timer);
    });
    [...tempMap.keys()].forEach((key, index) => {
      const resovle = tempMap.get(key);
      if (resovle) resovle(resultList[index]);
    });

    tempMap.clear();
    tempParamsMap.clear();
    this._batching = false;
  };
}

export default PromiseTool;
