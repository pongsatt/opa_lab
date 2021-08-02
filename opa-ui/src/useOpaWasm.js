import { loadPolicy } from "@open-policy-agent/opa-wasm";
import { useEffect, useState } from "react";

export default function useOpaWasm(baseUrl) {
  const [policy, setPolicy] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const load = async () => {
      const policyWasmResp = await fetch(`${baseUrl}/policy.wasm`, {
        cache: "no-cache",
      });
      const policyWasm = await policyWasmResp.arrayBuffer();
      const policy = await loadPolicy(policyWasm);

      const dataResp = await fetch(`${baseUrl}/data.json`, {
        cache: "no-cache",
      });
      const data = await dataResp.json();
      policy.setData(data);

      setPolicy(policy);
    };
    setLoading(true);
    load()
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [baseUrl]);

  return { policy, loading, error };
}
