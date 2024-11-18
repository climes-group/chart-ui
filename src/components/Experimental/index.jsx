import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";
import { hasInputsOn2, isNodeActive } from "./utils";
import CustomFlowNode from "./utils/CustomFlowNode";
import CustomPrimaryEdge from "./utils/CustomPrimaryEdge";
import {
  edges as initialEdges,
  nodes as initialNodes,
} from "./utils/initial-data";
import "./utils/reactflow-custom.css";

const minimapStyle = {
  height: 120,
};

const nodeTypes = {
  custom: CustomFlowNode,
};

const edgeTypes = {
  custom: CustomPrimaryEdge,
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  const edgesWithUpdatedTypes = edges.map((edge) => {
    if (edge.sourceHandle) {
      const edgeType = nodes.find((node) => node.type === "custom").data
        .selects[edge.sourceHandle];
      edge.type = edgeType;
    }

    return edge;
  });

  const handleNodeClick = useCallback(function onNodeClick(event, node) {
    const [hasInputsActive, inputEdges] = hasInputsOn2(node.id, nodes, edges);
    if (node.isPrimary || hasInputsActive) {
      setNodes((nds) => {
        return nds.map((_node) => {
          if (node.id === _node.id) {
            return {
              ..._node,
              data: {
                ..._node.data,
                isActive: !_node.data?.isActive,
              },
            };
          } else {
            const [hasInputsActive] = hasInputsOn2(_node.id, nodes, edges);
            if (_node.data?.isActive && hasInputsActive) {
              return {
                ..._node,
                data: {
                  ..._node.data,
                  isActive: false,
                },
              };
            } else {
              return _node;
            }
          }
          return _node;
        });
      });
      setEdges((eds) =>
        eds.map((_edge) => {
          if (node.id === _edge.source) {
            return {
              ..._edge,
              animated: !node.data?.isActive,
            };
          }

          return _edge;
        }),
      );
    } else {
      console.warn(`Conditions not met`);
      console.warn(nodes, edges);
      setEdges((eds) =>
        eds.map((_edge) => {
          if (node.id === _edge.target) {
            return {
              ..._edge,
              data: {
                error: isNodeActive(_edge.source, nodes) ? false : true,
              },
              animated: true,
            };
          }
          return _edge;
        }),
      );
      setTimeout(() => {
        setEdges((eds) => edges.map((_edge) => _edge));
      }, 500);
    }
  }, null);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edgesWithUpdatedTypes}
      onNodesChange={onNodesChange}
      onNodeClick={handleNodeClick}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      attributionPosition="top-right"
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    >
      <MiniMap style={minimapStyle} zoomable pannable />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
}

export default Flow;
