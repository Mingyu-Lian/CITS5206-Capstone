// a unit test for createLogEntry()/ cacheLogEntry()/ and syncLogs() function

import localforage from "localforage";
import {
  createLogEntry,
  cacheLogEntry,
  syncLogs
} from "../utils/offlineSyncHelper";

global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
);

describe("offlineSyncHelper module", () => {
  beforeEach(async () => {
    await localforage.clear();
    fetch.mockClear();
  });

  it("should generate a valid log entry object [createLogEntry]", () => {
    const log = createLogEntry("click_save_subtask", {
      subtaskId: "sub1", taskId: "task2", locoID: "L1234"
    });

    expect(log).toHaveProperty("userId");
    expect(log.action).toBe("click_save_subtask");
    expect(log.locoID).toBe("L1234");
    expect(log).toHaveProperty("details");
    expect(log).toHaveProperty("actionTime");
    expect(log.status).toBe("pending");
  });

  it("should store log entry in localForage [cacheLogEntry]", async () => {
    const entry = {
      userId: "user123",
      action: "upload_file",
      locoID: "L5678",
      details: JSON.stringify({ fileName: "test.pdf" }),
      actionTime: new Date().toISOString(),
      status: "pending",
    };
    await cacheLogEntry(entry);

    const stored = await localforage.getItem("offlineLogs");
    expect(stored.length).toBe(1);
    expect(stored[0].action).toBe("upload_file");
  });

  it("should sync logs and remove local copy when successful [syncLogs]", async () => {
    await localforage.setItem("offlineLogs", [
      {
        userId: "user123",
        action: "toggle_signoff",
        locoID: "L9999",
        details: JSON.stringify({ subtaskId: "sub3" }),
        actionTime: new Date().toISOString(),
        status: "pending",
      }
    ]);
    await syncLogs();

    const result = await localforage.getItem("offlineLogs");
    expect(result).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

