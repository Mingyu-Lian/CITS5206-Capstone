// src/data/mockProjectData.js

const mockLocomotives = [
    {
      id: "loco1",
      name: "Locomotive A",
      type: "Type X",
      baseline: "v1.0",
      wms: [
        {
          id: "wms1",
          title: "Battery Reconnection",
          type: "Installation",
          tasks: [
            {
              id: "task1",
              title: "Install Battery Units",
              status: "Pending",
              subtasks: [
                { id: "subtask1", title: "Position Battery Module", status: "Pending", assignedEngineer: null },
                { id: "subtask2", title: "Connect Battery Terminals", status: "Pending", assignedEngineer: null },
                { id: "subtask3", title: "Secure Battery Casing", status: "Pending", assignedEngineer: null }
              ]
            },
            {
              id: "task2",
              title: "Test Battery Performance",
              status: "Pending",
              subtasks: [
                { id: "subtask4", title: "Voltage Check", status: "Pending", assignedEngineer: null },
                { id: "subtask5", title: "Current Stability Test", status: "Pending", assignedEngineer: null }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "loco2",
      name: "Locomotive B",
      type: "Type Y",
      baseline: "v2.1",
      wms: [
        {
          id: "wms2",
          title: "Control System Calibration",
          type: "Commissioning",
          tasks: [
            {
              id: "task3",
              title: "Sensor Alignment",
              status: "Pending",
              subtasks: [
                { id: "subtask6", title: "Align Sensor A", status: "Pending", assignedEngineer: null },
                { id: "subtask7", title: "Align Sensor B", status: "Pending", assignedEngineer: null }
              ]
            },
            {
              id: "task4",
              title: "Software Update",
              status: "Pending",
              subtasks: [
                { id: "subtask8", title: "Backup Old Configurations", status: "Pending", assignedEngineer: null },
                { id: "subtask9", title: "Install New Firmware", status: "Pending", assignedEngineer: null }
              ]
            }
          ]
        }
      ]
    }
  ];
  
  export default mockLocomotives;
  