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
