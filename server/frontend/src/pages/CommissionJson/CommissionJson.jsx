
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';

import { Table, Button, Modal, Input, Typography, Form, message, Alert, Spin } from "antd"
import { UserOutlined, LoadingOutlined } from "@ant-design/icons"
import Commissions from "./Commission.json";
import oneTable from "./T5.json";


const { Title, Text } = Typography
const tableData = oneTable;

// Mock API function to simulate fetching data from a server
const fetchTableData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return tableData
}

const fetchCommissionData = (commissionId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const commission = Commissions[commissionId];
      if (commission) {
        resolve(commission);
      } else {
        reject(new Error(`Commission with ID ${commissionId} not found`));
      }
    }, 500);
  });
};

export default function Home() {
  const { commissionId } = useParams();
  console.log("commissionId:", commissionId)
  // State for the table data
  const [tableData, setTableData] = useState(null)

  // State for loading status
  const [loading, setLoading] = useState(true)

  // State for storing user-entered values in editable cells
  // Format: { "rowId-columnId": "value" }
  const [cellValues, setCellValues] = useState({})

  // State for tracking which cells have been signed
  // Format: { "rowId-columnId": { signed: true/false, username: "name", timestamp: "date" } }
  const [signatures, setSignatures] = useState({})

  // State for controlling the visibility of the edit modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  // State for tracking which cell is currently being edited
  const [currentCell, setCurrentCell] = useState({ rowId: null, columnId: null })

  // State for the current value in the edit modal's input field
  const [inputValue, setInputValue] = useState("")

  // State for the username input
  const [username, setUsername] = useState("")

  // State for the signature modal
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)

  // State for the current signature cell
  const [currentSignatureCell, setCurrentSignatureCell] = useState({ rowId: null, columnId: null })

  // State for saving status
  const [saving, setSaving] = useState(false)
  const saveTableData = async (data) => {

    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Data saved to server:", data)

    return { success: true, message: "Data saved successfully" }
  }

  // Fetch table data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchCommissionData(commissionId);
        setTableData(data);
      } catch (err) {
        message.error("Failed to load table data")
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [commissionId]);


  const processTableData = (data) => {
    if (!data) return { columns: [], rows: [] }

    // Transform the columns array into the format expected by Ant Design Table
    // but preserve all original column data
    const columns = data.Columns.map((column) => {
      return {
        title: column.HeaderText, // Use the HeaderText as the column title
        dataIndex: `col${column.ID}`, // Create a unique dataIndex based on column ID
        key: `col${column.ID}`, // Create a unique key based on column ID
        width: `${column.WidthWeight * 10}%`, // Calculate percentage width based on WidthWeight
        originalData: column, // Store the complete original column data

        // Custom render function for each cell based on column type
        render: (text, record, index) => {
          // Find the original cell data from the record
          const cellData = record.originalCells.find((cell) => cell.ColumnID === column.ID)

          // For signature column (ColumnType 4)
          if (column.ColumnType === 4) {
            const signatureData = signatures[`${record.key}-${column.ID}`]

            // If the cell is signed, show the username and timestamp
            if (signatureData && signatureData.signed) {
              return (
                <div>
                  <div className="font-semibold">{signatureData.username}</div>
                  <div className="text-xs text-gray-500">{new Date(signatureData.timestamp).toLocaleString()}</div>
                </div>
              )
            }

            // If not signed, show the sign button
            return (
              <Button
                type="default"
                icon={<UserOutlined />}
                onClick={() => handleSignatureClick(record.key, column.ID, cellData)}
              >
                Sign
              </Button>
            )
          }

          // For input column (ColumnType 1)
          if (column.ColumnType === 1) {
            return (
              <div
                className="editable-cell"
                onClick={() => handleCellClick(record.key, column.ID, cellData)}
                style={{
                  minHeight: "30px",
                  border: "1px dashed #d9d9d9",
                  padding: "5px",
                  cursor: "pointer",
                }}
              >
                {cellValues[`${record.key}-${column.ID}`] || "Click to edit"}
              </div>
            )
          }

          // For regular text columns (ColumnType 0)
          return text
        },

        // Function to determine cell properties like rowSpan and colSpan
        onCell: (record) => {
          // Find the cell in this record that belongs to this column
          const cell = record.cells.find((c) => c.columnId === column.ID)
          if (!cell) return {}

          const cellProps = {
            originalData: record.originalCells.find((c) => c.ColumnID === column.ID),
          }

          // Handle rowSpan based on VerticalMerge value
          if (cell.verticalMerge === 2) {
            // VerticalMerge 2 means this cell starts a multi-row span
            let rowSpan = 1

            // Find the index of the current row in the data
            const rowIndex = data.Rows.findIndex((r) => r.ID === record.rowId)

            // Look at subsequent rows to count how many should be merged
            for (let i = rowIndex + 1; i < data.Rows.length; i++) {
              // Find the cell in the next row with the same column ID
              const nextRowCell = data.Rows[i].Cells.find((c) => c.ColumnID === column.ID)

              // If the next row's cell has VerticalMerge 0, it should be merged with this cell
              if (nextRowCell && nextRowCell.VerticalMerge === 0) {
                rowSpan++
              } else {
                break
              }
            }
            cellProps.rowSpan = rowSpan
          } else if (cell.verticalMerge === 0) {
            // VerticalMerge 0 means this cell should be merged with the cell above
            cellProps.rowSpan = 0
          }

          return cellProps
        },
      }
    })

    // Transform the rows data into the format expected by Ant Design Table
    // while preserving all original data
    const rows = data.Rows.map((row) => {
      // Create the base row object with key, metadata, and original data
      const rowData = {
        key: row.ID,
        rowId: row.ID,
        originalData: row,
        originalCells: row.Cells,

        // Transform cells array to include column ID, text content, and vertical merge info
        cells: row.Cells.map((cell) => ({
          columnId: cell.ColumnID,
          text: cell.LabelText,
          verticalMerge: cell.VerticalMerge,
          id: cell.id,
          type: cell.type,
          metadata: cell.Metadata,
          legacyLabelText: cell.LegacyLabelText,
        })),
      }

      // Add column data to the row object
      data.Columns.forEach((column) => {
        // Find the cell in this row that belongs to this column
        const cell = row.Cells.find((c) => c.ColumnID === column.ID)
        if (cell) {
          // If cell exists, use its LabelText as the value
          rowData[`col${column.ID}`] = cell.LabelText
        } else {
          // If no cell found for this column, use empty string
          rowData[`col${column.ID}`] = ""
        }
      })

      return rowData
    })

    return { columns, rows }
  }

  // Process the table data to get columns and rows for Ant Design Table
  const { columns, rows } = processTableData(tableData)


  const handleCellClick = (rowId, columnId, cellData) => {
    // Store which cell is being edited along with its complete data
    setCurrentCell({ rowId, columnId, originalData: cellData })

    // Set the initial value in the modal to the current cell value or empty string
    setInputValue(cellValues[`${rowId}-${columnId}`] || "")

    // Open the edit modal
    setIsModalOpen(true)
  }

  const handleSignatureClick = (rowId, columnId, cellData) => {
    // Store which cell is being signed along with its complete data
    setCurrentSignatureCell({ rowId, columnId, originalData: cellData })

    // Open the signature modal
    setIsSignatureModalOpen(true)
  }


  const handleSignatureSubmit = () => {
    if (!username.trim()) {
      message.error("Please enter your username")
      return
    }

    const { rowId, columnId } = currentSignatureCell

    // Add the signature with username and timestamp
    setSignatures((prev) => ({
      ...prev,
      [`${rowId}-${columnId}`]: {
        signed: true,
        username: username,
        timestamp: new Date().toISOString(),
      },
    }))

    // Close the signature modal
    setIsSignatureModalOpen(false)

    // Show success message
    message.success(`Signed by ${username}`)
  }


  const handleModalOk = () => {
    // Save the entered value to the cellValues state
    setCellValues((prev) => ({
      ...prev,
      [`${currentCell.rowId}-${currentCell.columnId}`]: inputValue,
    }))

    // Close the modal
    setIsModalOpen(false)
  }


  const handleModalCancel = () => {
    // Simply close the modal without saving changes
    setIsModalOpen(false)
  }


  const handleSignatureCancel = () => {
    // Close the signature modal without saving
    setIsSignatureModalOpen(false)
  }


  const exportTableData = () => {
    if (!tableData) return null

    // Create a deep copy of the original data
    const exportData = JSON.parse(JSON.stringify(tableData))

    // Update the Cells with user-entered values and signatures
    exportData.Rows.forEach((row) => {
      row.Cells.forEach((cell) => {
        // Check if this cell has a user-entered value
        const userValue = cellValues[`${row.ID}-${cell.ColumnID}`]
        if (userValue !== undefined) {
          // Update the LabelText with the user-entered value
          cell.LabelText = userValue
        }

        // Check if this cell has been signed
        const signatureData = signatures[`${row.ID}-${cell.ColumnID}`]
        if (signatureData && signatureData.signed) {
          // Add signature information to the cell's Metadata
          cell.Metadata = cell.Metadata || ""
          cell.Metadata += `|SIGNED:${signatureData.username}:${signatureData.timestamp}`
        }
      })
    })
    // console.log("exportData:", exportData)
    return exportData
  }

  //  Function to save the table data to the server

  const saveData = async () => {
    try {
      setSaving(true)
      // Get the updated data
      const dataToSave = exportTableData()
      // Call the mock API to save the data
      const response = await saveTableData(dataToSave)
      // Show success message
      message.success(response.message)
    } catch (error) {
      console.error("Error saving data:", error)
      message.error("Failed to save data")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Spin style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} size="large" tip="Loading Commission Table..." />;
  }
  if (!tableData) {
    return <Alert message="Task not found" type="error" />;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        {/* Table title */}
        <Title level={3}>{tableData?.Title || "Table"}</Title>

        <div className="flex items-center gap-2">
          {/* <Input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: 200 }}
            prefix={<UserOutlined />}
          /> */}

          <Button type="primary" onClick={saveData} loading={saving}>
            Save
          </Button>
          {/* <Button onClick={() => exportTableData()}>Export</Button> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={rows}
          pagination={false}
          bordered
          size="middle"
          style={{ marginTop: 16 }}
        />
      </div>

      <Modal title="Edit" open={isModalOpen} onOk={handleModalOk} onCancel={handleModalCancel}>
        {currentCell.originalData && currentCell.originalData.Metadata && (
          <div className="mb-2">
            <Text type="secondary">Metadata: {currentCell.originalData.Metadata}</Text>
          </div>
        )}

        <Input.TextArea value={inputValue} onChange={(e) => setInputValue(e.target.value)} rows={4} />
      </Modal>

      <Modal
        title="Signature"
        open={isSignatureModalOpen}
        onOk={handleSignatureSubmit}
        onCancel={handleSignatureCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Sign your name" required help="Enter your name to sign">
            <Input
              placeholder="Enter your name to sign"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <div className="text-sm text-gray-500">
            By signing, you confirm that you have reviewed and approved this item. Your name and timestamp will be
            recorded.
          </div>
        </Form>
      </Modal>
    </div>
  )
}
