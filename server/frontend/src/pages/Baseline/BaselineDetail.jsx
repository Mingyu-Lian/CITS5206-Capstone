
import { useRef, useState,useEffect } from "react"
import { EditOutlined, SearchOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons"
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';

import { Table, Button, Input, Typography, Alert, Spin,Divider,Form, message, Modal, Select, Space, Popover } from "antd"
import "./BaselineDetail.css"
import Baseline from "./Baseline.json"; 

const fetchBaselineData = (baselineId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const baseline = Baseline[baselineId];
      console.log(baseline, "baseline")
      if (baseline) {
        resolve(baseline);
      } else {
        reject(new Error(`Baseline with ID ${baselineId} not found`));
      }
    }, 500);
  });
};
const BaselineDetail = () => {
  const [loading, setLoading] = useState(true)

  // State for version dropdown
  const [versionInput, setVersionInput] = useState("")
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false)
  const [currentEditingKey, setCurrentEditingKey] = useState(null)
  // State for note editing
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [noteInput, setNoteInput] = useState("")
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
// State for the username input
  const [username, setUsername] = useState("")
  // Version options for dropdown
  const [softwareVersions, setSoftwareVersions] = useState([ "5.17BUILD00-30", "06.09", "5.18BUILD00-31", "COMM.SATH-S1", "07.01"]);
  const [name, setName] = useState('');
  const [currentCell, setCurrentCell] = useState({"key":null, "field":null});
  const [signatures, setSignatures] = useState({})
  const [data, setData] = useState(null)
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
  // const [data, setData] = useState([
  //   {
  //     key: "1",
  //     action: "N/A",
  //     configItem: "N - Application",
  //     aimsReference: "ATO-ATOA-01",
  //     softwareGenericVersion: "5.17BUILD00-30",
  //     softwareLocoSpecificData: "N/A",
  //     installBy: "Shiyu Tang",
  //     verifyBy: "(Click to sign)",
  //     validateBy: "(Click to sign)",
  //     note: "",
  //   },
  //   {
  //     key: "2",
  //     action: "N/A",
  //     configItem: "N - Base",
  //     aimsReference: "ATO-ATOA-01",
  //     softwareGenericVersion: "06.09",
  //     softwareLocoSpecificData: "N/A",
  //     installBy: "Shiyu Tang",
  //     verifyBy: "(Click to sign)",
  //     validateBy: "(Click to sign)",
  //     note: "",
  //   },
  //   {
  //     key: "3",
  //     action: "N/A",
  //     configItem: "R - Application",
  //     aimsReference: "ATO-ATOR-01",
  //     softwareGenericVersion: "N/A",
  //     softwareLocoSpecificData: "N/A",
  //     installBy: "N/A",
  //     verifyBy: "N/A",
  //     validateBy: "N/A",
  //     note: "",
  //   },
  //   {
  //     key: "4",
  //     action: "N/A",
  //     configItem: "R - Base",
  //     aimsReference: "ATO-ATOR-01",
  //     softwareGenericVersion: "N/A",
  //     softwareLocoSpecificData: "N/A",
  //     installBy: "N/A",
  //     verifyBy: "N/A",
  //     validateBy: "N/A",
  //     note: "",
  //   },
  // ])
  const { baselineId } = useParams();

   useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          const data = await fetchBaselineData(baselineId);
          setData(data);
        } catch (err) {
          message.error("Failed to load table data")
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, [baselineId]);

    if (loading) {
      return <Spin style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} size="large" tip="Loading Baseline..." />;
    }
    if (!data) {
      return <Alert message="Baseline data not found" type="error" />;
    }
  // Table columns configuration
  const columns = [
  
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
      width: 160,
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
      width: 100,
      className: "",
    },
    {
      title: "Install by",
      dataIndex: "installBy",
      key: "installBy",
      width: 100,
      className: "",
      render: (text, record) => {
        if (text == "(Click to sign)") {
          return (<Button
            type="default"
            icon={<UserOutlined />}
            onClick={() => handleSignatureClick(record.key, "installBy")}
          >
            Sign
          </Button>)
        }
        else{
          return( <div>
            {text}
          </div>)
         
        }

      }
    },

    {
      title: "Verify by",
      dataIndex: "verifyBy",
      key: "verifyBy",
      width: 100,
      className: "",
      render: (text, record) => {
        if (text == "(Click to sign)") {
          return (<Button
            type="default"
            icon={<UserOutlined />}
            onClick={() => handleSignatureClick(record.key, "verifyBy")}
          >
            Sign
          </Button>)
        }
        else{
          return( <div>
            {text}
          </div>)
         
        }

      }

    },
    {
      title: "Validate by",
      dataIndex: "validateBy",
      key: "validateBy",
      width: 100,
      className: "",
      render: (text, record) => {
        

        if (text == "(Click to sign)") {
          return (<Button
            type="default"
            icon={<UserOutlined />}
            onClick={() => handleSignatureClick(record.key, "validateBy")}
          >
            Sign
          </Button>)

        }
        else{
          return( <div>
            {text}
          </div>)
         
        }

      }
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: 200,
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
          {<TruncatedText text={text  || "Add note"} /> } <EditOutlined className="" />
          {/* {text  || "Add note"} <EditOutlined className="" /> */}

        </div>
      ),
    },
  ]

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
  const handleSignatureClick = (key, field) => {
    console.log(key, field, "1")
    setCurrentCell( {"key":key, "field":field})

    setIsSignatureModalOpen(true)

  }
  const handleSignatureCancel = () => {
    // Close the signature modal without saving
    setIsSignatureModalOpen(false)
  }

  const handleSignatureSubmit = () => {
    if (!username.trim()) {
      message.error("Please enter your username")
      return
    }
    const newData = [...data]
    const index = newData.findIndex((item) => item.key === currentCell.key)
    if (index > -1) {
      newData[index][currentCell.field] = username + " "+new Date().toLocaleString()
      setData(newData)
    }
    console.log(newData, "new", currentCell.key, currentCell.field)

  
    setSignatures({   username: username,
      timestamp: new Date().toLocaleString(),})

    // Add the signature with username and timestamp
  

    // Close the signature modal
    setIsSignatureModalOpen(false)

    // Show success message
    message.success(`Signed by ${username}`)
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
        <Input.TextArea style={{ marginBottom: "20px" }}
          showCount
          maxLength={100}
          // autoSize={{ minRows: 2, maxRows: 4 }}
          rows={4}
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Enter note here"
        />
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
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        bordered
        size="middle"
        className={""}
      />
    </div>
  );
};
export default BaselineDetail;