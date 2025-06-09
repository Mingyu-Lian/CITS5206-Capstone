// mockEngineerTasks.js

export const baselineMap = {
    "Loco-001": "v3.0",
    "Loco-002": "v2.1",
    "Loco-003": "v2.5",
    "Loco-004": "v1.8",
  };
  
  export const defaultLocomotiveData = (locoId) => ({
    locomotiveId: locoId,
    name: `Locomotive ${locoId}`,
    baseline: baselineMap[locoId],
    wmsList: [
      {
        wmsId: "wms1",
        title: "WMS - Electrical",
        type: "Installation",
        tasks: [
          {
            taskId: "task1",
            title: "Check Fuse Box",
            status: "Pending",
            subtasks: [
              { id: "sub1", instruction: "Verify voltage levels.", result: "", signedOff: false, discipline: "Electrical" },
              { id: "sub2", instruction: "Capture photo of connected cable.", result: "", signedOff: false, discipline: "Mechanical" }
            ]
          },
          {
            taskId: "task2",
            title: "Install Cabling",
            status: "Signed Off",
            subtasks: [
              { id: "sub7", instruction: "Inspect insulation on cabling.", result: "", signedOff: false, discipline: "Electrical" },
              { id: "sub8", instruction: "Secure loose cables.", result: "", signedOff: false, discipline: "Mechanical" }
            ]
          }
        ]
      },
      {
        wmsId: "wms2",
        title: "WMS - Hydraulic",
        type: "Commissioning",
        tasks: [
          {
            taskId: "task3",
            title: "Inspect Brake System",
            status: "Pending",
            subtasks: [
              { id: "sub3", instruction: "Inspect brake pads wear", result: "", signedOff: false, discipline: "Mechanical" },
              { id: "sub4", instruction: "Check brake fluid levels", result: "", signedOff: false, discipline: "Mechanical" }
            ]
          },
          {
            taskId: "task4",
            title: "Replace Battery Module",
            status: "In Progress",
            subtasks: [
              { id: "sub5", instruction: "Remove old battery", result: "", signedOff: false, discipline: "Electrical" },
              { id: "sub6", instruction: "Install new battery", result: "", signedOff: false, discipline: "Electrical" }
            ]
          }
        ]
      }
    ]
  });
  