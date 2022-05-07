
declare type ResponseWrapper<T> = {
  code: number;
  msg: string;
  data: T;
};

export class Fetch {
  private interceptorsReq = <Function[]>[];
  private interceptorsRes = <{fail: Function, success: Function}[]>[];
  public interceptors = {
    request: {
      use: (cb: Function) => {
        this.interceptorsReq.push(cb);
      }
    },
    response: {
      use: (cb1: Function, cb2: Function) => {
        this.interceptorsRes.push({success: cb1, fail: cb2});
      }
    }
  }

  fetchWrapper<T>(input: any, init = {}): Promise<ResponseWrapper<T>> {
    const _init: any = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
      mode: 'cors',
      ...init,
    }
    this.interceptorsReq.forEach(interceptor => {
      init = interceptor(init);
    });
    return new Promise((resolve, reject) => {
      fetch(input, _init)
        .then(res => res.json())
        .then(r => {
          const { status, error } = r;
          this.interceptorsRes.forEach(interceptor => {
            if (status && status !== 200) {
              r = interceptor.fail(r);
              reject(r);
            } else {
              r = interceptor.success(r);
              resolve(r);
            }
          });
        })
        .catch(err => {
          this.interceptorsRes.forEach(interceptor => {
            err = interceptor.fail(err);
            reject(err?.toString());
            console.log('error====================', err);
          })
        })
    })
  }

  get<T>(url: string, options: object) {
    return this.fetchWrapper<T>(url, {
      method: 'GET',
      ...options,
    })
  }

  post<T>(url: string, options: object) {
    return this.fetchWrapper<T>(url, {
      method: 'POST',
      ...options,
    })
  }
}

export const zfetch = new Fetch();
zfetch.interceptors.response.use(
  (res: any) => {
    console.log('interceptor success', res);
    const { code, data, msg } = res;
    const _res = { ok: code === 200, data, msg }
    if (code !== 200) {

    }
    return res;
  },
  (error: any) => {
    console.log('interceptor fail', error);
    return error?.error || error;
  }
)
console.log('zfetch', zfetch);


/**
 * http 请求封装
 * @param {string} baseUrl 本地开发环境的接口服务器地址，例：http://kvm-dp-dev2:8891/tool
 * @param {string} transfer 生产环境的代理转发前缀，例：/transToJava/tool
 * @returns { post, get }
 */
const createHttpRequest = (baseUrl: string = document.location.origin, transfer: string = '') => {
  // 如果是本地开发环境，则使用传入的 baseUrl
  // 如果是线上环境，则需要用node代理服务，加上transfer的前缀
  const _baseUrl = isLocalDev() ? baseUrl : (document.location.origin + transfer);
  const post = <T>(
    url: string,
    body: unknown = {},
    options: any = {}
  ): Promise<ResponseWrapper<T>> =>
    zfetch.post(_baseUrl + url, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify(body),
      ...options,
    })
  
  const get = <T>(url: string, options: any = {}): Promise<ResponseWrapper<T>> =>
    zfetch.get(_baseUrl + url, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "GET",
      mode: "cors",
      ...options,
    })

  return { post, get } 
};

// 验证是否是本地开发环境或测试环境
function isLocalDev(hostname = window.location.hostname) {
  return [
    '127.0.0.1',
    'localhost',
    '10.9.0.118',   // dengwanc's ip
    '10.6.4.67',    // zoukan's ip
    'kvm-dp-dev2',  // 测试环境
  ].includes(hostname);
};

export default createHttpRequest;
