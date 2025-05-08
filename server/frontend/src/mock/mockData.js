// src/mock/mockData.js
// Add this to the top-level of mockData.js
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
            subtasks: [
              { subtaskId: "sub-001", title: "Sign on permit", status: "Completed" },
              { subtaskId: "sub-002", title: "Inspect entry points", status: "Completed" },
            ],
          },
          {
            taskId: "task-002",
            title: "Turn Off Breakers",
            status: "Pending",
            subtasks: [
              { subtaskId: "sub-003", title: "Flick all breakers off", status: "Pending" },
              { subtaskId: "sub-004", title: "Pull knife switches", status: "Pending" },
            ],
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
            subtasks: [
              { subtaskId: "sub-005", title: "Apply Penetrox A", status: "In Progress" },
              { subtaskId: "sub-006", title: "Tighten positive connections", status: "Pending" },
            ],
          },
          {
            taskId: "task-004",
            title: "Reconnect Negative Terminal",
            status: "Pending",
            subtasks: [
              { subtaskId: "sub-007", title: "Secure negative connections", status: "Pending" },
            ],
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
            subtasks: [
              { subtaskId: "sub-008", title: "Check battery voltage", status: "Completed" },
              { subtaskId: "sub-009", title: "Check battery physical condition", status: "Completed" },
            ],
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
            subtasks: [
              { subtaskId: "sub-010", title: "Cross-check ATP Software version", status: "Pending" },
              { subtaskId: "sub-011", title: "Cross-check CDU image", status: "Pending" },
            ],
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
            subtasks: [
              { subtaskId: "sub-012", title: "Install WiMAX antenna", status: "Completed" },
              { subtaskId: "sub-013", title: "Connect WiMAX cables", status: "Completed" },
            ],
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
            subtasks: [
              { subtaskId: "sub-014", title: "Mount cabinet frame", status: "In Progress" },
              { subtaskId: "sub-015", title: "Secure cabinet bolts", status: "Pending" },
            ],
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
            subtasks: [
              { subtaskId: "sub-016", title: "Test diode voltage to ground", status: "Completed" },
              { subtaskId: "sub-017", title: "Discharge capacitors", status: "Completed" },
            ],
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
            subtasks: [
              { subtaskId: "sub-018", title: "Check ATP commissioning", status: "Pending" },
            ],
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
            subtasks: [
              { subtaskId: "sub-019", title: "Transmit test packet", status: "In Progress" },
              { subtaskId: "sub-020", title: "Receive verification", status: "Pending" },
            ],
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
            subtasks: [
              { subtaskId: "sub-021", title: "Connect Positive terminal", status: "Completed" },
              { subtaskId: "sub-022", title: "Connect Negative terminal", status: "Completed" },
            ],
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
            subtasks: [
              { subtaskId: "sub-023", title: "Crimp lugs", status: "Pending" },
              { subtaskId: "sub-024", title: "Secure earth wire", status: "Pending" },
            ],
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
            subtasks: [
              { subtaskId: "sub-025", title: "Check ATP version", status: "Completed" },
              { subtaskId: "sub-026", title: "Check BCCB firmware", status: "Completed" },
            ],
          },
        ],
      },
    ],
  },
];

export default locomotives;
