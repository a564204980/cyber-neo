/**
 * 获取元素节点信息
 * @param selector 选择器
 * @param instance 组件实例 (可选，如果在组件内使用建议传入)
 * @returns Promise<NodeInfo>
 */
export const getRect = (
  selector: string,
  instance?: any,
): Promise<UniApp.NodeInfo> => {
  return new Promise((resolve) => {
    const query = instance
      ? uni.createSelectorQuery().in(instance)
      : uni.createSelectorQuery();

    query
      .select(selector)
      .boundingClientRect((data) => {
        resolve(data as UniApp.NodeInfo);
      })
      .exec();
  });
};
