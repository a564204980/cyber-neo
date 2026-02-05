/**
 * 获取一组元素节点信息
 * @param selector 选择器
 * @param instance 组件实例
 * @returns Promise<NodeInfo[]>
 */
export const getRects = (
  selector: string,
  instance?: any,
): Promise<UniApp.NodeInfo[]> => {
  return new Promise((resolve) => {
    const query = instance
      ? uni.createSelectorQuery().in(instance)
      : uni.createSelectorQuery();

    query
      .selectAll(selector)
      .boundingClientRect((data) => {
        resolve(data as UniApp.NodeInfo[]);
      })
      .exec();
  });
};

/**
 * 节流函数 (Throttle)
 * 限制函数在一定时间内只能执行一次
 *
 * @param fn 需要节流的函数
 * @param delay 间隔时间（毫秒），默认 200ms
 * @returns 包装后的新函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 200,
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastTime = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastTime > delay) {
      timer && clearTimeout(timer);
      timer = null;

      fn.apply(this, args);
      lastTime = now;
    } else if (!timer) {
      timer = setTimeout(
        () => {
          fn.apply(this, args);
          lastTime = Date.now();
          timer = null;
        },
        delay - (now - lastTime),
      ) as any;
    }
  };
};
