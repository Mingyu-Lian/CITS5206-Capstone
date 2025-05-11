import { useEffect, useState } from "react";
import {
  fetchAssignedEngineers,
  assignEngineerToTask,
  removeEngineerFromTask
} from "../mock/mockApi";

//  Hook
const useAssignedEngineers = (taskId) => {
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Initial fetch
  useEffect(() => {
    const load = async () => {
      const result = await fetchAssignedEngineers(taskId);
      setAssigned(result);
      setLoading(false);
    };

    if (taskId) load();
  }, [taskId]);

  //  Add engineer
  const addEngineer = async (engineer) => {
    await assignEngineerToTask(taskId, engineer);
    const updated = await fetchAssignedEngineers(taskId);
    setAssigned(updated);
  };

  //  Remove engineer
  const removeEngineer = async (engineerName) => {
    await removeEngineerFromTask(taskId, engineerName);
    const updated = await fetchAssignedEngineers(taskId);
    setAssigned(updated);
  };

  return {
    assigned,     // Array of { name, discipline }
    loading,      // Boolean for UI control
    addEngineer,  // Function to assign
    removeEngineer // Function to remove
  };
};

export default useAssignedEngineers;
