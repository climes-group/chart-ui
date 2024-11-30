export function isNodeActive(nodeId, nodes) {
  return nodes.some((node) => node.id === nodeId && node.data.isActive);
}

export function hasInputsOn(nodeId, edgeList = []) {
  console.log("Checking for all inputs on nodeId", nodeId, edgeList);
  const allInputEdges = edgeList.filter((edge) => edge.target === nodeId);
  const allActive = allInputEdges.every((edge) => edge?.isActive);
  return allActive;
}

/**
 * Checks that all *source* nodes to this node are active
 * @param {string} targetNodeId
 * @param {[Nodes]} nodes - full nodes list
 * @param {[Edges]} edges - full edges list
 */
export function hasInputsOn2(targetNodeId, nodes, edges) {
  const edgesRelatedToTargetNode = edges.filter(
    (edge) => edge.target === targetNodeId,
  );
  const allSourceNodeIds = edgesRelatedToTargetNode.map((edge) => edge.source);

  const allSourceNodes = nodes.filter((node) =>
    allSourceNodeIds.includes(node.id),
  );
  return [
    allSourceNodes.every((node) => node.data.isActive),
    edgesRelatedToTargetNode,
  ];
}

export function getOutputTargetNodeIds(nodeId, nodes, edges) {
  const relatedOutputEdges = edges.filter((x) => x.source === nodeId);
  return relatedOutputEdges.map((edge) => {
    const targetNode = nodes.find((node) => node.id === edge.target);
    return targetNode;
  });
}

export function calcNewNodeState(nodeId, newIsActive, nodes, edges) {
  if (!newIsActive) {
    // being turned off
    const targetNodes = getOutputTargetNodeIds(nodeId, nodes, edges);
  }

  return nodes.map((node) => ({ ...node }));
}
