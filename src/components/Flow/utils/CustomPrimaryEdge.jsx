import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "reactflow";

const CustomPrimaryEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  if (data.error) {
    return (
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: "red",
        }}
      />
    );
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      {data.type === "secondary" ? (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: "#ffcc00",
              padding: 10,
              borderRadius: 5,
              fontSize: 12,
              fontWeight: 700,
            }}
            className="nodrag nopan"
          >
            secondary
          </div>
        </EdgeLabelRenderer>
      ) : (
        <BaseEdge id={id} path={edgePath} />
      )}
    </>
  );
};

export default CustomPrimaryEdge;
