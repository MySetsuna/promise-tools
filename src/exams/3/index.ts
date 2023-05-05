/**
 * 第三题
 */
import { isEqual } from "lodash-es";
import PromiseTool from "../../PromiseTool";

// 核心用户请求
let _requestTime = 0;
const requestProfile = (uid: string) => {
  // 这个方法的实现不能修改
  return Promise.resolve().then(() => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // 模拟 ajax 异步，1s 返回
        resolve();
      }, 1000);
    }).then(() => {
      _requestTime++;
      return {
        uid,
        nick: `nick-${uid}`,
        age: "18",
      };
    });
  });
};

let profileProTool: PromiseTool;
// 在这里完成代码，进行requestUserProfile优化
// 在这里调用requestProfile
/**
 *
 * @param uid uid
 * @param max 最多并发请求数量
 */
const requestUserProfile = (uid = "1", max = 2) => {
  if (!profileProTool) {
    profileProTool = new PromiseTool(
      (_key?: string, params?: unknown) => {
        if (typeof params === "string") {
          return requestProfile(params);
        } else {
          throw new Error(
            `参数错误，期望传入string,但是传入了${typeof params}`
          );
        }
      },
      { max }
    );
  }
  return profileProTool.getPromise({
    key: `${uid}key`,
    params: uid,
    timeout: 2000,
    expire: 1000,
  });
};
/**
 * 以下为测试用例，无需修改
 */
export default async () => {
  try {
    const star = Date.now();
    const result = await Promise.all([
      requestUserProfile("1"),
      requestUserProfile("2"),
      requestUserProfile("3"),
      requestUserProfile("1"),
    ]);
    if (Date.now() - star < 2000 || Date.now() - star >= 3000) {
      throw new Error("Wrong answer time");
    }
    if (
      !isEqual(result, [
        {
          uid: "1",
          nick: "nick-1",
          age: "18",
        },
        {
          uid: "2",
          nick: "nick-2",
          age: "18",
        },
        {
          uid: "3",
          nick: "nick-3",
          age: "18",
        },
        {
          uid: "1",
          nick: "nick-1",
          age: "18",
        },
      ])
    ) {
      throw new Error("Wrong answer");
    }
    return _requestTime === 3;
  } catch (err) {
    console.warn("测试运行失败");
    console.error(err);
    return false;
  }
};
