/**
 * 获取一组元素节点信息
 * @param selector 选择器
 * @param instance 组件实例
 * @returns Promise<NodeInfo[]>
 */
export const getRects = (
  selector: string,
  instance?: any
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
  delay: number = 200
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
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = Date.now();
        timer = null;
      }, delay - (now - lastTime)) as any;
    }
  };
};

/**
 * 将 颜色字符串 (Hex/RGB/HSL) 转换为带透明度的格式
 * @param color 颜色值
 * @param opacity 透明度 (0-1)
 * @returns CSS 颜色字符串
 */
export const hexToRgba = (color: string, opacity: number): string => {
  // 1. 处理 HSL / HSLA
  if (color.startsWith("hsl")) {
    // 提取数字：匹配整数或小数 ([\d\.]+)
    const match = color.match(
      /hsl[a]?\(\s*([\d\.]+)\s*,\s*([\d\.]+)%?\s*,\s*([\d\.]+)%?/
    );
    if (match) {
      const [_, h, s, l] = match;
      return `hsla(${h}, ${s}%, ${l}%, ${opacity})`;
    }
    return color;
  }
  // 2. 处理 RGB / RGBA
  if (color.startsWith("rgb")) {
    const match = color.match(
      /rgb[a]?\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)/
    );
    if (match) {
      const [_, r, g, b] = match;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  }
  // 3. 处理 Hex
  let hex = color;
  if (!hex.startsWith("#")) {
    return hex;
  }
  // 去掉 # 号
  hex = hex.replace("#", "");
  // 处理简写 Hex (例如 #F00 -> #FF0000)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  // 解析 RGB 值
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
