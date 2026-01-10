import { useEffect, useEffectEvent, useState } from "react";

export default function ApplicableSystemsCard() {
  const [systems, setSystems] = useState(null);
  const [error, setError] = useState(null);

  const fetchSystems = useEffectEvent(async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/codes/building_service",
      );
      if (!response.ok) throw new Error("Failed to fetch systems");
      const data = await response.json();
      setSystems(data);
    } catch (err) {
      setError(err.message);
    }
  });

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems]);

  if (error) return <div>Error: {error}</div>;
  if (!systems) return <div>Loading...</div>;

  return (
    <div>
      <h3>Applicable Systems</h3>
      <ul>
        {systems.map((system) => (
          <li key={system.id}>{system.name}</li>
        ))}
      </ul>
    </div>
  );
}
