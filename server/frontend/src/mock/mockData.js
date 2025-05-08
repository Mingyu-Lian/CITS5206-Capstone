export const baselines = [
  { id: "baseline-001", version: "v1.0", description: "Initial setup" },
  { id: "baseline-002", version: "v2.0", description: "Minor updates" },
  { id: "baseline-003", version: "v3.0", description: "Major revision" },
];

const locomotives = [
  {
    locomotiveId: "Loco-001",
    name: "Locomotive A",
    baseline: "v3.0",
    wmsList: [
      {
        wmsId: "WMS-001",
        title: "Battery Disconnection",
        type: "Installation",
        tasks: [
          {
            taskId: "task-001",
            title: "Sign on to Permit and Isolate",
            status: "Completed",
            discipline: "Mechanical",
          },
          {
            taskId: "task-002",
            title: "Turn Off Breakers",
            status: "Pending",
            discipline: "Electrical",
          },
        ],
      },
      {
        wmsId: "WMS-002",
        title: "Battery Reconnection",
        type: "Installation",
        tasks: [
          {
            taskId: "task-003",
            title: "Reconnect Positive Terminal",
            status: "In Progress",
            discipline: "Electrical",
          },
          {
            taskId: "task-004",
            title: "Reconnect Negative Terminal",
            status: "Pending",
            discipline: "Electrical",
          },
        ],
      },
      {
        wmsId: "WMS-003",
        title: "Pre-Installation Inspection",
        type: "Commissioning",
        tasks: [
          {
            taskId: "task-005",
            title: "Inspect Battery Compartment",
            status: "Completed",
            discipline: "Quality",
          },
        ],
      },
    ],
  },

  {
    locomotiveId: "Loco-002",
    name: "Locomotive B",
    baseline: "v2.1",
    wmsList: [
      {
        wmsId: "WMS-004",
        title: "Lab Certificates Verification",
        type: "Commissioning",
        tasks: [
          {
            taskId: "task-006",
            title: "Validate Lab Results",
            status: "Pending",
            discipline: "Quality",
          },
        ],
      },
      {
        wmsId: "WMS-005",
        title: "ATO-A Commissioning",
        type: "Commissioning",
        tasks: [
          {
            taskId: "task-007",
            title: "Setup WiMAX Modem",
            status: "Completed",
            discipline: "Software",
          },
        ],
      },
      {
        wmsId: "WMS-006",
        title: "Non-Vital Cabinet Installation",
        type: "Installation",
        tasks: [
          {
            taskId: "task-008",
            title: "Install Non-Vital Cabinet",
            status: "In Progress",
            discipline: "Mechanical",
          },
        ],
      },
    ],
  },

  {
    locomotiveId: "Loco-003",
    name: "Locomotive C",
    baseline: "v2.5",
    wmsList: [
      {
        wmsId: "WMS-007",
        title: "Battery Disconnection",
        type: "Installation",
        tasks: [
          {
            taskId: "task-009",
            title: "Test for Residual Voltage",
            status: "Completed",
            discipline: "Electrical",
          },
        ],
      },
      {
        wmsId: "WMS-008",
        title: "Lab Certificates Verification",
        type: "Commissioning",
        tasks: [
          {
            taskId: "task-010",
            title: "Verify Certification Tags",
            status: "Pending",
            discipline: "Quality",
          },
        ],
      },
      {
        wmsId: "WMS-009",
        title: "ATO-A Commissioning",
        type: "Commissioning",
        tasks: [
          {
            taskId: "task-011",
            title: "Conduct Radio System Test",
            status: "In Progress",
            discipline: "Software",
          },
        ],
      },
    ],
  },

  {
    locomotiveId: "Loco-004",
    name: "Locomotive D",
    baseline: "v1.8",
    wmsList: [
      {
        wmsId: "WMS-010",
        title: "Battery Reconnection",
        type: "Installation",
        tasks: [
          {
            taskId: "task-012",
            title: "Reconnect Main Battery",
            status: "Completed",
            discipline: "Electrical",
          },
        ],
      },
      {
        wmsId: "WMS-011",
        title: "Non-Vital Cabinet Installation",
        type: "Installation",
        tasks: [
          {
            taskId: "task-013",
            title: "Terminate NV Cabinet Wiring",
            status: "Pending",
            discipline: "Electrical",
          },
        ],
      },
      {
        wmsId: "WMS-012",
        title: "Pre-Installation Commissioning",
        type: "Commissioning",
        tasks: [
          {
            taskId: "task-014",
            title: "Software Version Checks",
            status: "Completed",
            discipline: "Software",
          },
        ],
      },
    ],
  },
];

export default locomotives;
