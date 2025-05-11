
import { useRef, useState } from "react"
import { Table, Button, Input, Typography, Divider, Modal, Select, Space, Popover } from "antd"
import { EditOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons"
import "./BaselineDetail.css"

const CommissionDetail = () => {
  // State for version dropdown
  const [versionInput, setVersionInput] = useState("")
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false)
  const [currentEditingKey, setCurrentEditingKey] = useState(null)
  // State for note editing
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [noteInput, setNoteInput] = useState("")
  // Version options for dropdown
  const versionOptions = ["5.17BUILD00-30", "06.09", "5.18BUILD00-31", "06.10", "07.01"]
  const [softwareVersions, setSoftwareVersions] = useState(['softwareVersion1', 'softwareVersion2']);
  const [name, setName] = useState('');
  const inputRef = useRef(null);
  const onNameChange = event => {
    setName(event.target.value);
  };
  const handleChange = (version) => {
    if (currentEditingKey) {
      const newData = [...data]
      const index = newData.findIndex((item) => item.key === currentEditingKey)
      if (index > -1) {
        newData[index].softwareGenericVersion = version
        setData(newData)
      }
    }
    setName("")

    setIsVersionModalOpen(false)

  };
  const addSoftwareVersion = e => {

    let addVersionInput = inputRef.current.input.value
    e.preventDefault();
    // The input must not be empty
    if (addVersionInput.length > 1) {
      setSoftwareVersions([...softwareVersions, name]);
      setName("")
    }

    setTimeout(() => {
      var _a;
      (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, 0);
  };
  const [data, setData] = useState([
    {
      key: "1",
      action: "N/A",
      configItem: "N - Application",
      aimsReference: "ATO-ATOA-01",
      softwareGenericVersion: "5.17BUILD00-30",
      softwareLocoSpecificData: "N/A",
      installBy: "Shiyu Tang",
      verifyBy: "(Click to sign)",
      validateBy: "(Click to sign)",
      note: "",
    },
    {
      key: "2",
      action: "N/A",
      configItem: "N - Base",
      aimsReference: "ATO-ATOA-01",
      softwareGenericVersion: "06.09",
      softwareLocoSpecificData: "N/A",
      installBy: "Shiyu Tang",
      verifyBy: "(Click to sign)",
      validateBy: "(Click to sign)",
      note: "",
    },
    {
      key: "3",
      action: "N/A",
      configItem: "R - Application",
      aimsReference: "ATO-ATOR-01",
      softwareGenericVersion: "N/A",
      softwareLocoSpecificData: "N/A",
      installBy: "N/A",
      verifyBy: "N/A",
      validateBy: "N/A",
      note: "",
    },
    {
      key: "4",
      action: "N/A",
      configItem: "R - Base",
      aimsReference: "ATO-ATOR-01",
      softwareGenericVersion: "N/A",
      softwareLocoSpecificData: "N/A",
      installBy: "N/A",
      verifyBy: "N/A",
      validateBy: "N/A",
      note: "",
    },
  ])
  // Table columns configuration
  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 60,
      className: "",
      render: (text, record) => <div className={""}>{text}</div>,
    },
    {
      title: "Configuration Item",
      dataIndex: "configItem",
      key: "configItem",
      width: 120,
      className: "",
    },
    {
      title: "AIMS Reference",
      dataIndex: "aimsReference",
      key: "aimsReference",
      width: 120,
      className: "",
    },
    {
      title: (
        <div>
          Software Generic Version
          <EditOutlined className={""} />
        </div>
      ),
      dataIndex: "softwareGenericVersion",
      key: "softwareGenericVersion",
      width: 200,
      className: "",
      render: (text, record) => (
        <div
          className={""}
          onClick={() => {
            setCurrentEditingKey(record.key)
            setIsVersionModalOpen(true)
          }}
        >
          {text} <EditOutlined className={""} />
        </div>
      ),
    },
    {
      title: (
        <div>
          Software Loco Specific Data
          <EditOutlined className={""} />
        </div>
      ),
      dataIndex: "softwareLocoSpecificData",
      key: "softwareLocoSpecificData",
      width: 200,
      className: "",
    },
    {
      title: "Install by",
      dataIndex: "installBy",
      key: "installBy",
      width: 100,
      className: "",
    },
    {
      title: "Verify by",
      dataIndex: "verifyBy",
      key: "verifyBy",
      width: 100,
      className: "",
      render: (text, record) => (
        <div
          className={text === "(Click to sign)" ? "clickToSign " : ""}
          onClick={() => text === "(Click to sign)" && handleSign(record.key, "verifyBy")}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Validate by",
      dataIndex: "validateBy",
      key: "validateBy",
      width: 100,
      className: "",
      render: (text, record) => (
        <div
          className={text === "(Click to sign)" ? "clickToSign" : ""}
          onClick={() => text === "(Click to sign)" && handleSign(record.key, "validateBy")}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: 100,
      className: "",
      render: (text, record) => (
        <div
          className=""
          onClick={() => {
            setCurrentEditingKey(record.key)
            setNoteInput(text)
            setIsNoteModalOpen(true)
          }}
        >
          {<TruncatedText text={text} /> || "Add note"} <EditOutlined className="" />
          {/* {text  || "Add note"} <EditOutlined className="" /> */}

        </div>
      ),
    },
  ]


  // Handle version selection
  const handleVersionSelect = (version) => {
    if (currentEditingKey) {
      const newData = [...data]
      const index = newData.findIndex((item) => item.key === currentEditingKey)
      if (index > -1) {
        newData[index].softwareGenericVersion = version
        setData(newData)
      }
    }
    setIsVersionModalOpen(false)
  }

  // Handle adding a new version
  const handleAddVersion = () => {
    if (versionInput && currentEditingKey) {
      const newData = [...data]
      const index = newData.findIndex((item) => item.key === currentEditingKey)
      if (index > -1) {
        newData[index].softwareGenericVersion = versionInput
        setData(newData)
      }
      setVersionInput("")
      setIsVersionModalOpen(false)
    }
  }

  // Handle note saving
  const handleSaveNote = () => {
    if (currentEditingKey) {
      const newData = [...data]
      const index = newData.findIndex((item) => item.key === currentEditingKey)
      if (index > -1) {
        newData[index].note = noteInput
        setData(newData)
      }
    }
    setIsNoteModalOpen(false)
  }

  // Handle signing
  const handleSign = (key, field) => {
    const newData = [...data]
    const index = newData.findIndex((item) => item.key === key)
    if (index > -1) {
      newData[index][field] = "Signed"
      setData(newData)
    }
  }
  // Component to truncate text and show popover on hover
  const TruncatedText = ({ text }) => {
    const isTruncated = text.length > 10
    const truncatedText = isTruncated ? `${text.slice(0, 10)}...` : text

    if (!isTruncated) {
      return <span>{text}</span>
    }

    return (
      <Popover content={text} trigger="hover">
        <span>{truncatedText}</span>
      </Popover>
    )
  }
  return (
    <div>
      <Modal
        title="Select Software Version"
        open={isVersionModalOpen}
        onCancel={() => setIsVersionModalOpen(false)}
        footer={null}
      >
        <Select
          style={{ width: "80%" }}
          placeholder="Edit Software Version"
          defaultActiveFirstOption="True"
          defaultValue=""
          onChange={handleChange}
          dropdownRender={menu => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder="Enter software version"
                  ref={inputRef}
                  value={name}
                  onChange={onNameChange}
                  onKeyDown={e => e.stopPropagation()}
                />
                <Button type="default" icon={<PlusOutlined />} onClick={addSoftwareVersion}>
                  Add Version
                </Button>
              </Space>
            </>
          )}
          options={softwareVersions.map(item => ({ label: item, value: item }))}
        />
      </Modal>
      <Modal title="Add Note" open={isNoteModalOpen} onOk={handleSaveNote} onCancel={() => setIsNoteModalOpen(false)}
   
        
        >
        <Input.TextArea style={{marginBottom: "20px"}}
          showCount
          maxLength={100}
          // autoSize={{ minRows: 2, maxRows: 4 }}
          rows={4}
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Enter note here"
        />
      </Modal>
      <Table
        dataSource={data.slice(0, 4)}
        columns={columns}
        pagination={false}
        bordered
        size="middle"
        className={""}
      />
    </div>
  );
};
export default CommissionDetail;